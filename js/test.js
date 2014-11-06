var TRIANGLES = null;
var CURSOR_RADIUS = 7;
var TRI_COUNT = 59;
var TRI_SPACING = 0.05;
var COLORS = {
	Green:0x009530,
	Creme:0xe8ddc9
};

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ antialias:true });
	renderer.setSize( window.innerWidth, window.innerHeight );

var pointLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
	pointLight.position.set( 0, 0, 5 );

// var cityTex = THREE.ImageUtils.loadTexture( './img/pony.jpg' );
// var cityMaterial = [new THREE.MeshLambertMaterial({ map:cityTex })];

var cityMaterial = new THREE.MeshLambertMaterial({
	map: THREE.ImageUtils.loadTexture( './img/boston-skyline.jpg' ),
	side:THREE.DoubleSide
});

var material = new THREE.MeshLambertMaterial({ color:COLORS.Green, side:THREE.DoubleSide });
var wireMaterial = new THREE.MeshLambertMaterial({ color:COLORS.Green, wireframe:true, side:THREE.DoubleSide, vertexColors:THREE.VertexColors });

scene.add(pointLight);

document.body.appendChild( renderer.domElement );

var dropCenter = function() {
	var geometry = new THREE.BoxGeometry( 14.4, 10.4, 10.4 );
	var cube = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( cityMaterial ) );
		cube.position.z -= 10;

	scene.add( cube );
};

var generateTriangle = function( flip ) {
	var geometry = new THREE.Geometry();

		if ( !flip ) {
			geometry.vertices.push(
				new THREE.Vector3( -Math.sqrt(0.75)/2, 0, 0 ),
				new THREE.Vector3( Math.sqrt(0.75)/2, 0.5, 0 ),
				new THREE.Vector3( Math.sqrt(0.75)/2, -0.5, 0 )
			);
		} else {
			geometry.vertices.push(
				new THREE.Vector3( -Math.sqrt(0.75)/2, 0.5, 0 ),
				new THREE.Vector3( -Math.sqrt(0.75)/2, -0.5, 0 ),
				new THREE.Vector3( Math.sqrt(0.75)/2, 0, 0 )
			);
		}

		geometry.faceVertexUvs = [[]];
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0, 0),
			new THREE.Vector2(0, 1),
			new THREE.Vector2(1, 1)
		]);

		geometry.faces.push( new THREE.Face3( 2, 1, 0 ) );
		geometry.computeBoundingSphere();
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

	var mesh = new THREE.Mesh( geometry, wireMaterial );

	return mesh;
};

var generateTriGrid = function() {
	var triMatrix = [];
	var flip = false;

	for ( var i = 0; i < TRI_COUNT; i++ ) {
		var triRow = [];

		for ( var j = 0; j < TRI_COUNT; j++ ) {
			var xPos = i*Math.sqrt(0.75) + TRI_SPACING*i - (TRI_COUNT*Math.sqrt(0.75))/2;
			var yPos = j/2 + TRI_SPACING*j - TRI_COUNT/4;
			var tri = generateTriangle( flip );
				tri.translateX( xPos );
				tri.translateY( yPos );
				tri.translateZ( -5 );
				tri.gridPos = {};
				tri.gridPos.x = i;
				tri.gridPos.y = j;
				tri.origPos = {};
				tri.origPos.x = tri.position.x;
				tri.origPos.y = tri.position.y;
				tri.origPos.z = tri.position.z;
				tri.name = "triangle-"+i+"-"+j;

			triRow.push( tri );
			scene.add( tri );

			if ( !flip ) { flip = true; }
			else { flip = false; }
		}

		triMatrix.push( triRow );
	}

	return triMatrix;
};

var fillShape = function( startX, startY, width, height ) {
	var step = 0;
	for ( var i = startX; i < startX+width; i++ ) {
		for ( var j = startY; j < startY+height; j++ ) {
			TRIANGLES[i][j+step].material = material;
		}
		
		step++;
	}
};

var congeal = function( mouseX, mouseY ) {
	mouseX = map( mouseX, 0, document.documentElement.clientWidth, 0, TRI_COUNT-1 );
	mouseY = map( mouseY, 0, document.documentElement.clientHeight, 0, TRI_COUNT-1 );

	TRIANGLES.forEach( function( row ) {
		row.forEach( function( tri ) {
			var dist = Math.sqrt( Math.pow((tri.gridPos.x-mouseX), 2) + Math.pow((tri.gridPos.y-mouseY), 2) );
			var posX = tri.origPos.x; 
			var posY = tri.origPos.y;
			var posZ = tri.origPos.z;

			if ( dist < CURSOR_RADIUS ) {
				posX += (TRI_SPACING*(mouseX-tri.gridPos.x));
				posY += (TRI_SPACING*(mouseY-tri.gridPos.y));
				posZ += 0.5;
				tri.material = material;
			} else {
				tri.material = wireMaterial;
			}

			tri.position.x = posX;
			tri.position.y = posY;
			tri.position.z = posZ;
		});
	});	
};

var pushRadius = function( mouseX, mouseY ) {
	mouseX = map( mouseX, 0, document.documentElement.clientWidth, 0, TRI_COUNT-1 );
	mouseY = map( mouseY, 0, document.documentElement.clientHeight, 0, TRI_COUNT-1 );

	TRIANGLES.forEach( function( row ) {
		row.forEach( function( tri ) {
			var dist = Math.sqrt( Math.pow((tri.gridPos.x-mouseX), 2) + Math.pow((tri.gridPos.y-mouseY), 2) );
			var rotX, rotY;

			if ( dist > CURSOR_RADIUS ) {
				rotY = 0;
				rotX = 0;
			} else {
				rotY = (CURSOR_RADIUS - dist)/2;
				rotX = (CURSOR_RADIUS - dist)/2;

			}

			tri.rotation.x = rotX;
			tri.rotation.y = rotY;
		});
	});
};

var map = function( value, start1, stop1, start2, stop2 ) {
	return ( (value-start1)*(stop2-start2)/(stop1-start1) );
};

var render = function () {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};

document.onmousemove = function( e ) {
	var transX = (e.clientX - document.documentElement.clientWidth/2);
	var transY = (e.clientY - document.documentElement.clientHeight/2);

	camera.rotation.y = THREE.Math.degToRad( transX/100 );
	camera.rotation.x = THREE.Math.degToRad( transY/100 );

	// pushRadius( e.clientX, Math.abs(e.clientY-document.documentElement.clientHeight) );
	// congeal( e.clientX, Math.abs(e.clientY-document.documentElement.clientHeight) );
};

TRIANGLES = generateTriGrid();
// dropCenter();
camera.position.z = 10;
render();