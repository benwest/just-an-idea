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
	oninit: ({ attrs: { video, interview, initialTime, onTimeUpdate, onend }, state }) => {
		state.audioElement = new Audio();
		state.audioElement.src = interview.audio;
		state.audioElement.currentTime = initialTime;
		// state.onTimeUpdate = () => onTimeUpdate( state.audioElement.currentTime );
		// state.onEnd = () => {
		// 	state.onTimeUpdate();
		// 	onend();
		// 	state.playing = false;
		// 	m.redraw();
		// }
		// state.audioElement.addEventListener( 'timeupdate', state.onTimeUpdate );
		// state.audioElement.addEventListener( 'ended', state.onEnd )
		state.audioEvents = {
			timeupdate: () => onTimeUpdate( state.audioElement.currentTime ),
			ended: () => {
				onTimeUpdate( state.audioElement.currentTime );
				onend();
				state.playing = false;
				m.redraw();
			},
			play: () => {
				state.playing = true;
				m.redraw();
			},
			pause: () => {
				state.playing = false;
				m.redraw();
			}
		}
		state.toggle = () => {
			if ( !state.loaded ) {
				video.src = interview.video[ window.innerWidth < PHONE_BREAKPOINT ? 0 : 1 ];
				video.play();
				state.loaded = true;
			}
			state.playing
				? state.audioElement.pause()
				: state.audioElement.play();
			// state.playing = !state.playing;
		}
		for ( let event in state.audioEvents ) {
			state.audioElement.addEventListener( event, state.audioEvents[ event ] );
		}
		state.toggle();
	},
	onbeforeremove: ({ state }) => {
		for ( let event in state.audioEvents ) {
			state.audioElement.removeEventListener( event, state.audioEvents[ event ] );
		}
		return wait( 500 ).then( () => {
			state.audioElement.src = '';
		})
	},
	view: ({
		attrs: { interview },
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