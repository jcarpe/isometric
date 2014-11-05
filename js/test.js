var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

var pointLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
	pointLight.position.set( 0, 0, 5 );

scene.add(pointLight);

document.body.appendChild( renderer.domElement );

var TRIANGLES = null;
var CURSOR_RADIUS = 5;
var TRI_COUNT = 35;

var generateTriangle = function( flip ) {
	var material = new THREE.MeshLambertMaterial( { color:0x009530, side:THREE.DoubleSide } );
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

		geometry.faces.push( new THREE.Face3( 2, 1, 0 ) );
		geometry.computeBoundingSphere();
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

	var mesh = new THREE.Mesh( geometry, material );

	return mesh;
};

var generateTriGrid = function() {
	var triMatrix = [];
	var flip = false;
	var triSpacing = 0.05;

	for ( var i = 0; i < TRI_COUNT; i++ ) {
		var triRow = [];

		for ( var j = 0; j < TRI_COUNT; j++ ) {
			var xPos = i*Math.sqrt(0.75) + triSpacing*i - (TRI_COUNT*Math.sqrt(0.75))/2;
			var yPos = j/2 + triSpacing*j - TRI_COUNT/4;
			var tri = generateTriangle( flip );
				tri.translateX( xPos );
				tri.translateY( yPos );
				tri.translateZ( -5 );
				tri.gridPos = {};
				tri.gridPos.x = i;
				tri.gridPos.y = j;
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

var dropCenter = function() {
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var geometry = new THREE.BoxGeometry( 0.4, 0.4, 0.4 );
	var cube = new THREE.Mesh( geometry, material );
		cube.position.z -= 10;

	scene.add( cube );
};

var map = function( value, start1, stop1, start2, stop2 ) {
	return ( (value-start1)*(stop2-start2)/(stop1-start1) );
};

var render = function () {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};

document.onmousemove = function( e ) {
	// translate mouse position based on screen center
	var transX = (e.clientX - document.documentElement.clientWidth/2);
	var transY = (e.clientY - document.documentElement.clientHeight/2);

	camera.rotation.y = THREE.Math.degToRad( transX/100 );
	camera.rotation.x = THREE.Math.degToRad( transY/100 );

	pushRadius( e.clientX, Math.abs(e.clientY-document.documentElement.clientHeight) );
};

TRIANGLES = generateTriGrid();
// dropCenter();
camera.position.z = 5;
render();