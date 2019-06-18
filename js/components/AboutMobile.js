var m = require('mithril');

var View = require('./View');
var Credits = require("./Credits");

var { about, bio, interviews, credits } = require('../content');

module.exports = {
	view: ({ attrs: { battery, icon, offset } }) => {
		return m( View, { title: 'Just an Idea', battery, icon, offset },
			m('.about-mobile',
				m('.about-mobile__section', m.trust( about ) ),
				m('.about-mobile__section',
					m( 'h1', 'interviews' ),
					interviews.map( ({ title, name, profession }) => m('.about-mobile__credit',
						m('em', title ),
						m( 'span', 'with ', name ),
						m('span', profession )
					))
				),
				credits.map( ({ role, name, url }) => m('.about-mobile__credit',
					m('h1', role ),
					url
						? m( 'a', { href: url, target: '_blank'}, name )
						: m( 'span', name )
				))
				// m('h1', 'Stroma Cairns'),
				// m.trust( bio ),
				// m('a', { href: 'http://stromacairns.co.uk/', target: '_blank'}, 'stromacairns.co.uk'),
				// m('a', { href: 'http://bewe.me/', target: '_blank' }, 'Website by Ben West' )
				// m('.about-mobile__credits',
					// m( Credits, { interviews } )
				// )
			)
		)
	}
}