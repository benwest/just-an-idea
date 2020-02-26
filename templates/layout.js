var html = require('nanohtml');

module.exports = ( { title, url, description, image, favicon }, children ) => html`
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>${ title }</title>
		<meta name="viewport" content="width=device-width, initial-scale=1 user-scalable=no">
		<link rel="stylesheet" href="./style.css">

		<meta property="og:type" content="website"/>
		<meta property="og:title" content="${ title }" />
		<meta property="og:url" content="${ url }" />
		<meta property="og:description" content="${ description }" />
		<meta property="og:image" content="${ image }" />
		<meta name="twitter:title" content="${ title }">
		<meta name="twitter:url" content="${ url }">
		<meta name="twitter:description" content="${ description }">
		<meta name="twitter:image" content="${ image }">
		<link rel="icon" href="${ favicon }" sizes="32x32">

		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<!-- Matomo -->
		<script type="text/javascript">
			var _paq = window._paq || [];
			/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
			_paq.push(['disableCookies']);
			_paq.push(['trackPageView']);
			_paq.push(['enableLinkTracking']);
			(function() {
				var u="//analytics.bewe.me/";
				_paq.push(['setTrackerUrl', u+'matomo.php']);
				_paq.push(['setSiteId', '1']);
				var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
				g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
			})();
		</script>
		<!-- End Matomo Code -->
	</head>
	<body>
		${ children }
		<script src="./bundle.js"></script>
	</body>
</html>
`