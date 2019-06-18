var m = require('mithril');

var bisect = arr => {
	var halfway = Math.ceil( arr.length / 2 );
	return [ arr.slice( 0, halfway ), arr.slice( halfway ) ];
}

var credit = ( title, ...names ) => m('.credits__credit',
	m( '.credits__title', title ),
	names.map( name => m('.credits__name', name ) )
	// names.length === 1
	// 	? m('.credits__name', names[ 0 ] )
	// 	: bisect( names ).map( half => {
	// 		return m('.credits__column',
	// 			half.map( name => m( '.credits__name', name ))
	// 		)
	// 	})
)

var interviewCredit = ({ title, name, profession }) => m('.credits__credit',
	m('em', title ), m.trust('<br>'),
	'with ', name, m.trust('<br>'),
	profession
);

var section = ( title, items ) => m('.credits__section',
	m( 'h1', title ),
	...items
)

module.exports = {
	view: ({ attrs: { interviews } }) => {
		return m('.credits',
			section( 'Interviews', interviews.map( interviewCredit ) )
			//credit( 'Interviews', ...interviews.map( ({ name }) => name ) ),
			// credit( 'Film', 'Stroma Cairns' ),
			// credit( 'Website', 'Ben West' )
		)
	}
}