/* Core: canvas, layout, input (touch / keyboard / gamepad), UI helpers, save data. */
const CONFIG={studioLogo:''}; // studio not picked yet: set to 'logo-589.png' or 'logo-boh.png' (file in the repo root) to show it tiny in the corner
const $=id=>document.getElementById(id);
const G={W:0,H:0,s:1,dpr:1,t:0,land:false,mode:'title',ch:0,ash:{},game:null,paused:false,
 keys:{},cur:{x:200,y:400,on:false},pad:{ax:0,ay:0,btn:{},prev:{}},ptr:new Map(),save:{done:{},stars:{}}};
const cv=$('cv'),cx=cv.getContext('2d');Art.use(cx);
try{Object.assign(G.save,JSON.parse(localStorage.getItem('aip-save')||'{}'))}catch(e){}
function saveGame(){try{localStorage.setItem('aip-save',JSON.stringify(G.save))}catch(e){}}
function resize(){G.W=innerWidth;G.H=innerHeight;G.dpr=Math.min(2.5,devicePixelRatio||1);cv.width=Math.round(G.W*G.dpr);cv.height=Math.round(G.H*G.dpr);
 cv.style.width=G.W+'px';cv.style.height=G.H+'px';G.s=Math.max(0.7,Math.min(G.W,G.H)/412);G.land=G.W>G.H;document.body.classList.toggle('land',G.land);
 if(G.game&&G.game.resize)G.game.resize()}
addEventListener('resize',resize);resize();
if(CONFIG.studioLogo){const l=$('studioLogo');l.src=CONFIG.studioLogo;l.hidden=false}
/* ---------- UI ---------- */
const SCREENS=['title','chapters','story','howto','pause','result'];
function show(id){for(const s of SCREENS)$(s).hidden=s!==id&&!(id==='pause'&&false);}
function hud(on){$('hud').hidden=!on}
function hudInfo(t){const e=$('hudInfo');if(e.textContent!==t)e.textContent=t}
let toastT=0;function toast(t,ms=900){const e=$('toast');e.textContent=t;e.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>e.classList.remove('on'),ms)}
/* the free rectangle for drawing story/title art (not covered by the UI) */
function stageRect(){if(G.mode==='story'){const b=$('storyBox').getBoundingClientRect();return G.land?{x:0,y:0,w:b.left-8,h:G.H}:{x:0,y:0,w:G.W,h:b.top-6}}
 if(G.mode==='title'){const h=$('titleHead').getBoundingClientRect(),b=$('titleBtns').getBoundingClientRect();
  return G.land?{x:0,y:0,w:Math.min(h.left,b.left)-6,h:G.H}:{x:0,y:h.bottom+4,w:G.W,h:b.top-h.bottom-10}}
 return{x:0,y:0,w:G.W,h:G.H}}
/* ---------- Ashlin drawing ---------- */
/* Ashlin is drawn into a small offscreen canvas first, then onto the scene with a soft white glow and a contact shadow,
   so the white cutout reads as a clean, intentional silhouette on any painted background. */
const ashC=document.createElement('canvas'),ashX=ashC.getContext('2d');
function drawAsh(v,o,x,foot,hpx,flip,opt){const ch=G.ash[v];if(!ch||!ch.R)return;const R=ch.R,k=hpx/R.ground;opt=opt||{};
 const pad=16*G.s,bw=Math.ceil(R.w*k*2.4+pad*2),bh=Math.ceil(hpx*1.12+pad*2),d=G.dpr;
 if(ashC.width<bw*d||ashC.height<bh*d){ashC.width=Math.max(ashC.width,bw*d);ashC.height=Math.max(ashC.height,bh*d)}
 ashX.setTransform(1,0,0,1,0,0);ashX.clearRect(0,0,bw*d+2,bh*d+2);ashX.setTransform(d,0,0,d,0,0);
 ashX.translate(bw/2,bh-pad);ashX.scale(flip?-k:k,k);ashX.translate(-R.w/2,-R.ground);AshRig.draw(ashX,ch,o||{});
 if(!opt.noShadow&&window.GFX)GFX.shadow(x,foot,hpx*0.16,0.25);
 cx.save();cx.shadowColor=R.glow||'rgba(255,255,255,.95)';cx.shadowBlur=Math.max(6,hpx*0.06);
 cx.drawImage(ashC,0,0,bw*d,bh*d,x-bw/2,foot-(bh-pad),bw,bh);cx.shadowColor='rgba(200,180,255,.55)';cx.shadowBlur=Math.max(10,hpx*0.14);cx.globalAlpha*=0.6;
 cx.drawImage(ashC,0,0,bw*d,bh*d,x-bw/2,foot-(bh-pad),bw,bh);cx.restore();return k}
