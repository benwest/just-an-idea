var {
	Vector2,
	Vector3,
	Object3D,
	Scene, 
	WebGLRenderer,
	PerspectiveCamera,
	PlaneGeometry,
	MeshStandardMaterial,
	CubeTexture,
	CubeRepeatReflectionMapping,
	Texture,
	Mesh
} = require('./three.js');
var { CSS3DRenderer, CSS3DObject } = require('./THREE.CSS3DRenderer');
// var EnvMap = require('./envMap');
var loadModel = require('./model');
var tween = require('../utils/tween');
var { cover, contain } = require('../utils/fit');
var { PHONE_BREAKPOINT, MARGIN, PHONE_MARGIN } = require('../config');

var SCREEN_RATIO = new Vector2( 9, 16 );
var DISTANCE = 3;
var FOV_MAX = new Vector2( Math.PI / 2, Math.atan( 9 / 16 ) * 2 );

var fovH = ( fovV, viewport ) => 2 * Math.atan( ( viewport.x / viewport.y ) * Math.tan( fovV / 2 ) );
var fovV = ( fovH, viewport ) => 2 * Math.atan( ( viewport.y / viewport.x ) * Math.tan( fovH / 2 ) );
var fovMax = ( fov, viewport ) => viewport.x > viewport.y ? fovV( fov, viewport ) : fov;
var fovFit = ( max, viewport ) => fovH( max.y, viewport ) > max.x ? fovV( max.x, viewport ) : max.y;

var degToRad = deg => ( deg / 180 ) * Math.PI;
var radToDeg = rad => ( rad / Math.PI ) * 180;

module.exports = ( canvas, cssContainer, video ) => {

	var viewport = new Vector2( 1, 1 );

	// var envMap = new CubeTexture( Array( 6 ).fill( video ) );
	var envMap = new Texture( video );
	envMap.mapping = CubeRepeatReflectionMapping;
	// var envMap = new EnvMap();
	var phoneSize = new Vector3();

	var scene = new Scene();

	var camera = new PerspectiveCamera( fovMax( Math.PI / 2, viewport ), viewport.x / viewport.y, .1, 10000 );
	camera.position.z = 1;
	// scene.rotation.z = .05;
	camera.lookAt( new Vector3() );

	var renderer = new WebGLRenderer({ canvas, antialias: true });
	renderer.setPixelRatio( 1 );
	renderer.setClearColor( 0x000000 );

	var cssRenderer = new CSS3DRenderer( cssContainer );

	var phone = new Object3D();
	var screen = new CSS3DObject( document.createElement('div') );
	screen.element.id = 'screen';
	// phone.rotation.z = .05;
	// phone.rotation.x -= Math.PI / 2;
	phone.add( screen );

	var floor = new Mesh( new PlaneGeometry( 1, 1 ), new MeshStandardMaterial({
		color: 0xffffff,
		envMap,
		roughness: 0,
		metalness: 1
	}));
	floor.position.z = -10;

	var flattener = new Object3D();
	flattener.scale.set( 1, 1, 1 / DISTANCE );
	flattener.add( phone );

	scene.add( floor, flattener );

	var mesh = null, crack = null;

	var load = () => loadModel( envMap ).then( m => {
		mesh = m;
		mesh.geometry.computeBoundingBox();
		mesh.geometry.boundingBox.getSize( phoneSize );
		phone.add( mesh );
		crack = new Mesh( new PlaneGeometry( 1, 1 ), mesh.material );
		crack.geometry.translate( -.14, 0, 0 );
		phone.add( crack );
	})

	var layout = size => {
		viewport.copy( size );
		renderer.setSize( viewport.x, viewport.y );
		cssRenderer.setSize( viewport.x, viewport.y );
		camera.aspect = viewport.x / viewport.y;
		var fov = fovFit( FOV_MAX, viewport );
		var dist = ( viewport.y / 2 ) / Math.tan( fov / 2 );
		camera.fov = radToDeg( fov );
		// camera.position.y = 0;
		camera.updateProjectionMatrix();
		floor.position.z = -dist * DISTANCE * 2;
		floor.scale.set( viewport.x * 2 * DISTANCE, viewport.y * 2 * DISTANCE, 1 );
		var phoneSizeXY = new Vector2( phoneSize.x, phoneSize.y );
		var meshScale;
		if ( viewport.x < PHONE_BREAKPOINT ) {
			meshScale = cover( phoneSizeXY, viewport ) * ( 1 / ( 1 - PHONE_MARGIN * 2 ) );
			Object.assign( screen.element.style, {
				width: viewport.x + 'px',
				height: viewport.y + 'px',
			})
			mesh.visible = false;
			floor.visible = false;
			crack.visible = true;
		} else {
			var contentArea = viewport.clone().sub( new Vector2( MARGIN * 2, MARGIN * 2 ) );
			meshScale = contain( phoneSizeXY, contentArea );
			var maxScreenSize = phoneSizeXY.clone().multiplyScalar( meshScale * ( 1 - PHONE_MARGIN * 2 ) );
			var screenSize = contain( SCREEN_RATIO, maxScreenSize, new Vector2() );
			Object.assign( screen.element.style, {
				width: screenSize.x + 'px',
				height: screenSize.y + 'px',
			})
			mesh.visible = true;
			floor.visible = true;
			crack.visible = false;
		}
		mesh.scale.set( meshScale, meshScale, meshScale );
		crack.scale.set( phoneSize.y * meshScale, phoneSize.y * meshScale, 1 );
		screen.position.z = phoneSize.z * meshScale * .5;
		flattener.position.z = -dist * DISTANCE + phoneSize.z * meshScale * -.5;
		phone.scale.set( DISTANCE, DISTANCE, DISTANCE );
	}

	var update = () => {
		// envMap.update( video, viewport );
		if (!video.paused) envMap.needsUpdate = true;
		// phone.rotation.x += .01;
		// phone.rotation.y += .01;
	}

	var render = () => {
		renderer.render( scene, camera );
		cssRenderer.render( scene, camera );
	}

	var T = 0;
	var lerp = ( a, b, t ) => a + ( b - a ) * t;
	var rotate = to => {
		var from = T;
		var duration = Math.abs( from - to ) * 2000;
		return tween({ from, to, duration, easing: 'linear',
			onProgress: t => {
				phone.rotation.y = lerp( 0, Math.PI / 2, t );
				// floor.material.opacity = lerp( 1, 0, t );
				// floor.material.roughness = lerp( 0, .75, t );
				// floor.material.metalness = lerp( 1, .25, t );
				// floor.material.envMapIntensity = lerp( 1, .2, t );
				floor.material.needsUpdate = true;
				T = t;
			}
		})
	}
	// var rotate = to => {
	// 	var from = phone.rotation.y;
	// 	var d = Math.abs( from - to );
	// 	var duration = 2000 * ( d / ( Math.PI / 2 ) );
	// 	return tween({
	// 		name: 'rotate-phone', from, to, duration, easing: 'linear',
	// 		onProgress: y => {
	// 			phone.rotation.y = y;
	// 			floor.scale.x = 1 - y / Math.PI / 2;
	// 			console.log( floor.scale.x );
	// 		}
	// 	});
	// }

	return { load, screen, layout, update, render, rotate };

}