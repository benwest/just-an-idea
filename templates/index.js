var html = require('nanohtml');
var raw = require('nanohtml/raw');
var layout = require('./layout');
var content = require('../content');
var duration = require('./utils/duration');

var convertVideo = ( assets, url ) => [ assets.videoSquare( url ), assets.videoTiled( url ) ];
var interview = assets => interview => Object.assign( {}, interview, {
	video: convertVideo( assets, interview.video ),
	audio: assets( interview.audio ),
	duration: duration( assets.path( interview.audio ) )
});

module.exports = assets => layout( {
	title: content.title,
	url: content.url,
	description: content.about,
	image: '/static/social.png',
	favicon: '/static/favicon.png'
}, html`
	<video loop muted autoplay playsinline width="1024" height="1024"></video>
	<main></main>
	<script type="text/json" id="data">
		${ raw( JSON.stringify( Object.assign( {}, content, {
			title: convertVideo( assets, 'title_bigger.mp4' ),
			interviews: content.interviews.map( interview( assets ) )
		}))) }
	</script>
`)