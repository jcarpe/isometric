
require.config({
	paths : {
		// vendor libs
		"three": "vendor/three/three",

		// -----
		"utils": "utils/utils",
		"environment": "isometric/three_environment",
		"triGrid": "isometric/triangle_grid",
		"imageProcessor": "isometric/image_processor"
	},

	shim : {
		"three": {
			exports: "THREE"
		},
		"environment": {
			deps: ["three"],
			exports: "Environment"
		},
		"triGrid": {
			deps: ["three"],
			exports: "TriGrid"
		}
	}
});

require(["environment", "triGrid", "imageProcessor"], function(Environment, TriGrid, ImageProcessor) {
	window.environment = new Environment();

	window.triGrid = new TriGrid();
	window.triGrid.renderFullGrid( window.environment.getScene() );

	var imageProcessor = new ImageProcessor();

	imageProcessor.readImage( 'hills', document.getElementById( 'sap' ) );

	imageProcessor.renderImage( 'hills', 19, 39, window.triGrid.TRIANGLES )

});