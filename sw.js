const CACHE='ashlin-island-princess-v1';
const FILES=['./','index.html','style.css?v=1','js/kneerig.js?v=1','js/rig.js?v=1','js/audio.js?v=1','js/art.js?v=1','js/core.js?v=1','js/games.js?v=1','js/story.js?v=1','js/main.js?v=1',
 'assets/ashlin-child.png?v=1','assets/ashlin-child.json?v=1','assets/ashlin-adult.png?v=1','assets/ashlin-adult.json?v=1','assets/photos.json?v=1','manifest.json','icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE&&n.startsWith('ashlin-island-princess-')).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
/* network first (so updates show up), cache as the offline fallback */
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?c.match('./'):undefined)))))});
