import Fingerprint2 from 'fingerprintjs2'

const idle = fn => {
    if ( window.requestIdleCallback ) {
        requestIdleCallback( fn );
    } else {
        setTimeout( fn, 500 )
    }
}

export default uid => {
    idle( () => {
        Fingerprint2.get( undefined, components => {
            const values = components.map( c => c.value );
            const clientID = Fingerprint2.x64hash128( values.join(''), 31 );
            (function( window, document, sript, url, ga, m ){
                window.GoogleAnalyticsObject = 'ga';
                window.ga = ( ...args ) => window.ga.q.push( ...args );
                window.ga.q = [];
                window.ga.l = 1 * new Date();
                const script = document.createElement( 'script' );
                m = document.getElementsByTagName( 'script' )[0];
                a.async = 1;
                a.src = '//www.google-analytics.com/analytics.js';
                m.parentNode.insertBefore( a, m )
            })( window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga' );
            ga('create', 'UA-149865785-1', {
                'storage': 'none',
                'clientId': clientID
            });
            ga('set', 'anonymizeIp', true);
            ga('send', 'pageview');
        })
    })
}

setTimeout( () => {
    Fingerprint2.get( undefined, function ( components ) {
        var values = components.map( function ( component ) { return component.value } )
        var clientID = Fingerprint2.x64hash128( values.join(''), 31 );
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-149865785-1', {
            'storage': 'none',
            'clientId': clientID
        });
        ga('set', 'anonymizeIp', true);
        ga('send', 'pageview');
    })
}, 500 )