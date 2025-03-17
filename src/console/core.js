const originalGet = URLSearchParams.prototype.get;

URLSearchParams.prototype.get = function (key) {
    if (key === 'showAd') {
        alert('a userscript just tried to show you an ad, but was blocked. try a recommended alternative.\n\nhttps://getstate.farm');

        const validTimestamp = Date.now() - 5 * 60 * 1000;
        return validTimestamp.toString(16);
    }

    return originalGet.call(this, key);
};

window.GM = {}
window.GM.info = {}
window.GM.info.script = {}
