var m = require('mithril');
var autobind = require('../utils/autobind');
var { PHONE_BREAKPOINT, ABOUT_BREAKPOINT } = require('../config');

var Renderer = require('./Renderer');
var AboutDesktop = require('./AboutDesktop');
var UI = require('./UI');

module.exports = video => ({
	oninit: autobind,
	aboutOpen: false,
	toggleAbout: state => {
		state.aboutOpen = !state.aboutOpen;
	},
	view: ({ state: { toggleAbout, aboutOpen } }) => {
		var mobileAboutOpen = aboutOpen && window.innerWidth < ABOUT_BREAKPOINT;
		var desktopAboutOpen = aboutOpen && !mobileAboutOpen;
		var ui = m( UI, {
			video,
			toggleAbout,
			aboutOpen: mobileAboutOpen,
			disabled: desktopAboutOpen
		});
		if ( window.innerWidth < PHONE_BREAKPOINT ) return ui;
		return [
			m( Renderer, { video, rotated: desktopAboutOpen }, ui ),
			m( AboutDesktop, { open: desktopAboutOpen, toggleAbout })
		]
	}
})