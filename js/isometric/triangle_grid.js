define(["three", "utils"], function( THREE, Utils ) {

	// var TRIANGLES = null;
	var CURSOR_RADIUS = 7;
	var TRI_COUNT_X = 39;
	var TRI_COUNT_Y = 19;
	var TRI_SPACING = 0.05;

	var TriGrid = function() {
		
		this.renderFullGrid = function( scene ) {
			this.TRIANGLES.forEach( function( row ) {
				row.forEach( function( tri ) {
					scene.add( tri );
				});
			});
		};

		this.reset = function() {
			this.TRIANGLES.forEach( function( row ) {
				row.forEach( function( tri ) {
					tri.position.x = tri.origPos.x;
					tri.position.y = tri.origPos.y;
					tri.position.z = tri.origPos.z;
					tri.rotation.x = 0;
					tri.rotation.y = 0;
				});
			});
		};

		this.congeal = function( mouseX, mouseY ) {
			mouseX = Utils.map( mouseX, 0, document.documentElement.clientWidth, 0, TRI_COUNT_X-1 );
			mouseY = Utils.map( mouseY, 0, document.documentElement.clientHeight, 0, TRI_COUNT_Y-1 );

			this.TRIANGLES.forEach( function( col ) {
				col.forEach( function( tri ) {
					var dist = Math.sqrt( Math.pow((tri.gridPos.x-mouseX), 2) + Math.pow((tri.gridPos.y-mouseY), 2) );
					var posX = tri.origPos.x; 
					var posY = tri.origPos.y;
					var posZ = tri.origPos.z;

					if ( dist < CURSOR_RADIUS ) {
						posX += (TRI_SPACING*(mouseX-tri.gridPos.x));
						posY += (TRI_SPACING*(mouseY-tri.gridPos.y));
						posZ += 0.5;
					} else {
						// tri.material = wireMaterial;
					}

					tri.position.x = posX;
					tri.position.y = posY;
					tri.position.z = posZ;
				});
			});	
		};

		this.pushRadius = function( mouseX, mouseY ) {
			mouseX = Utils.map( mouseX, 0, document.documentElement.clientWidth, 0, TRI_COUNT_X-1 );
			mouseY = Utils.map( mouseY, 0, document.documentElement.clientHeight, 0, TRI_COUNT_Y-1 );

			this.TRIANGLES.forEach( function( col ) {
				col.forEach( function( tri ) {
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

		this.TRIANGLES = this.generateTriGrid();
	};

	TriGrid.prototype.generateTriangle = function( flip ) {
		var material = new THREE.MeshLambertMaterial({ color:0x009530, side:THREE.DoubleSide });
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

		var mesh = new THREE.Mesh( geometry, material );

		return mesh;
	};

	TriGrid.prototype.generateTriGrid = function() {
		var triMatrix = [];
		var flip = false;

		for ( var i = 0; i < TRI_COUNT_X; i++ ) {
			var triCol = [];

			for ( var j = 0; j < TRI_COUNT_Y; j++ ) {
				var xPos = i*Math.sqrt(0.75) + TRI_SPACING*i - (TRI_COUNT_X*Math.sqrt(0.75))/2;
				var yPos = j/2 + TRI_SPACING*j - TRI_COUNT_Y/4;
				var tri = this.generateTriangle( flip );
					
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

				triCol.push( tri );

				if ( !flip ) { flip = true; }
				else { flip = false; }
			}

			triMatrix.push( triCol );
		}

		return triMatrix;
	};

	return TriGrid;

});