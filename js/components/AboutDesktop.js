var m = require('mithril');
var bem = require('../utils/bem');

var Scroll = require('./Scroll');
var Credits = require('./Credits');

var { interviews, about, bio, credits } = require('../content');

module.exports = {
	view: ({ attrs: { open, toggleAbout } }) => {
		return m('div', { className: bem( 'about', { open }) },
			m('.about__column.about__column--left',
				m( 'h1', 'Just an Idea' ),
				m( Scroll, m.trust( about ) ),
				//m('a.about__credit', { href: 'http://bewe.me', target: '_blank' }, 'Website by Ben West')
			),
			m('.about__column.about__column--center', { onclick: toggleAbout }),
			m('.about__column.about__column--right',
				m( 'h1', 'Interviews' ),
				m( Scroll,
					m('.about__credits',
						interviews.map( ({ title, name, profession }) => m('.about__credit',
							m('em', title ),
							m( 'span', 'with ', name ),
							m('span', profession )
						))
					),
					m('.about__credits',
						credits.map( ({ role, name, url }) => m('.about__credit',
							m('h1', role ),
							url
								? m( 'a', { href: url, target: '_blank'}, name )
								: m( 'span', name )
						))
					)
				)
			)
		)
	}
}