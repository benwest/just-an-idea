var { cover, contain } = require('../utils/fit');
var { CubeTexture, Vector2 } = require('./three.js');

var visibleSize = new Vector2();
var videoSize = new Vector2();
var offset = new Vector2();
var size = new Vector2();

var ensureOdd = x => Math.floor( x / 2 ) * 2 + 1;

module.exports = class EnvMap extends CubeTexture {
	constructor ( size = 1024 ) {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = size;
		super( Array( 6 ).fill( canvas ) );
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.size = new Vector2( size, size );
		// document.body.appendChild( this.canvas );
		// this.canvas.style.zIndex = 1000;
		// this.canvas.style.width = this.canvas.style.height = '100vmin';
	}
	update ( video, viewport ) {
		// videoSize.set( Math.max( video.videoWidth, 1 ), Math.max( video.videoHeight, 1 ) );
		// contain( viewport, this.size, visibleSize );
		// var scale = cover( videoSize, visibleSize );
		// size.copy( videoSize ).multiplyScalar( scale );
		// offset.copy( this.size ).sub( size ).multiplyScalar( .5 );
		// this.ctx.save();
		// this.ctx.scale( -1, 1 );
		// this.ctx.drawImage( video, -this.size.x, 0, this.size.x, this.size.y );
		// this.ctx.drawImage( video, -this.size.x + offset.x, offset.y, size.x, size.y )
		// this.ctx.restore();
		this.ctx.drawImage( video, 0, 0 );
		this.needsUpdate = true;
	}
}