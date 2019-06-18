var { execSync } = require('child_process');

var cmd = file => `ffmpeg -i "${ file }" -f null - 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,// | awk '{ split($1, A, ":"); split(A[3], B, "."); print 3600*A[1] + 60*A[2] + A[3] }'`;

module.exports = file => {
	return Number( execSync( cmd( file ) ).toString() );
}

// module.exports = file => {
// 	console.log( `ffmpeg -i ${ file } -f null - 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,// | awk '{ split($1, A, ":"); split(A[3], B, "."); print 3600*A[1] + 60*A[2] + A[3] }'` );

// 	Number( execSync(`ffmpeg -i ${ file } -f null - 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,// | awk '{ split($1, A, ":"); split(A[3], B, "."); print 3600*A[1] + 60*A[2] + A[3] }'`) );
// }