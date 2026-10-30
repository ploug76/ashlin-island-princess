/* auto-update: HTML/JS/CSS/JSON always revalidated with the server (no stale copies); cache is the offline fallback */
const __NC=r=>{try{const u=new URL(r.url);return u.origin==location.origin&&(r.mode=='navigate'||/(\/|\.html?|\.m?js|\.css|\.json)$/.test(u.pathname))?{cache:'no-cache'}:{}}catch(e){return {}}};
const CACHE='ashlin-island-princess-v7';
const FILES=['./','index.html','style.css?v=7','fonts/lilita.woff2','js/kneerig.js?v=7','js/rig.js?v=7','js/audio.js?v=7','js/art.js?v=7','js/gfx.js?v=7','js/core.js?v=7','js/games.js?v=7','js/story.js?v=7','js/main.js?v=7',
 'assets/ashlin-child-art.webp?v=7','assets/ashlin-child.json?v=7','assets/ashlin-adult-art.webp?v=7','assets/ashlin-adult.json?v=7','manifest.json','icon-192.png'];
/* the painted art (art/*.webp, ~5.7 MB) is cached the first time it loads (network first below), so install stays light */
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE&&n.startsWith('ashlin-island-princess-')).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
/* network first (so updates show up), cache as the offline fallback */
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request,__NC(e.request)).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?c.match('./'):undefined)))))});
