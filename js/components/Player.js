var m = require('mithril');

var bem = require('../utils/bem')
var { PHONE_BREAKPOINT } = require('../config');

var wait = delay => new Promise( resolve => setTimeout( resolve, delay ) );

var stopPropagation = e => e.stopPropagation();

var Scrubber = {
	oninit: ({ attrs: { audioElement, duration }, state }) => {
		state.seek = e => {
			var t = e.offsetX / e.target.clientWidth;
			audioElement.currentTime = t * duration;
		}
	},
	oncreate: ({ attrs: { audioElement, duration }, dom, state }) => {
		var handle = dom.querySelector('.player__scrubber-handle');
		var tick = () => {
			var t = audioElement.currentTime / duration;
			handle.style.transform = `translateX(${ t * 100 }%)`;
			state.frame = window.requestAnimationFrame( tick );
		}
		tick();
	},
	onremove: ({ state }) => window.cancelAnimationFrame( state.frame ),
	view: ({ state: { seek }}) => m( '.player__scrubber', { onclick: seek },
		m('.player__scrubber-handle')
	)
}

module.exports = {
	playing: false,
	loaded: false,
	oninit: ({ attrs: { video, interview, i, played, onend }, state }) => {
		state.audioElement = new Audio();
		state.audioElement.src = interview.audio;
		var updateTime = () => {
			played[ i ] = Math.max( played[ i ], state.audioElement.currentTime );
			m.redraw();
		}
		state.audioElement.addEventListener( 'timeupdate', updateTime );
		state.audioElement.addEventListener('ended', () => {
			updateTime();
			onend();
			state.playing = false;
			state.audioElement.currentTime = 0;
			m.redraw();
		})
		state.toggle = () => {
			if ( !state.loaded ) {
				video.src = interview.video[ window.innerWidth < PHONE_BREAKPOINT ? 0 : 1 ];
				video.play();
				state.loaded = true;
			}
			state.playing
				? state.audioElement.pause()
				: state.audioElement.play();
			state.playing = !state.playing;
		}
	},
	onbeforeremove: ({ state }) => {
		state.audioElement.src = '';
		return wait( 500 );
	},
	view: ({
		attrs: { interview, i, played, video },
		state: { audioElement, toggle, playing },
	}) => {
		return m('.player', { onclick: stopPropagation },
			m( 'div', {
				className: bem('player__button', { play: !playing, pause: playing }),
				onclick: toggle
			}),
			m( Scrubber, { audioElement, duration: interview.duration })
			// m( '.player__scrubber',
			// 	m('.player__scrubber-handle')
			// )
		)
	}
}