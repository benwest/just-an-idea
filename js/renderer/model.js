var { TextureLoader, JSONLoader, Mesh, MeshStandardMaterial, Vector2 } = require('./three.js');

var texLoader = new TextureLoader();
var jsonLoader = new JSONLoader();

var loadTexture = url => new Promise( resolve => texLoader.load( url, resolve ) );
var loadJSON = url => new Promise( resolve => jsonLoader.load( url, resolve ) );

module.exports = envMap => Promise.all([
	loadJSON('./static/geometry.json'),
	loadTexture('./static/diffuse.jpg'),
	loadTexture('./static/normal.png'),
	// loadTexture('./assets/roughness.jpg')
]).then( ([ geometry, map, normalMap/*, roughnessMap */ ]) => {
	return new Mesh( geometry, new MeshStandardMaterial({
		envMap,
		normalMap,
		normalScale: new Vector2( .6, 0 ),
		map,
		// roughnessMap,
		roughness: 0,
		metalness: 1
	}));
})

// var { TextureLoader, Geometry, Mesh, MeshStandardMaterial, Vector2 } = require('./three.js');
// var FBXLoader = require('three-fbx-loader');

// var texLoader = new TextureLoader();
// var fbxLoader = new FBXLoader();

// var loadModel = url => new Promise( resolve => fbxLoader.load( url, resolve ) );
// var loadTexture = url => new Promise( resolve => texLoader.load( url, resolve ) );
// var flipFace = face => {
// 	var tmp = face.a;
// 	face.a = face.c;
// 	face.c = tmp;
// }
// var flipUV = uvs => {
// 	var tmp = uvs[ 0 ];
// 	uvs[ 0 ] = uvs[ 2 ];
// 	uvs[ 2 ] = tmp;
// }
// var flipNormals = geometry => {
// 	geometry.faces.forEach( flipFace );
// 	geometry.faceVertexUvs[ 0 ].forEach( flipUV );
// }

// var precision = x => Number( x.toPrecision( 4 ) );

// module.exports = envMap => Promise.all([
// 	loadModel('./assets/phone1.fbx'),
// 	loadTexture('./assets/diffuse.jpg'),
// 	loadTexture('./assets/normal.jpg'),
// 	loadTexture('./assets/roughness.jpg')
// ]).then( ([ model, map, normalMap, roughnessMap ]) => {
// 	var obj = model.children.find( o => o.type === 'Mesh' );
// 	var geometry = new Geometry().fromBufferGeometry( obj.geometry );
// 	// geometry.rotateX(  );
// 	geometry.mergeVertices();
// 	flipNormals( geometry );
// 	geometry.computeFaceNormals();
// 	geometry.computeVertexNormals();
// 	return new Mesh( geometry, new MeshStandardMaterial({
// 		envMap,
// 		normalMap,
// 		normalScale: new Vector2( .6, 0 ),
// 		map,
// 		// roughnessMap,
// 		roughness: 0,
// 		metalness: 1
// 	}));
// })