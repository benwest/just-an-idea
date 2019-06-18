var eases = require('eases');
var rAF = require('./rAF');

// module.exports = ( ...args ) => {
//     var [ name, duration, fn ] = args.length === 3 ? args : [ null, ...args ];
//     var startTime = Date.now();
//     var endTime = now + duration;
//     if ( name ) rAF.stop( name );
//     return new Promise( resolve => {
//         var apply = t => ( ...args ) => {
//             if ( args.length === 0 ) return t;
//             if ( args.length === 1 ) return t * args[ 0 ];
//             var [ from, to ] = args;
//             var easing = args[ 2 ] || 'linear';
//             return eases[ easing ]( from + ( to - from ) * t );
//         }
//         var tick = now => {
//             if ( now < endTime ) {
//                 var t = ( now - startTime ) / duration;
//                 fn( apply( t ) );
//             } else {
//                 fn( apply( 1 ) );
//                 rAF.stop( name );
//                 resolve();
//             }
//         }
//         name = rAF.start( tick );
//     })
// }

module.exports = ({
    name,
    from = 0,
    to = 1,
    duration = 1000,
    easing = 'quadInOut',
    onProgress = () => {}
}) => {

    var easeFn = eases[ easing ];

    var d = to - from;

    var startTime = Date.now();

    var endTime = startTime + duration;

    if ( name ) rAF.stop( name );

    return new Promise( resolve => {

        var tick = now => {

            if ( now < endTime ) {

                var progress = ( now - startTime ) / duration;

                var eased = easeFn( progress );

                var value = from + d * eased;

                onProgress( value );

            } else {

                rAF.stop( name );

                onProgress( to );

                resolve();

            }

        }

        name = rAF.start( name, tick );

    })

};