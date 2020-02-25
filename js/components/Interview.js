var m = require('mithril');
var bem = require('../utils/bem')

var Player = require('./Player');

var padNumber = n => String( Math.round( n ) ).padStart( 2, '0' );
var formatTime = secs => padNumber( Math.floor( secs / 60 ) ) + ':' + padNumber( secs % 60 );

module.exports = {
	currentTime: 0,
	oninit: ({ attrs: { played, i }, state }) => {
		state.onTimeUpdate = t => {
			state.currentTime = t;
			played[ i ] = Math.max( played[ i ], t );
			m.redraw();
		}
	},
	view: ({
		attrs: { interview, i, played, video, expanded, disabled, onclick, onend },
		state: { currentTime, onTimeUpdate }
	}) => {
		return m('div', { onclick, className: bem( 'list-item', { expanded, disabled }) },
			m('.list-item__title', interview.title ),
			m('.list-item__detail',
				expanded && m( Player, {
					interview,
					i,
					played,
					video,
					onend,
					initialTime: currentTime,
					onTimeUpdate
				})
			),
			m('.list-item__info',
				m('.list-item__name', interview.name ),
				m('.list-item__duration', formatTime( interview.duration ))
			)
		)
	}
}