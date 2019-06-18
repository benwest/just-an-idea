var html = require('nanohtml');

module.exports = body => html`
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Just an Idea</title>
		<meta name="viewport" content="width=device-width, initial-scale=1 user-scalable=no">
		<link rel="stylesheet" href="./style.css">
		<!--
		<meta property="og:type" content="website"/>
		<meta property="og:title" content="" />
		<meta property="og:url" content="" />
		<meta property="og:description" content="" />
		<meta property="og:image" content="" />
		<meta name="twitter:title" content="">
		<meta name="twitter:url" content="">
		<meta name="twitter:description" content="">
		<meta name="twitter:image" content="">
		<link rel="icon" href="" sizes="16x16">
		<link rel="icon" href="" sizes="32x32">
		<link rel="apple-touch-icon" href="">
		-->
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
	</head>
	<body>
		${ body }
		<script src="./bundle.js"></script>
	</body>
</html>
`