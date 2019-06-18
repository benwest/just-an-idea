var buildman = require('buildman');
var { execSync } = require('child_process');
var image = require('buildman/transforms/image');

buildman({
	transforms: {
		image,
		videoTiled: {
			extension: 'mp4',
			execute: ( inFile, outFile ) => execSync([
				'ffmpeg -y',
				`-i "${ inFile }"`,
				`-filter_complex "`,
					`nullsrc=size=1024x1024 [dest];`,
					`[0:v] setpts=PTS-STARTPTS, scale=1024x576 [top];`,
					`[0:v] setpts=PTS-STARTPTS, scale=1024x576 [center];`,
					`[0:v] setpts=PTS-STARTPTS, scale=1024x576 [bottom];`,
					`[dest][top] overlay=shortest=1:y=-352 [tmp1];`,
					`[tmp1][center] overlay=shortest=1:y=224 [tmp2];`,
					`[tmp2][bottom] overlay=shortest=1:y=800`,
				`"`,
				`-c:v libx264 -an -crf 25 "${ outFile }"`
			].join(' '))
		},
		videoSquare: {
			extension: 'mp4',
			execute: ( inFile, outFile ) => execSync([
				'ffmpeg -y',
				`-i "${ inFile }"`,
				`-filter_complex "`,
					`nullsrc=size=1024x1024 [dest];`,
					`[0:v] setpts=PTS-STARTPTS, scale=1820x1024 [tmp];`,
					`[dest][tmp] overlay=shortest=1:x=-398`,
				`"`,
				`-c:v libx264 -an -crf 25 "${ outFile }"`
			].join(' '))
		}
	},
	assetsIn: './assets',
	assetsOut: './dist/assets',
	filesOut: './dist',
	webRoot: './',
	files: {
		'index.html': require('./templates')
	}
})