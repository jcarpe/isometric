define([], function() {

	var Utils = {

		map: function( value, start1, stop1, start2, stop2 ) {
			return ( (value-start1)*(stop2-start2)/(stop1-start1) );
		}

	};

	return Utils;

});