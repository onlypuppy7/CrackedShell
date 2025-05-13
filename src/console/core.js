(() => {
    const patches = [{
        // Replace Matchmaker Websocket
        find: '||location.host,',
        replace: `||$WEBSOCKET,`
    }, {
        // Replace Services Websocket
        find: '${location.hostname}',
        replace: '${$WEBSOCKET}'
    }, {
        // Replace Services Websocket
        find: /`\$\{[a-zA-Z]+\}\.shellshock\.io`/g,
        replace: `$WEBSOCKET`
    }, {
        // Replace Game Websocket
        find: '||window.location.hostname',
        replace: `||$WEBSOCKET`
    }, {
        // Spoof HTTPS for testing on localhost
        find: 'isHttps()',
        replace: 'true'
    }, {
        // Ad Blocker
        find: /checkAdBlocker\(\)\{(.*?)\}/g,
        replace: `checkAdBlocker(){false}`
    }, {
        // Ad Blocker
        find: /adBlockerDetected\(\)\{(.*?)\}/g,
        replace: `adBlockerDetected(){false}`
    }, {
        // Ad Blocker
        find: /showAdBlockerVideo\(\)\{(.*?)1e4\)\}/g,
        replace: `showAdBlockerVideo(){this.afterVideoAdComplete()}`
    }, {
        // Ad Blocker
        find: /!\[".*?"\]\.includes\(([a-zA-Z])\)/g,
        replace: `(false)`
    }];

    let _apc = HTMLElement.prototype.appendChild;

    HTMLElement.prototype.appendChild = function (node) {
        if (node.tagName === 'SCRIPT' && node.innerHTML && node.innerHTML.startsWith('(()=>{')) {
            console.log('[cs] identified script');

            patches.forEach((patch) => {
                let old = node.innerHTML;

                node.innerHTML = node.innerHTML.replaceAll(patch.find, patch.replace);

                if (node.innerHTML === old) console.warn('[cs] patch failed', patch);
                else console.log('[cs] patch success', patch);

                delete old;
            });
        }

        return _apc.call(this, node);
    }
})();