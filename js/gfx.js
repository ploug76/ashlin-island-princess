/* GFX: painted art (generated, original), parallax backgrounds, sprites, particles, ambient motion and juice.
   All pictures live in art/ (made for this game; see README). Characters other than Ashlin are sprites. */
const GFX=(()=>{
 const BG=['beach','beach_p','storm','jungle','lagoon','lagoon_p','ocean_top','sea_sunset','kingdom','palace','ballroom','ballroom_p','courtyard','courtyard_p',
  'prison','greenhouse','greenhouse_p','wedding','wedding_p','moon','moon_p','title','title_p'];
 const SPR=['sagi','tika','azul_fly','azul_stand','dolphin','antonio','ariana','luciana','king','danielle','frazer','marissa','tallulah','rita','sofia','gina',
  'croc','rat','tiny','chest','banner','blanket','lantern','bottle','rope','lily','mint','root','petal','sunset','thorn','mango','flower','shell','star','cake','rock',
  'log','boulder','ship','cart','bowl','conch'];
 /* which way each sprite faces in its picture (r = right, l = left, f = front) */
 const FACE={sagi:'r',tika:'r',azul_fly:'r',azul_stand:'r',dolphin:'r',antonio:'r',ariana:'l',luciana:'l',king:'l',danielle:'l',frazer:'l',marissa:'r',tallulah:'l',
  rita:'f',sofia:'f',gina:'f',croc:'l',rat:'r',tiny:'l'};
 const IMG={};let loaded=0,total=BG.length+SPR.length;
 function load(onProg){const q='?v='+(window.GAMEV||1);return Promise.all([...BG,...SPR].map(n=>new Promise(res=>{const im=new Image();im.onload=im.onerror=()=>{loaded++;onProg&&onProg(loaded/total);res()};im.src='art/'+n+'.webp'+q;IMG[n]=im})))}
 const ok=n=>IMG[n]&&IMG[n].complete&&IMG[n].naturalWidth>0;
 const E={out:t=>1-Math.pow(1-t,3),inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,back:t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)},
  elastic:t=>t===0||t===1?t:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*2*Math.PI/3)+1};
 /* background: cover the screen; portrait uses the _p painting when there is one. Returns the mapping so game objects can sit on painted spots. */
 function pickBg(n){return(!G.land&&ok(n+'_p'))?n+'_p':n}
 function mapOf(n,o={}){const k=pickBg(n),im=IMG[k];if(!ok(k))return null;
  const z=(o.zoom||1),s=Math.max(G.W/im.naturalWidth,G.H/im.naturalHeight)*z,w=im.naturalWidth*s,h=im.naturalHeight*s;
  const fx=o.fx===undefined?0.5:o.fx,fy=o.fy===undefined?0.5:o.fy;let x=(G.W-w)*fx+(o.px||0),y=(G.H-h)*fy+(o.py||0);
  x=Math.min(0,Math.max(G.W-w,x));y=Math.min(0,Math.max(G.H-h,y));return{k,im,x,y,w,h}}
 function bg(n,o={}){const m=mapOf(n,o);if(!m){cx.fillStyle='#234';cx.fillRect(0,0,G.W,G.H);return null}cx.drawImage(m.im,m.x,m.y,m.w,m.h);lastMap=m;return m}
 let lastMap=null;
 const at=(m,u,v)=>m?[m.x+u*m.w,m.y+v*m.h]:[u*G.W,v*G.H];
 /* scrolling strip: painting tiled left-right, every other copy mirrored so the seams match */
 function strip(n,scroll,y,h){const im=IMG[n];if(!ok(n))return;const w=im.naturalWidth*h/im.naturalHeight;let i=Math.floor(scroll/w);let x=i*w-scroll;
  for(;x<G.W;x+=w,i++){if(i%2){cx.save();cx.translate(x+w,y);cx.scale(-1,1);cx.drawImage(im,0,0,w,h);cx.restore()}else cx.drawImage(im,x,y,w,h)}}
 /* vertical scroll: tiles stacked upward, every other one mirrored top-bottom; content moves down as scroll grows */
 function stripV(n,scroll){const im=IMG[n];if(!ok(n))return;const w=G.W,h=im.naturalHeight*w/im.naturalWidth;
  for(let i=Math.floor((scroll-G.H)/h)-1;;i++){const y=scroll-(i+1)*h;if(y>G.H)continue;if(y+h<0)break;
   if(((i%2)+2)%2){cx.save();cx.translate(0,y+h);cx.scale(1,-1);cx.drawImage(im,0,0,w,h);cx.restore()}else cx.drawImage(im,0,y,w,h)}}
 /* sprite drawn with its feet (bottom centre) at x,y and height h. o.face 'r'/'l' turns it the right way. */
 function spr(n,x,y,h,o={}){const im=IMG[n];if(!ok(n))return;const ww=im.naturalWidth*h/im.naturalHeight;const f=FACE[n]||'r';
  const flip=o.face&&f!=='f'&&o.face!==f;cx.save();if(o.alpha!==undefined)cx.globalAlpha*=o.alpha;cx.translate(x,y);if(o.rot)cx.rotate(o.rot);
  cx.scale((flip?-1:1)*(o.sx||1),o.sy||1);if(o.glow){cx.shadowColor=o.glow;cx.shadowBlur=o.gb||16}
  const ay=o.center?h/2:h;cx.drawImage(im,-ww/2,-ay,ww,h);cx.restore();return ww}
 function sprW(n,h){const im=IMG[n];return ok(n)?im.naturalWidth*h/im.naturalHeight:h}
 /* standing character with a soft breathing idle and a contact shadow */
 function actor(n,x,y,h,t,o={}){shadow(x,y,sprW(n,h)*0.42);const b=Math.sin(t*2.2+(o.ph||0));spr(n,x,y,h,{...o,sy:(o.sy||1)*(1+b*0.012),sx:(o.sx||1)*(1-b*0.006)})}
 function shadow(x,y,w,a=0.28){cx.save();cx.fillStyle='rgba(20,10,40,'+a+')';cx.beginPath();cx.ellipse(x,y,w,w*0.18,0,0,7);cx.fill();cx.restore()}
 /* hopper: animals travel in hops (x only changes in the air, so feet never slide on the ground) */
 function hopper(x){return{x,y:0,ph:1,from:x,to:x,dur:0.36,land:9,face:'r'}}
 function hopTo(o,tx,dt,maxStep,rate=1){if(o.ph<1){o.ph=Math.min(1,o.ph+dt/(o.dur/rate));const e=o.ph;o.x=o.from+(o.to-o.from)*e;o.y=Math.sin(Math.PI*e)*Math.min(1,Math.abs(o.to-o.from)/maxStep)*0.35;if(o.ph>=1){o.y=0;o.land=0}}
  else{o.land+=dt;const d=tx-o.x;if(Math.abs(d)>maxStep*0.25&&o.land>0.1/rate){o.from=o.x;o.to=o.x+Math.sign(d)*Math.min(Math.abs(d),maxStep);o.ph=0;o.face=d>0?'r':'l'}}}
 const squash=o=>o.land<0.12?1-0.12*Math.sin(o.land/0.12*Math.PI):1;
 /* ---------- walking animals + flapping birds (Peter, Oct 31: animals walk with real leg steps, Azul flaps) ----------
    The painted sprite is cut at runtime: legs (or wings) become separate pieces that swing around a hip (shoulder) pivot,
    the rest of the picture is the body. Coordinates are sprite pixels. Leg pieces start a little above the cut line so the
    seam stays hidden under the body. legs: [x0,x1,pivotX,phase,far]. Diagonal pairs move together (trot). */
 const RIGS={
  sagi:{cut:296,ov:16,A:0.34,AR:0.55,bob:0.006,legs:[[140,238,196,0,0],[238,326,275,Math.PI,1],[326,407,370,0,1],[407,492,440,Math.PI,0]]},
  tika:{cut:340,ov:16,A:0.26,AR:0.42,bob:0.005,legs:[[45,131,95,0,0],[131,207,166,Math.PI,1],[207,287,250,0,1],[287,370,320,Math.PI,0]]},
  rat:{cut:262,ov:12,A:0.42,AR:0.6,bob:0.008,legs:[[85,140,118,0,0],[240,340,262,Math.PI,0]]},
  azul_fly:{wing:[[0,0],[400,0],[400,118],[393,212],[372,236],[322,246],[272,262],[226,281],[150,287],[0,287]],pv:[350,238],down:-0.85,sq:0.72,hz:2.6},
  tiny:{wing:[[205,0],[505,0],[505,385],[330,385],[262,352],[226,330],[205,300]],pv:[262,338],down:0.95,sq:0.7,hz:4.2}};
 const RC={};
 function rigOf(n){if(RC[n]!==undefined)return RC[n];const r=RIGS[n],im=IMG[n];if(!r||!ok(n))return null;const W=im.naturalWidth,H=im.naturalHeight;
  const mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c},poly=(x,pts)=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath()};
  const body=mk(),bx=body.getContext('2d');bx.drawImage(im,0,0);bx.globalCompositeOperation='destination-out';const out={W,H,body,r,pieces:[]};
  if(r.legs){const bc=mk(),bb=bc.getContext('2d');bb.beginPath();for(const l of r.legs)bb.rect(l[0],r.cut,l[1]-l[0],r.band||14);bb.clip();bb.drawImage(im,0,0);out.band=bc;
   for(const l of r.legs){bx.fillRect(l[0],r.cut,l[1]-l[0],H-r.cut);const c=mk(),x=c.getContext('2d');x.beginPath();x.rect(l[0],r.cut-r.ov,l[1]-l[0],H-r.cut+r.ov);x.clip();x.drawImage(im,0,0);
    out.pieces.push({c,px:l[2],py:r.cut-r.ov*0.4,ph:l[3],far:l[4],L:H-r.cut})}}
  if(r.wing){poly(bx,r.wing);bx.fill();const c=mk(),x=c.getContext('2d');poly(x,r.wing);x.clip();x.drawImage(im,0,0);out.wing=c}
  RC[n]=out;return out}
 /* walker state: x (world units), v, dist, ph (step phase), amt (0 stand .. 1 walk), run (0..1) */
 function walker(x){return{x,y:0,v:0,ph:0,amt:0,run:0,face:'r',land:9}}
 /* follow a target x: smooth start/stop, top speed vmax (world/s). hf = drawn height in world units (for step length) */
 function walkTo(o,n,tx,dt,vmax,hf){const d=tx-o.x,ad=Math.abs(d),vd=ad>0.12?Math.sign(d)*Math.min(vmax,(ad-0.08)*3):0;
  const a=(vd===0?6:4)*Math.max(1,vmax);o.v+=Math.max(-a*dt,Math.min(a*dt,vd-o.v));o.x+=o.v*dt;const sp=Math.abs(o.v);
  if(sp>0.03)o.face=o.v>0?'r':'l';o.amt+=((sp>0.03?1:0)-o.amt)*Math.min(1,dt*(sp>0.03?8:5));o.run+=(Math.min(1,Math.max(0,sp/Math.max(0.01,vmax)*1.3-0.4))-o.run)*Math.min(1,dt*4);
  const R=rigOf(n);if(R&&R.pieces.length){const A=R.r.A+(R.r.AR-R.r.A)*o.run,L=R.pieces[0].L;/* stance foot sweeps 2*L*sinA backwards = half a cycle */
   o.ph+=2*Math.PI*sp*dt*R.H/(4*L*Math.sin(A)*hf)}
  else o.ph+=sp*dt*12}
 /* draw a walker with its feet at x,y, height h (px) */
 function walkSpr(n,x,y,h,o={}){const R=rigOf(n);if(!R)return spr(n,x,y,h,o);const f=FACE[n]||'r',flip=o.face&&o.face!==f,k=h/R.H,r=R.r,amt=o.amt||0,A=(r.A+(r.AR-r.A)*(o.run||0))*amt;
  const bob=-amt*r.bob*R.H*(0.5-0.5*Math.cos(2*(o.ph||0)))*(1+(o.run||0));
  cx.save();if(o.alpha!==undefined)cx.globalAlpha*=o.alpha;cx.translate(x,y);cx.scale(flip?-k:k,k);cx.translate(-R.W/2,-R.H);
  const leg=P=>{const q=(o.ph||0)+P.ph,th=A*Math.sin(q),lift=amt*Math.max(0,-Math.cos(q))*P.L*(0.13+0.08*(o.run||0));
   cx.save();cx.translate(P.px,P.py-lift);cx.rotate(th);cx.translate(-P.px,-P.py);if(P.far){cx.filter='brightness(0.9)'}cx.drawImage(P.c,0,0);cx.restore()};
  /* static strip just under the belly fills the little wedge that opens between two legs swinging apart */
  cx.translate(0,bob);if(R.band&&amt>0)cx.drawImage(R.band,0,0);for(const P of R.pieces)if(P.far)leg(P);for(const P of R.pieces)if(!P.far)leg(P);
  cx.drawImage(R.body,0,0);cx.restore()}
 /* flying bird with flapping wing; t = time (s). Same options as spr (face, center, rot, alpha). */
 function flySpr(n,x,y,h,t,o={}){const R=rigOf(n);if(!R||!R.wing)return spr(n,x,y,h,o);const f=FACE[n]||'r',flip=o.face&&f!=='f'&&o.face!==f,k=h/R.H,r=R.r;
  const c=((t*(o.hz||r.hz))%1+1)%1,w=c<0.42?(1-Math.cos(Math.PI*c/0.42))/2:(1+Math.cos(Math.PI*(c-0.42)/0.58))/2;/* quick downstroke, slower upstroke */
  const lift=(w-0.5)*-0.035*R.H;
  cx.save();if(o.alpha!==undefined)cx.globalAlpha*=o.alpha;cx.translate(x,y);if(o.rot)cx.rotate(o.rot);cx.scale(flip?-k:k,k);cx.translate(-R.W/2,o.center?-R.H/2:-R.H);cx.translate(0,lift);
  cx.drawImage(R.body,0,0);cx.save();cx.translate(r.pv[0],r.pv[1]);cx.rotate(r.down*w);cx.scale(1,1-(1-r.sq)*w);cx.translate(-r.pv[0],-r.pv[1]);cx.drawImage(R.wing,0,0);cx.restore();
  cx.restore();return R.W*k}
 /* ---------- particles ---------- */
 let PS=[];
 function burst(x,y,o={}){const n=o.n||14,cols=o.colors||['#fff6a0','#ffd23f','#ff8fb8','#ffffff'];for(let i=0;i<n;i++){const a=(o.dir!==undefined?o.dir+(Math.random()-0.5)*(o.spread||1.2):Math.random()*Math.PI*2),sp=(o.speed||220)*(0.4+Math.random()*0.8)*G.s;
   PS.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-(o.up||0)*G.s,g:(o.g===undefined?380:o.g)*G.s,life:(o.life||0.8)*(0.6+Math.random()*0.6),t:0,sz:(o.size||7)*G.s*(0.6+Math.random()*0.8),c:cols[i%cols.length],sh:o.shape||'spark',rot:Math.random()*6,vr:(Math.random()-0.5)*10,drag:o.drag||0.9})}}
 function popText(x,y,txt,col='#fff6a0',size=30){const hw=Math.min(G.W/2,String(txt).length*size*G.s*0.3+8*G.s);x=Math.max(hw,Math.min(G.W-hw,x));PS.push({x,y,vx:0,vy:-60*G.s,g:0,life:1.0,t:0,sz:size*G.s,c:col,sh:'text',txt,drag:1})}
 function stepParticles(dt){for(const p of PS){p.t+=dt;p.vx*=Math.pow(p.drag,dt*10);p.vy=p.vy*Math.pow(p.drag,dt*10)+p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt}PS=PS.filter(p=>p.t<p.life)}
 function drawParticles(){for(const p of PS){const k=p.t/p.life,a=1-k*k;cx.save();cx.globalAlpha=Math.max(0,a);cx.translate(p.x,p.y);
   if(p.sh==='text'){const sc=k<0.18?E.back(k/0.18):1;cx.scale(sc,sc);txt(p.txt,0,0,p.sz,p.c)}
   else{cx.rotate(p.rot);cx.fillStyle=p.c;
    if(p.sh==='spark'){star4(0,0,p.sz*(1-k*0.5))}
    else if(p.sh==='heart'){heart(0,0,p.sz)}
    else if(p.sh==='confetti'){cx.fillRect(-p.sz/2,-p.sz/4,p.sz,p.sz/2)}
    else if(p.sh==='drop'){cx.beginPath();cx.ellipse(0,0,p.sz*0.45,p.sz*0.7,0,0,7);cx.fill()}
    else if(p.sh==='puff'){cx.globalAlpha*=0.55;cx.beginPath();cx.arc(0,0,p.sz*(0.6+k*1.4),0,7);cx.fill()}
    else if(p.sh==='leaf'){cx.beginPath();cx.ellipse(0,0,p.sz,p.sz*0.4,0,0,7);cx.fill()}
    else if(p.sh==='note'){cx.rotate(-p.rot);txt('\u266A',0,0,p.sz*2,p.c)}
    else{cx.beginPath();cx.arc(0,0,p.sz/2,0,7);cx.fill()}}
   cx.restore()}}
 function clearParticles(){PS=[]}
 /* ---------- small drawing helpers ---------- */
 function star4(x,y,r){cx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*0.28:r;cx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}cx.closePath();cx.fill()}
 function heart(x,y,r){cx.beginPath();cx.moveTo(x,y+r*0.9);cx.bezierCurveTo(x-r*1.4,y-r*0.1,x-r*0.7,y-r*1.1,x,y-r*0.45);cx.bezierCurveTo(x+r*0.7,y-r*1.1,x+r*1.4,y-r*0.1,x,y+r*0.9);cx.fill()}
 function txt(s,x,y,size,col='#fff',o={}){cx.font=(o.w||'400')+' '+Math.round(size)+'px Lilita,"Trebuchet MS",sans-serif';cx.textAlign=o.align||'center';cx.textBaseline='middle';
  cx.lineJoin='round';cx.lineWidth=size*0.2;cx.strokeStyle=o.stroke||'rgba(60,20,80,.9)';cx.strokeText(s,x,y);cx.fillStyle=col;cx.fillText(s,x,y)}
 function glowDot(x,y,r,col){const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,255,255,0)');cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()}
 function bubble(x,y,s,size=20){cx.font='400 '+Math.round(size*G.s)+'px Lilita,"Trebuchet MS",sans-serif';const w=cx.measureText(s).width+26*G.s,h=size*1.7*G.s;x=Math.max(w/2+6,Math.min(G.W-w/2-6,x));
  cx.save();cx.shadowColor='rgba(0,0,0,.25)';cx.shadowBlur=8*G.s;cx.fillStyle='#fffdf6';rr(x-w/2,y-h,w,h,h/2);cx.fill();cx.restore();
  cx.fillStyle='#fffdf6';cx.beginPath();cx.moveTo(x-8*G.s,y-2);cx.lineTo(x+8*G.s,y-2);cx.lineTo(x,y+9*G.s);cx.fill();
  cx.fillStyle='#4a2a6a';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(s,x,y-h/2)}
 function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath()}
 function panel(x,y,w,h,r,fill='rgba(255,252,244,.92)',line='rgba(120,80,160,.6)'){cx.save();cx.shadowColor='rgba(30,10,60,.35)';cx.shadowBlur=14*G.s;cx.shadowOffsetY=4*G.s;rr(x,y,w,h,r);cx.fillStyle=fill;cx.fill();cx.restore();rr(x,y,w,h,r);cx.lineWidth=2.5*G.s;cx.strokeStyle=line;cx.stroke()}
 function vignette(a=0.35){const g=cx.createRadialGradient(G.W/2,G.H/2,Math.min(G.W,G.H)*0.35,G.W/2,G.H/2,Math.max(G.W,G.H)*0.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(20,0,40,'+a+')');cx.fillStyle=g;cx.fillRect(0,0,G.W,G.H)}
 function tint(c){cx.fillStyle=c;cx.fillRect(0,0,G.W,G.H)}
 /* ---------- ambient motion ---------- */
 const R=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
 function amb(kind,t,o={}){const W=G.W,H=G.H,s=G.s,n=o.n||16;cx.save();
  switch(kind){
   case'rays':{cx.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const x=W*(o.x||0.25)+i*W*0.13,a=0.05+0.04*Math.sin(t*0.6+i*1.7);const g=cx.createLinearGradient(x,0,x-W*0.25,H);g.addColorStop(0,'rgba(255,240,190,'+a+')');g.addColorStop(1,'rgba(255,240,190,0)');
     cx.fillStyle=g;cx.beginPath();cx.moveTo(x-20*s,0);cx.lineTo(x+40*s,0);cx.lineTo(x-W*0.2+60*s,H);cx.lineTo(x-W*0.3,H);cx.closePath();cx.fill()}break}
   case'motes':{cx.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const x=(R(i)*W+Math.sin(t*0.3+i)*30*s+t*8*s*(R(i+9)-0.3))%W,y=(R(i+3)*H-t*(6+R(i+5)*10)*s+H*10)%H;glowDot((x+W)%W,y,(3+R(i+7)*4)*s,o.c||'rgba(255,250,210,.7)')}break}
   case'fireflies':{cx.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const x=R(i)*W+Math.sin(t*0.5+i*2)*40*s,y=H*(o.y0||0.3)+R(i+3)*H*(o.yh||0.6)+Math.cos(t*0.7+i)*25*s,a=0.5+0.5*Math.sin(t*3+i*5);glowDot(x,y,(7+5*a)*s,'rgba(255,240,150,'+(0.35+0.5*a)+')')}break}
   case'stars':{for(let i=0;i<n;i++){const a=0.4+0.6*Math.abs(Math.sin(t*1.5+i*3.1));cx.fillStyle='rgba(255,255,255,'+a+')';star4(R(i)*W,R(i+2)*H*(o.yh||0.45),(2+R(i+4)*3)*s*a)}break}
   case'sparkle':{for(let i=0;i<n;i++){const p=(t*0.5+R(i))%1,a=Math.sin(p*Math.PI);cx.fillStyle='rgba(255,255,255,'+a*0.9+')';star4(R(i+1)*W,H*(o.y0||0)+R(i+2)*H*(o.yh||1),(3+R(i+5)*5)*s*a)}break}
   case'leaves':{for(let i=0;i<n;i++){const sp=20+R(i)*30,y=((t*sp*s+R(i+1)*H*2)%(H*1.2))-H*0.1,x=R(i+2)*W+Math.sin(t*1.2+i)*40*s;cx.save();cx.translate(x,y);cx.rotate(Math.sin(t*2+i)*1.2);
     cx.fillStyle=o.c?o.c[i%o.c.length]:['#7fbf4a','#a8d65a','#f2b63c'][i%3];cx.beginPath();cx.ellipse(0,0,7*s,3*s,0,0,7);cx.fill();cx.restore()}break}
   case'petals':{for(let i=0;i<n;i++){const sp=25+R(i)*25,y=((t*sp*s+R(i+1)*H*2)%(H*1.2))-H*0.1,x=(R(i+2)*W+t*12*s+Math.sin(t*1.4+i)*30*s)%W;cx.save();cx.translate(x,y);cx.rotate(t*2+i);
     cx.fillStyle=['#ffd1e0','#fff','#ffb3cc'][i%3];cx.globalAlpha=0.85;cx.beginPath();cx.ellipse(0,0,6*s,3.5*s,0,0,7);cx.fill();cx.restore()}break}
   case'birds':{for(let i=0;i<(o.n||3);i++){const sp=(30+R(i)*25)*s,x=((t*sp+R(i)*W*1.5)%(W*1.4))-W*0.2,y=H*(o.y||0.18)+R(i+1)*H*0.12+Math.sin(t+i)*8*s,f=Math.sin(t*9+i*2);
     cx.strokeStyle=o.c||'rgba(60,40,70,.75)';cx.lineWidth=2.2*s;cx.lineCap='round';cx.beginPath();cx.moveTo(x-9*s,y-f*5*s);cx.quadraticCurveTo(x-4*s,y-3*s,x,y);cx.quadraticCurveTo(x+4*s,y-3*s,x+9*s,y-f*5*s);cx.stroke()}break}
   case'rain':{cx.strokeStyle='rgba(200,215,255,.45)';cx.lineWidth=1.6*s;for(let i=0;i<70;i++){const x=(R(i)*W*1.2+t*120*s)%(W*1.2)-W*0.1,y=(R(i+1)*H+t*(700+R(i+2)*300)*s)%H;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x-6*s,y+20*s);cx.stroke()}
     if((t%5)<0.12||((t+1.7)%7)<0.08){cx.fillStyle='rgba(230,220,255,.35)';cx.fillRect(0,0,W,H)}break}
   case'waves':{/* soft moving foam lines over painted water between y0..y1 */const y0=o.y0*H,y1=o.y1*H;cx.globalCompositeOperation='lighter';
     for(let i=0;i<(o.n||7);i++){const yy=y0+(y1-y0)*(i+0.5)/(o.n||7),a=0.08+0.06*Math.sin(t*1.3+i);cx.strokeStyle='rgba(255,255,255,'+a+')';cx.lineWidth=(2+i*0.3)*s;cx.beginPath();
      for(let x=0;x<=W;x+=12*s){const y=yy+Math.sin(x*0.02/s+t*(1.2+i*0.15)+i)*4*s;x?cx.lineTo(x,y):cx.moveTo(x,y)}cx.stroke()}break}
   case'zzz':{for(let i=0;i<3;i++){const p=(t*0.6+i/3)%1;cx.globalAlpha=1-p;txt('z',o.x+p*18*s,o.y-p*40*s,(14+p*12)*s,'#cfe6ff')}break}
   case'bubbles':{for(let i=0;i<n;i++){const y=(R(i)*H-t*(30+R(i+1)*40)*s+H*10)%H,x=R(i+2)*W+Math.sin(t*2+i)*10*s;cx.strokeStyle='rgba(255,255,255,.5)';cx.lineWidth=1.5*s;cx.beginPath();cx.arc(x,y,(3+R(i+3)*5)*s,0,7);cx.stroke()}break}
  }cx.restore()}
 /* gentle sway for foreground foliage silhouettes */
 function fern(x,y,h,t,col='rgba(20,60,30,.92)',dir=1){cx.save();cx.translate(x,y);cx.rotate(Math.sin(t*0.9+x*0.01)*0.04);cx.fillStyle=col;
  for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*0.32*dir;cx.save();cx.rotate(a+Math.PI/2);cx.beginPath();cx.moveTo(0,0);cx.quadraticCurveTo(h*0.22,-h*0.5,0,-h*(0.75+0.25*Math.cos((i-3)*0.5)));cx.quadraticCurveTo(-h*0.22,-h*0.5,0,0);cx.fill();cx.restore()}cx.restore()}
 let shakeT=0,shakeA=0;function shake(a=8){shakeA=Math.max(shakeA,a*G.s);shakeT=0.35}
 function shakeApply(dt){if(shakeT>0){shakeT-=dt;const k=Math.max(0,shakeT/0.35);cx.translate((Math.random()-0.5)*shakeA*k*2,(Math.random()-0.5)*shakeA*k*2)}else shakeA=0}
 return{IMG,load,ok,E,bg,mapOf,at,strip,stripV,spr,sprW,actor,shadow,hopper,hopTo,squash,walker,walkTo,walkSpr,flySpr,rigOf,burst,popText,stepParticles,drawParticles,clearParticles,star4,heart,txt,glowDot,bubble,rr,panel,vignette,tint,amb,fern,shake,shakeApply,pickBg,last:()=>lastMap,progress:()=>loaded/total}})();
