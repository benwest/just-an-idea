var content = require('./content');

var video = document.querySelector('video');
video.width = video.height = 1024;
var audio = document.querySelector('audio');

var sum = arr => arr.reduce( ( a, b ) => a + b, 0 );
var totalDuration = sum( content.interviews.map( i => i.duration ) );
var positions = content.interviews.map( () => 0 );
var played = content.interviews.map( () => 0 );
var totalPlayed = () => sum( played ) / totalDuration;

var play = element => {
	var p = element.play();
	return p instanceof Promise ? p : Promise.resolve();
}

var awaitEvent = ( element, event ) => new Promise( resolve => {
	var handler = e => {
		resolve( e );
		element.removeEventListener( event, handler );
	}
	element.addEventListener( event, handler );
})

var player = {
	curr: -1,
	load: i => {
		
	}
}