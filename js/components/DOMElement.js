module.exports = {
	oncreate: ({ attrs: { element }, dom }) => {
		dom.parentNode.insertBefore( element, dom );
	},
	view: () => ''
}