function stepAsh(v,o,wx,hpx,flip,on){const ch=G.ash[v];if(!ch||!ch.R)return;AshRig.step(o,wx,hpx/ch.R.ground,flip,ch.R,on)}
/* ---------- input ---------- */
function P(e){return{x:e.clientX,y:e.clientY,id:e.pointerId,t:performance.now()}}
cv.addEventListener('pointerdown',e=>{Sound.unlock();const p=P(e);p.sx=p.x;p.sy=p.y;p.st=p.t;G.ptr.set(e.pointerId,p);G.cur.on=false;
 if(G.mode==='play'&&!G.paused&&G.game&&G.game.down)G.game.down(p);e.preventDefault()},{passive:false});
cv.addEventListener('pointermove',e=>{const p=G.ptr.get(e.pointerId);if(!p)return;p.x=e.clientX;p.y=e.clientY;if(G.mode==='play'&&!G.paused&&G.game&&G.game.move)G.game.move(p)});
function pup(e){const p=G.ptr.get(e.pointerId);if(!p)return;G.ptr.delete(e.pointerId);p.x=e.clientX;p.y=e.clientY;const dt=performance.now()-p.st,dx=p.x-p.sx,dy=p.y-p.sy;
 p.tap=dt<260&&Math.hypot(dx,dy)<22;p.swipe=dt<500&&Math.hypot(dx,dy)>40?(Math.abs(dy)>Math.abs(dx)?(dy<0?'up':'down'):(dx<0?'left':'right')):null;
 if(G.mode==='play'&&!G.paused&&G.game&&G.game.up)G.game.up(p)}
cv.addEventListener('pointerup',pup);cv.addEventListener('pointercancel',pup);
addEventListener('keydown',e=>{Sound.unlock();if(e.repeat&&G.keys[e.code])return;G.keys[e.code]=true;
 if(G.mode==='play'){if(e.code==='Escape'||e.code==='KeyP'){togglePause();return}if(G.paused)return;
  if(G.game&&G.game.key&&G.game.key(e.code))return e.preventDefault();
  if(e.code==='Space'||e.code==='Enter'){action();e.preventDefault()}
  if(/^Arrow/.test(e.code))e.preventDefault()}
 else if(G.mode==='story'&&(e.code==='Space'||e.code==='ArrowRight')){$('bNext').click();e.preventDefault()}});
addEventListener('keyup',e=>{G.keys[e.code]=false});
addEventListener('blur',()=>{G.keys={}});
function axisX(){const k=G.keys;return Math.max(-1,Math.min(1,((k.ArrowRight||k.KeyD)?1:0)-((k.ArrowLeft||k.KeyA)?1:0)+G.pad.ax))}
function axisY(){const k=G.keys;return Math.max(-1,Math.min(1,((k.ArrowDown||k.KeyS)?1:0)-((k.ArrowUp||k.KeyW)?1:0)+G.pad.ay))}
function runHeld(){return !!(G.keys.ShiftLeft||G.keys.ShiftRight||Math.hypot(G.pad.ax,G.pad.ay)>0.8||G.pad.btn.x||G.pad.btn.rb)}
/* action = keyboard Space/Enter or gamepad A: games with act() use it, tap games tap at the cursor */
function action(){const g=G.game;if(!g)return;if(g.act)return g.act();if(!G.cur.on){G.cur.on=true;return}
 const p={x:G.cur.x,y:G.cur.y,id:-1,t:performance.now(),tap:true,sx:G.cur.x,sy:G.cur.y,st:performance.now(),cursor:1};g.down&&g.down(p);g.up&&g.up(p)}
