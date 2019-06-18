var m = require('mithril');
var Main = require('./components/Main');

var video = document.querySelector('video');
video.width = video.height = 1024;

var init = () => {
	m.mount( document.querySelector('main'), Main( video ) );
	window.addEventListener( 'resize', m.redraw );
	// video.removeEventListener( 'canplaythrough', init );
}

// video.addEventListener( 'canplaythrough', init );

// var { title } = require('./content');
// var { PHONE_BREAKPOINT } = require('./config');

// video.src = title[ window.innerWidth < PHONE_BREAKPOINT ? 0 : 1 ];
// video.load();

init();

video.addEventListener('play', () => video.style.opacity = 1 );