var THREE = require('three');
var tween = require('./utils/tween');
var {
	Vector2,
	Vector3,
	Scene, 
	WebGLRenderer,
	PerspectiveCamera,
	Geometry,
	PlaneGeometry,
	MeshStandardMaterial,
	DirectionalLight,
	TextureLoader,
	Mesh,
	LinearFilter,
	CubeTexture,
} = THREE;
var { CSS3DRenderer, CSS3DObject } = require('three-css3drenderer');
var FBXLoader = require('three-fbx-loader');

var video = document.createElement('video');
video.src = './teaser.mp4';
// video.src = './title_big.mov';
video.muted = true;
video.loop = true;
video.play();
// window.addEventListener('click', () => video.play() );

var fovH = ( fovV, w, h ) => 2 * Math.atan( ( w / h ) * Math.tan( fovV / 2 ) );
var fovV = ( fovH, w, h ) => 2 * Math.atan( ( h / w ) * Math.tan( fovH / 2 ) );
var degToRad = deg => ( deg / 180 ) * Math.PI;
var radToDeg = rad => ( rad / Math.PI ) * 180;

var fov = window.innerWidth > window.innerHeight
	? radToDeg( fovV( degToRad( 90 ), window.innerWidth, window.innerHeight ) )
	: 90;
	
var scene = new Scene();
var camera = new PerspectiveCamera( 30, window.innerWidth / window.innerHeight, .1, 10000 );
var renderer = new WebGLRenderer({ antialias: true, physicallyCorrectLights: true });
renderer.setPixelRatio( 1 );
var cssRenderer = new CSS3DRenderer();
// var controls = new OrbitControls( camera );
var texLoader = new TextureLoader();
// var cubeTexLoader = new CubeTextureLoader();
var fbxLoader = new FBXLoader();

var onResize = () => {
	renderer.setSize( window.innerWidth, window.innerHeight );
	cssRenderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

cssRenderer.domElement.classList.add('css-renderer');
document.body.appendChild( cssRenderer.domElement );
document.body.appendChild( renderer.domElement );

camera.position.y = 15.5;
camera.lookAt( new Vector3() );

var canvas = document.createElement('canvas');
canvas.width = canvas.height = 1024;
var ctx = canvas.getContext('2d');
ctx.scale( -1, 1 );
ctx.translate( -1024, 0 );
var envMap = new CubeTexture( Array( 6 ).fill( canvas ) )

var floor = new Mesh( new PlaneGeometry( 500, 500 ), new MeshStandardMaterial({
	envMap,
	color: 0xffffff,
	roughness: 0,
	metalness: 1
}));
floor.rotation.x -= Math.PI / 2;
floor.position.y = -10;
scene.add( floor );

var phone;

fbxLoader.load('./phone1.fbx', group => {
	var obj = group.children.find( o => o.type === 'Mesh' );
	var geometry = new Geometry().fromBufferGeometry( obj.geometry );
	// geometry.scale( .1, .1, .1 );
	geometry.rotateX( Math.PI / -2 );
	geometry.mergeVertices();
	geometry.faces.forEach( ( face, i ) => {
		var tmp = face.a;
		face.a = face.c;
		face.c = tmp;
		var uvs = geometry.faceVertexUvs[ 0 ][ i ];
		tmp = uvs[ 0 ];
		uvs[ 0 ] = uvs[ 2 ];
		uvs[ 2 ] = tmp;
	});
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	var normalMap = texLoader.load('./normal.jpg');
	normalMap.minFilter = LinearFilter;
	phone = new Mesh( geometry, new MeshStandardMaterial({
		envMap,
		normalMap,
		normalScale: new Vector2( .6, 0 ),
		map: texLoader.load('./diffuse.jpg'),
		// roughness: 0,
		roughnessMap: texLoader.load('./roughness.jpg'),
		metalness: 1
	}));
	phone.position.y += .07;
	var screen = new CSS3DObject( document.getElementById('screen') );
	screen.position.y += .1;
	screen.rotation.x -= Math.PI / 2;
	screen.scale.set( 3/320, 3/320, 3/320 );
	phone.add( screen );
	scene.add( phone );
})

var light = new DirectionalLight( 0xffffff, 1 );
light.position.z = -1;
// scene.add( light );

var rotated = false;

window.addEventListener('click', () => {
	if ( !phone ) return;
	document.body.classList.toggle('about-open');
	var from = phone.rotation.z;
	var to = rotated ? 0 : Math.PI / -2;
	var d = Math.abs( from - to );
	var duration = 2000 * ( d / ( Math.PI / 2 ) );
	tween({
		name: 'rotate', from, to, duration, easing: 'linear',
		onProgress: z => phone.rotation.z = z
	});
	rotated = !rotated;
})

var tick = () => {
	ctx.drawImage( video, -398, 0, 1820, canvas.height );
	envMap.needsUpdate = true;
	renderer.render( scene, camera );
	cssRenderer.render( scene, camera );
	requestAnimationFrame( tick );
}

onResize();
window.addEventListener('resize', onResize)
tick();

var icons = document.querySelector('.icons');
var chars = '1234560£%*SDKLxvN>'.split('');
var sample = arr => arr[ Math.floor( Math.random() * arr.length ) ];
var char = () => sample( chars.filter( char => !icons.innerText.includes( char )));
for ( var i = 0; i < 6; i++ ) icons.innerText += char();