function pollPad(dt){const ps=navigator.getGamepads?navigator.getGamepads():[];let gp=null;for(const p of ps)if(p&&p.connected){gp=p;break}
 const pd=G.pad;pd.prev=pd.btn;pd.btn={};pd.ax=pd.ay=0;if(!gp)return;const b=i=>!!(gp.buttons[i]&&gp.buttons[i].pressed);
 const dz=v=>Math.abs(v)<0.22?0:v;pd.ax=dz(gp.axes[0]||0)+(b(15)?1:0)-(b(14)?1:0);pd.ay=dz(gp.axes[1]||0)+(b(13)?1:0)-(b(12)?1:0);
 pd.btn={a:b(0),b:b(1),x:b(2),y:b(3),rb:b(5),start:b(9),up:b(12),down:b(13),left:b(14),right:b(15)};const E=n=>pd.btn[n]&&!pd.prev[n];
 if(E('a')||E('b')||E('x')||E('y')||E('up')||E('down')||E('left')||E('right')||E('start'))Sound.unlock();
 if(G.mode==='play'){if(E('start'))togglePause();if(G.paused){menuNav(E);return}
  if(G.game&&G.game.padBtn){for(const n of['a','b','x','y','up','down','left','right'])if(E(n)&&G.game.padBtn(n))return}
  if(E('a'))action()}
 else menuNav(E)}
/* gamepad in menus: move focus between visible buttons, A presses, B = back/skip */
function menuNav(E){const bs=[...document.querySelectorAll('#ui button')].filter(b=>b.offsetParent!==null);if(!bs.length)return;let i=bs.indexOf(document.activeElement);
 const mv=(E('down')||E('right')||(G.pad.ay>0.6&&!G._nav))?1:(E('up')||E('left')||(G.pad.ay<-0.6&&!G._nav))?-1:0;G._nav=Math.abs(G.pad.ay)>0.6;
 if(mv){i=i<0?0:(i+mv+bs.length)%bs.length;bs[i].focus()}if(E('a')){(i>=0?bs[i]:bs[0]).click()}if(E('b')){const sk=$('bSkip');if(sk.offsetParent)sk.click()}}
function cursorUpdate(dt){if(G.game&&G.game.axes)return;const ax=axisX(),ay=axisY();if(ax||ay){G.cur.on=true;G.cur.x=Math.max(0,Math.min(G.W,G.cur.x+ax*620*dt*G.s));G.cur.y=Math.max(0,Math.min(G.H,G.cur.y+ay*620*dt*G.s))}}
function drawCursor(){if(!G.cur.on||(G.game&&G.game.axes))return;const s=G.s,c=G.cur;cx.save();cx.lineWidth=7*s;cx.strokeStyle='#4a2a6a';cx.beginPath();cx.arc(c.x,c.y,22*s,0,7);cx.stroke();cx.lineWidth=4*s;cx.strokeStyle='#ffd23f';cx.stroke();cx.fillStyle='#ffd23f';cx.beginPath();cx.arc(c.x,c.y,4*s,0,7);cx.fill();cx.restore()}
function togglePause(){if(G.mode!=='play')return;G.paused=!G.paused;$('pause').hidden=!G.paused;if(G.paused){$('bPSound').textContent='Sound: '+(Sound.isOn()?'On':'Off');$('bResume').focus()}}
const lerp=(a,b,t)=>a+(b-a)*t,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
