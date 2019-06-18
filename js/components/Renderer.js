var m = require('mithril');
var { Vector2 } = require('../renderer/three.js');

var createRenderer = require('../renderer');

module.exports = {
	loaded: false,
	rotated: false,
	oncreate: ({ attrs: { video }, state, dom, children }) => {
		state.renderer = createRenderer( dom.children[ 0 ], dom.children[ 1 ], video );
		state.screen = state.renderer.screen.element;
		var { layout, update, render } = state.renderer;
		state.onResize = () => {
			layout( new Vector2( window.innerWidth, window.innerHeight ) );
		}
		var tick = () => {
			state.frame = requestAnimationFrame( tick );
			update( video );
			render();
		}
		state.renderer.load().then(() => {
			state.onResize();
			window.addEventListener( 'resize', state.onResize );
			tick();
			state.loaded = true;
			m.redraw();
		});
	},
	onupdate: ({ attrs: { rotated = false }, state, children }) => {
		if ( !state.loaded ) return;
		if ( rotated !== state.rotated ) {
			state.renderer.rotate( rotated ? 1 : 0 );
			state.rotated = rotated;
		}
		m.render( state.screen, children );
	},
	onremove: ({ state }) => {
		window.cancelAnimationFrame( state.frame );
		window.removeEventListener( 'resize', state.onResize );
	},
	view: () => {
		return m('.renderer', { onclick: m.redraw },
			m('canvas.renderer__canvas'),
			m('.renderer__css')
		)
	}
}