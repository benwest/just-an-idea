var m = require('mithril');

module.exports = {
	view: ({ attrs: { battery } }) => {
		var color = battery < .25 ? 'red' : ( battery <= .99 ? 'yellow' : 'green' );
		return m('span.battery', { style: { color } }, Math.round( battery * 99 ) + 1, '%' )
	}
}