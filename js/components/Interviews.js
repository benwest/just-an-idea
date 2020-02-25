var m = require('mithril');
// var autobind = require('../utils/autobind');
var bem = require('../utils/bem');

var View = require('./View');
var Interview = require('./Interview');

module.exports = {
	active: -1,
	oninit: ({ attrs: { onend }, state }) => {
		state.onclick = i => {
			state.active = state.active === -1 ? i : -1;
			if ( state.active === -1 ) onend();
		}
		state.onend = () => {
			state.onclick( -1 );
			onend();
		}
	},
	view: ({
		attrs: { interviews, battery, icon, offset, played, video },
		state: { active, onclick, onend }
	}) => {
		return m( View, { title: 'Calls', battery, icon, offset },
			interviews.map( ( interview, i ) => {
				return m( Interview, {
					interview,
					i,
					played,
					video,
					onend,
					onclick: () => onclick( i ),
					expanded: active === i,
					disabled: active !== i && active !== -1
				})
			}),
			m('a', {
				className: bem( 'list-item', { link: true, disabled: active !== -1 } ),
				href: 'https://vimeo.com/280519267',
				target: '_blank',
			}, 'Watch the trailer' )
		)
	}
}