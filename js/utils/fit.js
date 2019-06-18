var fit = fn => ( src, dest, out ) => {
	var scale = fn( dest.x / src.x, dest.y / src.y );
	return out ? out.copy( src ).multiplyScalar( scale ) : scale;
}

module.exports = {
	cover: fit( Math.max ),
	contain: fit( Math.min )
}