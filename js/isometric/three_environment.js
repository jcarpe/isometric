define(["three"], function( THREE ) {

	var scene
		, camera
		, renderer
		, lights = []
		, interaction = "push"
		, time = new Date()
		, options = {
			onRenderStart: function() {},
	        onRenderFinish: function() {},
	        onUpdate: function( delta ) {},
	        onInit: function() {}
		};

	var Environment = function( customOptions ) {

		this.getScene = function() {
			return scene;
		};

		this.getRenderer = function () {
			return renderer;
		};

		this.getCamera = function () {
			return camera;
		};

		this.getLights = function () { 
			return lights;
		};

	    this.addLight = function ( light ) {
	        lights.push( light );
	        scene.add( light );
	    };

	    this.removeLight = function ( light ) {
	        lights.splice( lights.indexOf( light ), 1 );
	        scene.remove( light );
	    };

		this.init( customOptions );
	};

	Environment.prototype.init = function( customOptions ) {
		shallowCopy( options, customOptions || {} );
		this.build();
		options.onInit();
		this.enableListeners();
		render();
	};

	Environment.prototype.build = function() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
		renderer = new THREE.WebGLRenderer({ antialias:true });
		
		camera.position.z = 10;	
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setClearColor( 0xffffff, 1 );

		document.body.appendChild( renderer.domElement );

		var pointLight = new THREE.PointLight( 0xFFFFFF, 1, 0 );
			pointLight.position.set( 0, 0, 10 );
		this.addLight( pointLight );
	};

	Environment.prototype.enableListeners = function() {
		document.onmousemove = function( e ) {
			var transX = (e.clientX - document.documentElement.clientWidth/2);
			var transY = (e.clientY - document.documentElement.clientHeight/2);

			camera.rotation.y = THREE.Math.degToRad( transX/100 );
			camera.rotation.x = THREE.Math.degToRad( transY/100 );

			switch ( interaction ) {
				case "push":
					window.triGrid.pushRadius( e.clientX, Math.abs(e.clientY-document.documentElement.clientHeight) );
					break;

				case "congeal":
					window.triGrid.congeal( e.clientX, Math.abs(e.clientY-document.documentElement.clientHeight) );
					break;

				default:
					window.triGrid.pushRadius( e.clientX, Math.abs(e.clientY-document.documentElement.clientHeight) );
			}
		};

		document.onclick = function() {
			if ( interaction === "push" ) { interaction = "congeal"; }
			else { interaction = "push" }

			window.triGrid.reset();
		};
	};

	var render = function() {
		requestAnimationFrame( render );

        var delta = (+new Date()) - time;

        options.onUpdate( delta );

        time = new Date();

        options.onRenderStart();

        renderer.render(scene, camera);

        options.onRenderFinish();
	};

    var shallowCopy = function ( parObj, cpyObj ) {

        var keys = Object.keys( cpyObj )
            , key
            ;

        for( var i = 0; i < keys.length; ++i ) {

            key = keys[ i ];

            parObj[ key ] = cpyObj[ key ]; 
        }
    };

	return Environment;

});

