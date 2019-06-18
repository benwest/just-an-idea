var m = require('mithril');

var icons = ( "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_=+[{]};:'" + '"' + "|,<.>/?" ).split('');
var rand = ( min, max ) => min + Math.floor( Math.random() * ( max - min ) );
var sample = ( arr, n = 1 ) => {
	if ( n === 1 ) return arr[ rand( 0, arr.length ) ];
	var sample = arr.map( x => x );
	for ( var i = 0; i < n; i++ ) {
		var r = rand( i, arr.length - 1 );
		var temp = sample[ i ];
		sample[ i ] = sample[ r ];
		sample[ r ] = temp;
	}
	return sample.slice( 0, n );
}

var padNumber = n => String( n ).padStart( 2, '0' );
var formatTime = date => padNumber( date.getHours() ) + ':' + padNumber( date.getMinutes() );

module.exports = {
	oninit: ({ state }) => {
		state.icons = sample( icons, 5 );
		var update = () => {
			var icon = sample( icons.filter( i => !state.icons.includes( i ) ));
			// do {
			// 	icon = char();
			// } while ( state.icons.includes( icon ) );
			state.icons[ rand( 0, state.icons.length ) ] = icon;
			m.redraw();
			state.timer = setTimeout( update, rand( 1000, 3000 ) );
		}
		update();
	},
	onremove: ({ state }) => clearTimeout( state.timer ),
	view: ({ attrs: { battery = 0 }, state: { icons } }) => {
		var color = battery < .25 ? 'red' : ( battery < 1 ? 'yellow' : 'green' );
		return m( '.status-bar',
			// m('span.status-bar__item', 'Just an Idea'),
			// m('span.status-bar__item.status-bar__item--icons', icons.map( i => m('span.status-bar__icon', i )) ),
			m('span.status-bar__item', { style: { color } }, Math.round( battery * 100 ), '%' ),
			// m('span.status-bar__item', formatTime( new Date() ) )
		)
	}
}