
require.config({
	paths : {
		// vendor libs
		"three": "vendor/three/three",

		// -----
		"environment": "isometric/three_environment",
		"triGrid": "isometric/triangle_grid"
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

require(["environment", "triGrid"], function(Environment, TriGrid) {
	window.environment = new Environment();
	
	window.triGrid = new TriGrid();
	window.triGrid.renderFullGrid( window.environment.getScene() );
});