var m = require('mithril');

module.exports = {
	view: ({ attrs: { left, title, right } }) => {
		return m( '.title-bar', {},
			m( '.title-bar__left', left ),
			m( '.title-bar__center', title ),
			m( '.title-bar__right', right )
		);
	}
}