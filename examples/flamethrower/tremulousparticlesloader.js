function TremulousParticuleLoader(urls, callback){
	var spriteSheet	= null;

	// load all the images and convert them
	var flow	= Flow();
	urls.forEach(function(url, idx){
		flow.par(function(next){
			var image	= new Image;
			image.onload	= function(){
				// init spriteSheet if needed
				if( !spriteSheet ){
					spriteSheet	= document.createElement('canvas');
					spriteSheet.width	= image.width;
					spriteSheet.height	= image.height * urls.length;	
					//document.body.appendChild(spriteSheet)
				}
				console.assert(spriteSheet.width === image.width, 'All images must have the same size')
				console.assert(spriteSheet.height === image.height * urls.length, 'All images must have the same size')
				
				
				// convert the image
				var result	= convertTremulousImage(image);
				// draw it on the spritesheet
				var ctx		= spriteSheet.getContext('2d');
				ctx.drawImage(result, 0, image.height * idx);
				// goto the next step								
				next();
			};
			image.src	= url;
		});
	});

	// build the function which is run once all is loaded
	flow.seq(function(){
		//console.log("all flow completed")
		// notify the caller
		callback(spriteSheet, urls);
	})

	/**
	 * Convert images from tremulous. 
	 * They are originally in .tga without alpha channel.
	 * The alpha channel is created based on the luminance of each pixel.
	 * alpha === luminance*16
	*/
	function convertTremulousImage(image, callback){
		// create a canvas
		var canvas	= document.createElement('canvas');
		canvas.width	= image.width;
		canvas.height	= image.height;	
		var ctx		= canvas.getContext('2d');
		// draw the image in it
		ctx.drawImage(image, 0, 0);
		
		// create an alpha channel based on color luminance
		var imgData	= ctx.getImageData(0, 0, canvas.width, canvas.height);
		var p		= imgData.data;
		for(var i = 0, y = 0; y < canvas.height; y++){
			for(var x = 0; x < canvas.width; x++, i += 4){
				var luminance	= (0.2126*p[i+0]) + (0.7152*p[i+1]) + (0.0722*p[i+2]);
				p[i+3]		= luminance * 16;
				
				// luminance	= luminance/255;
				// //luminance	= luminance * luminance * luminance* luminance;
				// //luminance	= luminance * luminance;
				// p[i+3]		= Math.floor(luminance * 16 * 255);
				// //p[i+3]	= luminance * 4;
			}
		}
		// put the generated image in the canvas
		ctx.putImageData(imgData, 0, 0);
		// return the resulting canvas
		return ctx.canvas;
	}

	return;

	// from gowiththeflow.js - https://github.com/jeromeetienne/gowiththeflow.js
	function Flow(){
		var self, stack = [], timerId = setTimeout(function(){ timerId = null; self._next(); }, 0);
		return self = {
			destroy : function(){ timerId && clearTimeout(timerId); },
			par	: function(callback, isSeq){
				if(isSeq || !(stack[stack.length-1] instanceof Array)) stack.push([]);
				stack[stack.length-1].push(callback);
				return self;
			},seq	: function(callback){ return self.par(callback, true);	},
			_next	: function(err, result){
				var errors = [], results = [], callbacks = stack.shift() || [], nbReturn = callbacks.length, isSeq = nbReturn == 1;
				for(var i = 0; i < callbacks.length; i++){
					(function(fct, index){
						fct(function(error, result){
							errors[index]	= error;
							results[index]	= result;		
							if(--nbReturn == 0)	self._next(isSeq?errors[0]:errors, isSeq?results[0]:results)
						}, err, result)
					})(callbacks[i], i);
				}
			}
		}
	};
}