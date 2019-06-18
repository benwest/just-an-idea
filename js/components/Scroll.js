var m = require('mithril');
var bem = require('../utils/bem');
var throttle = require('lodash/throttle');

var update = ({ state, dom }) => {
	var atTop = dom.scrollTop <= 0;
	var atBottom = dom.scrollTop >= dom.scrollHeight - dom.offsetHeight;
	if ( atTop !== state.atTop || atBottom !== state.atBottom ) {
		state.atTop = atTop;
		state.atBottom = atBottom;
		m.redraw();
	}
}

module.exports = {
	atTop: false,
	atBottom: false,
	oninit: ({ state }) => {
		state.onscroll = throttle( m.redraw, 200, { leading: true, trailing: true } )
	},
	oncreate: update,
	onupdate: update,
	view: ({ state: { atTop, atBottom, onscroll }, children }) => {
		return m( 'div', { className: bem( 'scroll', { 'at-top': atTop, 'at-bottom': atBottom } ), onscroll }, children )
	}
}