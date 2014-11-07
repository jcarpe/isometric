define([ "utils" ], function( Utils ) {

    var canvas
        , ctx
        , pixelCollections = []
        ;

    var ImageProcessor = function() {

        this.init();
    }

    ImageProcessor.prototype.init = function() {

        canvas = document.createElement( 'canvas' );

        ctx = canvas.getContext('2d');

    }

    ImageProcessor.prototype.readImage = function( imageName, imageObject ) {

        var width = imageObject.naturalWidth
            , height = imageObject.naturalHeight
            ;

        canvas.setAttribute( 'width', width );
        canvas.setAttribute( 'height', height );

        ctx.drawImage( imageObject, 0, 0, width, height );

        var pixels = ctx.getImageData( 0, 0, width, height );

        pixelCollections[ imageName ] = pixels;

    }

    ImageProcessor.prototype.renderImage = function ( imageName, triangleCountY, triangleCountX, triangleList ) {

        if( !pixelCollections[ imageName ] ) {
            
            return;
        }

        var row = 0;
        var col = 0;
        var average = [0,0,0];
        var tX = 0;
        var tY = 0;
        var pixelSet = pixelCollections[ imageName ];


        var colLen = Math.floor( pixelSet.width / triangleCountX );

        for( var i = 0; i < pixelSet.data.length; i += 4 ) {

            //average the approximate pixels for the triangle
            average[0] += pixelSet.data[ i + 0 ];
            average[1] += pixelSet.data[ i + 1 ];
            average[2] += pixelSet.data[ i + 2 ];

            if( col >= triangleCountX ) {
                col = triangleCountX - 1;
            }

            if( i/4 % colLen === 0 ) {

                average[0] /= colLen * 0.5;
                average[1] /= colLen * 0.5;
                average[2] /= colLen * 0.5;

                tX = Math.floor( Utils.map( row, 0, pixelSet.height, 0 , triangleCountY - 1 ) );

                if( !!triangleList[ col ] && !!triangleList[ col ][ ( triangleCountY - 1 ) - tX ] ) {

                    triangleList[col][ ( triangleCountY - 1 ) - tX ].material.color.setRGB( average[0]/255 , average[1]/255 , average[2]/255 );
                }
                average = [0,0,0];
                col++;
            }


            if( i / 4 % pixelSet.width === 0 ) {
                col = 0;
                row++;
            }
        }
    }

    return ImageProcessor;
});

