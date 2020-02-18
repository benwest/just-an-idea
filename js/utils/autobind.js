var BUILTINS = [
	'oninit',
	'oncreate',
	'onbeforeupdate',
	'onupdate',
	'onbeforeremove',
	'onremove',
	'view'
];

var autobind = ({ state }) => {
	for ( var key in state ) {
		if ( !BUILTINS.includes( key ) && typeof state[ key ] === 'function' ) {
			state[ key ] = state[ key ].bind( state, state );
		}
	}
}

module.exports = arg => {
	if ( typeof arg === 'function' ) {
		return vnode => {
			autobind( vnode );
			return arg( vnode );
		}
	} else {
		autobind( arg );
	}
}