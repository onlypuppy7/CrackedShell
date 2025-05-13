import cache from '../util/cache';
import { redirect, send } from '../util/respond';

export default async ({ path }) => {
    const mime = Bun.file(path).type.split(';')[0] || 'application/octet-stream';
    const finalMime = mime === 'application/wasm' ? 'application/wasm' : mime + '; charset=UTF-8';

    if (cache.has(path)) {
        const cachedData = Buffer.from(cache.get(path) || '', 'base64');
        return send(cachedData, finalMime);
    }

    const response = await fetch('https://shellshock.io' + ((path === '/js/shellshock.og.js') ? '/js/shellshock.js' : path));
    if (response.status !== 200) return redirect('/$');

    let arrayBuffer = await response.arrayBuffer();
    let data = Buffer.from(arrayBuffer);

    cache.set(path, data.toString('base64'));
    return send(data, finalMime);
}