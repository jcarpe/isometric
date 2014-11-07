var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({ antialias:true });
	renderer.setSize( window.innerWidth, window.innerHeight );

var pointLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
	pointLight.position.set( 0, 0, 5 );

scene.add(pointLight);

document.body.appendChild( renderer.domElement );

var TRIANGLES = null;
var CURSOR_RADIUS = 5;
var TRI_COUNT = 5;
var TRI_SPACING = 0.05;
var COLORS = {
	Green:0x009530,
	Creme:0xe8ddc9
};

var generateTriangle = function( flip ) {
	var material = new THREE.MeshLambertMaterial( { color:COLORS.Green, side:THREE.DoubleSide, wireframe:true } );
	var triShape = new THREE.Shape();

	if ( !flip ) {
		triShape.moveTo( -Math.sqrt(0.75)/2, 0 );
		triShape.lineTo( Math.sqrt(0.75)/2, 0.5 );
		triShape.lineTo( Math.sqrt(0.75)/2, -0.5 );
		triShape.lineTo( -Math.sqrt(0.75)/2, 0 );
	} else {
		triShape.moveTo( -Math.sqrt(0.75)/2, 0.5 );
		triShape.lineTo( -Math.sqrt(0.75)/2, -0.5 );
		triShape.lineTo( Math.sqrt(0.75)/2, 0 );
		triShape.lineTo( -Math.sqrt(0.75)/2, 0.5 );
	}

	var geometry = new THREE.ExtrudeGeometry( triShape, {
		amount: 0.01, steps: 1
	});
		geometry.computeBoundingSphere();
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

	var mesh = new THREE.Mesh( geometry, material );
		mesh.position.z = -10;
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
				tri.translateX( xPos*15 );
				tri.translateY( yPos*15 );
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

var render = function () {
	requestAnimationFrame( render );
	renderer.render(scene, camera);
};

document.onmousemove = function( e ) {
	var transX = (e.clientX - document.documentElement.clientWidth/2);
	var transY = (e.clientY - document.documentElement.clientHeight/2);

	camera.rotation.y = THREE.Math.degToRad( transX/100 );
	camera.rotation.x = THREE.Math.degToRad( transY/100 );
};

generateTriGrid();
camera.position.z = 10;
render();