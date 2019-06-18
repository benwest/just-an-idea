var m = require('mithril');
var bem = require('../utils/bem');
var { PHONE_BREAKPOINT } = require('../config');

var AboutMobile = require('./AboutMobile.js');
var Interviews = require('./Interviews');

var { interviews, about, title } = require('../content');

var sum = arr => arr.reduce( ( a, b ) => a + b, 0 );

module.exports = {
	totalDuration: sum( interviews.map( i => i.duration ) ),
	played: interviews.map( i => 0 ),
	oninit: ({ attrs: { video }, state } ) => {
		var setTitle = () => {
			video.src = title[ window.innerWidth < PHONE_BREAKPOINT ? 0 : 1 ];
		}
		state.onend = setTitle;
		setTitle();
	},
	view: ({ 
		attrs: { aboutOpen, disabled, toggleAbout, video },
		state: { totalDuration, played, onend }
	}) => {
		var battery = sum( played ) / totalDuration;
		return m( 'div', { className: bem( 'ui', { disabled } ) },
			m( Interviews, {
				interviews,
				battery,
				played,
				video,
				onend,
				icon: m('a.button', { onclick: toggleAbout }, '?' ),
				offset: aboutOpen && 'left'
			}),
			m( AboutMobile, {
				about,
				interviews,
				battery,
				icon: m('a.button', { onclick: toggleAbout }, '?' || m.trust('&nbsp;') ),
				offset: !aboutOpen && 'right'
			})
		)
	}
}