var { ShaderMaterial, ShaderLib, UniformsUtils, Color } = require('./three.js');

var fs = require('fs');
var vertexShader = fs.readFileSync( __dirname + '/vert.glsl', 'utf8' )
var fragmentShader = fs.readFileSync( __dirname + '/frag.glsl', 'utf8' )

module.exports = class extends ShaderMaterial {
	constructor ( options ) {
		var uniforms = UniformsUtils.clone( ShaderLib.standard.uniforms );
		for ( var key in options ) {
			uniforms[ key ].value = options[ key ];
		}
		uniforms.ambientLightColor.value = new Color( 0x000000 );
		uniforms.texScale = { value: 1 };
		var defines = {};
		if ( options.map ) defines.USE_MAP = 1;
		if ( options.roughnessMap ) defines.USE_ROUGHNESSMAP = 1;
		if ( options.normalMap ) defines.USE_NORMALMAP = 1;
		super({
			lights: false,
			vertexShader,
			fragmentShader,
			uniforms,
			defines,
			extensions: {
				derivatives: true
			}
		});
	}
}