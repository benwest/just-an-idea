var m = require('mithril');
var bem = require('../utils/bem');

var TitleBar = require('./TitleBar');
var Battery = require('./Battery');
var Scroll = require('./Scroll');

module.exports = {
	view: ({ attrs: { title, icon, battery, offset }, children }) => {
		var className = bem( 'view', offset ? { [ 'offset-' + offset ]: true }  : {} );
		return m( 'div', { className },
			m( TitleBar, {
				left: icon,
				title,
				right: m( Battery, { battery })
			}),
			m( '.view__main', children )
		)
	}
}