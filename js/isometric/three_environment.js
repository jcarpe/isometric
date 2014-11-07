define(["three"], function( THREE ) {

	var scene, camera, renderer, pointLight;

	var Environment = function() {

		this.getScene = function() {
			return scene;
		};

		this.init();
	};

	Environment.prototype.init = function() {
		this.build();
		this.enableListeners();
		render();
	};

	Environment.prototype.build = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer({ antialias:true });
		pointLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
		
		pointLight.position.set( 0, 0, 10 )
		camera.position.z = 10;	
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( 0xffffff, 1 );

		document.body.appendChild( renderer.domElement );

		scene.add( pointLight );
	};

	Environment.prototype.enableListeners = function() {
		document.onmousemove = function( e ) {
			var transX = (e.clientX - document.documentElement.clientWidth/2);
			var transY = (e.clientY - document.documentElement.clientHeight/2);

			camera.rotation.y = THREE.Math.degToRad( transX/100 );
			camera.rotation.x = THREE.Math.degToRad( transY/100 );

			window.triGrid.pushRadius( e.clientX, Math.abs(e.clientY-document.documentElement.clientHeight) );
			// window.triGrid.congeal( e.clientX, Math.abs(e.clientY-document.documentElement.clientHeight) );
		};
	};

	function render() {
		requestAnimationFrame( render );
		renderer.render( scene, camera );
	}

	return Environment;

});