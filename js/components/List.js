var m = require('mithril');
var bem = require('../utils/bem');
var autobind = require('../utils/autobind');

var { interviews } = require('../content');

var padNumber = n => String( n ).padStart( 2, '0' );
var formatTime = date => padNumber( date.getMinutes() ) + ':' + padNumber( date.getSeconds() );

module.exports = {
	active: -1,
	oninit: autobind,
	onclick: ({ state }, i ) => {
		if ( state.active === -1 ) {
			state.active = i;
		} else {
			state.active = -1;
		}
		m.redraw();
	},
	view: ({ state: { active, onclick } }) => {
		return m('ol.list',
			interviews.map( ( interview, i ) => m( ListItem, {
				interview,
				onclick: () => onclick( i ),
				expanded: active === i,
				disabled: active !== i && active !== -1
			})),
			m('li.')
		)
	}
}