var m = require('mithril');
var TitleBar = require('./TitleBar');
var StatusBar = require('./StatusBar');

module.exports = {
	view: ({ attrs: { title, battery }, children }) => {
		return m('.ui',
			m( StatusBar, { battery }),
			m( TitleBar, title ),
			m( ScrollView, children )
		);
	}
}
