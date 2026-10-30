/* The mini-games, one per story beat. Every game always finishes (no game over); stars depend on how well you did. */
const A=Art,TAU=Math.PI*2;
function starsFrom(r){return r>=0.85?3:r>=0.5?2:1}
function bubble(x,y,text,s){cx.font='700 '+Math.round(20*s)+'px Trebuchet MS,sans-serif';const w=cx.measureText(text).width+20*s;A.rr(x-w/2,y-34*s,w,32*s,12*s,'#fffcf0',A.LINE,2*s);
 A.poly([[x-6*s,y-3*s],[x+6*s,y-3*s],[x,y+6*s]],'#fffcf0');cx.fillStyle='#2a2238';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(text,x,y-18*s)}
function label(x,y,text,size,col){cx.font='800 '+Math.round(size)+'px Trebuchet MS,sans-serif';cx.textAlign='center';cx.textBaseline='middle';cx.lineWidth=size*0.22;cx.strokeStyle='#2a2238';cx.strokeText(text,x,y);cx.fillStyle=col||'#fff';cx.fillText(text,x,y)}
function zzz(x,y,s,t){for(let i=0;i<3;i++){const p=(t*0.6+i/3)%1;cx.globalAlpha=1-p;label(x+p*18*s,y-p*40*s,'z',(14+p*10)*s,'#bfe3ff')}cx.globalAlpha=1}
const GAMES={};
/* ================= walk & run level (chapter 2 island as a child, chapter 5 palace as an adult) ================= */
GAMES.walk=cfg=>{const g={axes:true,t:0,done:false,got:0,met:0,bumps:0,hx:0.8,hy:0,vx:0,vy:0,flip:false,o:{},items:cfg.items.map(i=>({...i,got:false})),
  friends:(cfg.friends||[]).map(f=>({...f,met:false,mt:0})),movers:(cfg.movers||[]).map(m=>({...m,x:m.x0,d:1,gt:{}})),fol:[{k:'sagi',x:-0.2,gt:{}},{k:'tika',x:-1.2,gt:{}}],azx:0.3,azy:0,jumpQ:0,
  max:cfg.items.length+(cfg.friends||[]).length};
 const v=cfg.v,ch=()=>G.ash[v];
 function dims(){const U=G.land?G.H*0.34:Math.min(G.H*0.25,G.W*0.52);return{U,gy:G.land?G.H*0.88:G.H*0.82}}
 const ground=x=>{let h=0;for(const o of cfg.obst)if(Math.abs(x-o.x)<o.w/2+0.1)h=Math.max(h,o.h);return h};
 g.jump=()=>{if(g.hy<=ground(g.hx)+0.001&&g.vy===0){const gr=3.4;g.vy=Math.sqrt(2*gr*0.62);Sound.fx('jump')}};
 g.act=()=>g.jump();
 g.key=c=>{if(c==='ArrowUp'||c==='KeyW'||c==='Space'){g.jump();return true}return false};
 g.padBtn=n=>{if(n==='a'||n==='up'&&false){g.jump();return true}return false};
 g.up=p=>{if(p.tap||p.swipe==='up')g.jump()};
 g.update=dt=>{g.t+=dt;const{U,gy}=dims(),R=ch().R,walkV=R.vw/R.ground*0.95,runV=R.vr/R.ground*1.05;
  let dir=axisX(),run=runHeld();
  for(const p of G.ptr.values()){if(performance.now()-p.st<110)continue;const cam=g.cam||0,hsx=g.hx*U-cam,dx=p.x-hsx;if(Math.abs(dx)>U*0.22){dir=Math.sign(dx);run=Math.abs(dx)>Math.max(U*1.3,G.W*0.3)}else dir=0;break}
  if(Math.abs(dir)<0.2)dir=0;const tv=dir?Math.sign(dir)*(run?runV:walkV):0;g.vx+=clamp(tv-g.vx,-4*dt,4*dt);if(dir)g.flip=dir<0;
  let nx=clamp(g.hx+g.vx*dt,0.3,cfg.len+0.5);if(g.hy<ground(nx)-0.02){nx=g.hx;g.vx=0}g.hx=nx;
  const gr=3.4;if(g.vy!==0||g.hy>ground(g.hx)){g.vy-=gr*dt;g.hy+=g.vy*dt;const gh=ground(g.hx);if(g.hy<=gh){g.hy=gh;g.vy=0}}
  const on=g.vy===0;stepAsh(v,g.o,g.hx*U,U,g.flip,on);
  for(const it of g.items)if(!it.got&&Math.abs(it.x-g.hx)<0.28&&Math.abs((g.hy+0.5)-it.h)<0.5){it.got=true;g.got++;Sound.fx('collect')}
  for(const f of g.friends){if(!f.met&&Math.abs(f.x-g.hx)<0.7){f.met=true;f.mt=g.t;g.got++;Sound.fx('good')}}
  for(const m of g.movers){const px=m.x;m.x+=m.d*0.32*dt;if(m.x>m.x0+m.r||m.x<m.x0-m.r)m.d*=-1;A.gaitStep(m.gt,m.x*U,0.12*U,dt);m.flip=m.d<0;
   if(Math.abs(m.x-g.hx)<0.25&&g.hy<0.14&&(!g.bt||g.t-g.bt>0.8)){g.bt=g.t;g.bumps++;g.vx=-Math.sign(m.x-g.hx||1)*0.9;g.vy=1.2;g.hy=0.001;Sound.fx('squeak');toast('Eek! A rat!')}}
  let lead=g.hx;for(const f of g.fol){const tx=lead-(f.k==='sagi'?0.75:0.85);f.x+=clamp(tx-f.x,-1.3*dt,1.3*dt);A.gaitStep(f.gt,f.x*U,f.k==='tika'?0.22*U:0.16*U,dt);lead=f.x}
  g.azx=lerp(g.azx,g.hx+0.4,Math.min(1,dt*1.5));
  g.cam=clamp(g.hx*U-G.W*0.38,0,cfg.len*U+U-G.W);
  hudInfo((cfg.icon||'')+' '+g.got+' / '+g.max);
  if(g.hx>=cfg.len){g.done=true}};
 g.draw=()=>{const{U,gy}=dims(),s=G.s,cam=g.cam||0,t=G.t;
  if(cfg.bg==='island'){A.islandBg(G.W,G.H,t,s,gy);for(let i=0;i<cfg.len/3+3;i++){const x=i*3.1*U*0.6-cam*0.6;if(x>-U*2&&x<G.W+U*2)A.palm(x,gy-U*0.05,U*1.6,i%2?0.25:-0.2,t)}
   for(let i=0;i<cfg.len/2+2;i++){const x=i*2.3*U-cam;if(x>-U*2&&x<G.W+U)A.bush(x,gy-U*0.02,s*U/180)}
   const wx=cfg.len*U-cam+U*0.4;A.waterfall(wx,gy-U*1.9,U*0.7,U*1.9,t,s);A.rr(wx-U*1.1,gy-U*0.06,U*0.9,U*0.12,6*s,'#e74c6c');for(let i=0;i<4;i++)A.rr(wx-U*1.1+i*U*0.22,gy-U*0.06,U*0.11,U*0.12,0,'#fff')}
  else{A.palaceHall(G.W,G.H,t,s,cam,gy);const dx=cfg.len*U-cam+U*0.3;A.rr(dx,gy-U*1.6,U*1.0,U*1.6,U*0.5,'#7a4a22',A.LINE,3*s);A.circ(dx+U*0.8,gy-U*0.8,6*s,'#ffd23f');label(dx+U*0.5,gy-U*1.8,'Ballroom',24*s,'#ffd23f')
   if(cfg.ariana){const ax=cfg.ariana*U-cam;A.person(ax,gy-U*0.02,U*1.05,t,{...A.CAST.ariana});if(Math.abs(cfg.ariana-g.hx)<2)bubble(ax,gy-U*1.25,'Hmph!',s)}}
  for(const o of cfg.obst){const x=o.x*U-cam;if(x<-U||x>G.W+U)continue;if(o.kind==='log'){A.rr(x-o.w*U/2,gy-o.h*U,o.w*U,o.h*U,o.h*U/2,'#8a5a2b',A.LINE,2*s);A.circ(x+o.w*U/2-o.h*U/2,gy-o.h*U/2,o.h*U*0.32,'#c79a5a',A.LINE,1.5*s)}
   else if(o.kind==='rock'){A.ell(x,gy-o.h*U/2,o.w*U/2,o.h*U/2+2,'#8d92a6',A.LINE,2*s);A.ell(x-o.w*U*0.15,gy-o.h*U*0.7,o.w*U*0.12,o.h*U*0.12,'#b5bacb')}
   else{A.rr(x-o.w*U/2,gy-o.h*U,o.w*U,o.h*U,6*s,'#c9a86a',A.LINE,2*s);A.rr(x-o.w*U/2-4*s,gy-o.h*U,o.w*U+8*s,8*s,4*s,'#e9cf8f',A.LINE,1.5*s);A.circ(x,gy-o.h*U-10*s,9*s,'#fff',A.LINE,1.5*s)}}
  for(const it of g.items){if(it.got)continue;const x=it.x*U-cam,y=gy-it.h*U+Math.sin(t*2+it.x)*3*s;if(x<-50||x>G.W+50)continue;
   if(cfg.bg==='island'){A.circ(x,y,0.09*U,'#ffb03a',A.LINE,2*s);A.ell(x+0.05*U,y-0.09*U,0.05*U,0.025*U,'#3cb554')}else{for(let i=0;i<5;i++){const a=i/5*TAU;A.circ(x+Math.cos(a)*0.05*U,y+Math.sin(a)*0.05*U,0.04*U,'#ff8fb8',A.LINE,1*s)}A.circ(x,y,0.035*U,'#ffd23f')}
   A.sparkle(x+0.1*U,y-0.1*U,6*s,'#fff',0.5+0.5*Math.sin(t*4+it.x))}
  for(const f of g.friends){const x=f.x*U-cam;if(x<-U||x>G.W+U)continue;if(f.who==='tallulah')A.tallulah(x,gy,U*0.4,t,{flip:true});else A.person(x,gy,U*1.0,t,{...A.CAST[f.who],flip:true});
   if(f.met&&g.t-f.mt<2.2)bubble(x,gy-U*1.15,f.line,s)}
  for(const m of g.movers){const x=m.x*U-cam;if(x>-U&&x<G.W+U)A.rat(x,gy,U*0.17,m.gt,t,{flip:m.flip})}
  const tk=g.fol[1],sg=g.fol[0];A.tika(tk.x*U-cam,gy,U*(v==='child'?0.48:0.42),tk.gt,t,{flip:false});A.sagi(sg.x*U-cam,gy,U*0.3,sg.gt,t,{});
  A.azul(g.azx*U-cam,gy-U*1.25+Math.sin(t*1.5)*6*s,U*0.32,t,{fly:true});
  drawAsh(v,g.o,g.hx*U-cam,gy-g.hy*U,U,g.flip);
  if(g.t<5)label(G.W/2,G.H*0.2,G.land?'Hold where you want to go. Tap to jump.':'Hold where to go. Tap to jump.',24*s,'#fff')};
 g.stars=()=>starsFrom((g.got-g.bumps*0.5)/g.max);
 g.qa=()=>{const{U,gy}=dims();return{hx:g.hx,len:cfg.len,obst:cfg.obst,U,gy,cam:g.cam,hy:g.hy,vx:g.vx,o:{u:g.o._ku,a:g.o._ka,v:g.o._kv,D:g.o._kD,f:g.o._kf}}};
 return g};
/* ================= chapter 1: find the clues on the beach ================= */
GAMES.find=()=>{const L=[['chest','the chest'],['banner','the purple banner'],['blanket','the blanket'],['lantern','the lantern'],['bottle','the bottle'],['rope','the rope']];
 const g={t:0,done:false,got:0,max:6,last:0,miss:0,fx:[]};
 const spots=()=>G.land?[[0.52,0.3],[0.86,0.28],[0.66,0.55],[0.9,0.72],[0.48,0.78],[0.72,0.86]]:[[0.2,0.25],[0.78,0.22],[0.5,0.38],[0.84,0.48],[0.22,0.52],[0.62,0.6]];
 g.items=L.map(([k,n],i)=>({k,n,i,got:false,ft:0}));
 const pos=it=>{const p=spots()[it.i];return[p[0]*G.W,p[1]*G.H]};
 g.down=p=>{let best=null,bd=1e9;for(const it of g.items){if(it.got)continue;const[x,y]=pos(it),d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=it}}
  if(best&&bd<52*G.s){best.got=true;best.ft=g.t;g.got++;g.last=g.t;Sound.fx('good');toast('Found '+best.n+'!');if(g.got>=g.max)setTimeout(()=>g.done=true,900)}else{g.miss++;Sound.fx('tap')}};
 g.update=dt=>{g.t+=dt;hudInfo('Clues '+g.got+' / 6')};
 function icon(k,x,y,s,t){switch(k){
  case'chest':A.rr(x-30*s,y-18*s,60*s,36*s,6*s,'#9a5a2a',A.LINE,2*s);A.rr(x-30*s,y-22*s,60*s,12*s,6*s,'#b06a32',A.LINE,2*s);A.rr(x-16*s,y-2*s,32*s,12*s,2*s,'#ffd23f',A.LINE,1.5*s);label(x,y+4*s,'A-S-H',10*s,'#2a2238');break;
  case'banner':cx.save();cx.translate(x,y);cx.rotate(-0.2);A.banner(-26*s,-16*s,52*s,'paladia',s);cx.restore();break;
  case'blanket':A.rr(x-26*s,y-14*s,52*s,28*s,8*s,'#ff9ec7',A.LINE,2*s);for(let i=0;i<3;i++)A.circ(x-14*s+i*14*s,y,4*s,'#fff');break;
  case'lantern':A.rr(x-12*s,y-18*s,24*s,32*s,5*s,'#ffd23f',A.LINE,2*s);A.rr(x-15*s,y-22*s,30*s,6*s,3*s,'#5a3a1a');A.circ(x,y-2*s,6*s,'#fff6c8');break;
  case'bottle':cx.save();cx.translate(x,y);cx.rotate(0.9);A.rr(-9*s,-20*s,18*s,34*s,7*s,'rgba(120,220,200,.85)',A.LINE,2*s);A.rr(-4*s,-28*s,8*s,10*s,2*s,'#9a5a2a');cx.restore();break;
  case'rope':cx.strokeStyle='#c9a86a';cx.lineWidth=6*s;for(let i=0;i<3;i++){cx.beginPath();cx.ellipse(x,y,(22-i*6)*s,(12-i*3)*s,0,0,TAU);cx.stroke()}break}}
 g.draw=()=>{const s=G.s,t=G.t,gy=G.H*0.18;A.sky(G.W,G.H,['#ffd7a8','#ffe9c4']);A.sea(G.W,G.H*0.06,G.H*0.16,t,'#7fd3e8','#4ab0d0',s);A.cloud(G.W*0.1,G.H*0.04,s*0.7,0.7);
  cx.fillStyle=A.grad(G.H*0.15,G.H,['#f7dd9a','#e8c477']);cx.fillRect(0,G.H*0.15,G.W,G.H);
  for(let i=0;i<14;i++){const x=(i*137%100)/100*G.W,y=G.H*(0.2+((i*53)%70)/100);cx.save();cx.translate(x,y);cx.rotate((i%5-2)*0.4);A.rr(-34*s,-7*s,68*s,14*s,4*s,'#a87a4a',A.LINE,1.5*s);cx.restore();A.ell(x+20*s,y+16*s,16*s,5*s,'#3a8a4a')}
  for(const it of g.items){const[x,y]=pos(it);if(it.got){const p=Math.min(1,(g.t-it.ft)/0.8);if(p<1){cx.globalAlpha=1-p;icon(it.k,x,y-p*60*s,s*(1+p*0.4),t);cx.globalAlpha=1}continue}
   if(g.t-g.last>8){const r=(30+8*Math.sin(t*4))*s;A.circ(x,y,r,null,'rgba(255,255,255,.9)',4*s)}icon(it.k,x,y,s,t)}
  // tray of found clues
  const ty=G.H-56*s;A.rr(10*s,ty-6*s,G.W-20*s,52*s,14*s,'rgba(255,252,240,.85)',A.LINE,2*s);g.items.forEach((it,i)=>{const x=10*s+(G.W-20*s)*(i+0.5)/6;if(it.got)icon(it.k,x,ty+20*s,s*0.6,t);else A.circ(x,ty+20*s,12*s,null,'#c9b48a',2*s)});
  const bx=G.land?G.W*0.16:G.W*0.5,by=G.land?G.H*0.86:G.H*0.84,hh=G.land?G.H*0.36:G.H*0.17;
  drawAsh('child',{},bx,by,hh,false);A.sagi(bx-hh*0.55,by,hh*0.42,{},t,{flip:false});A.azul(bx+hh*0.6,by,hh*0.5,t,{flip:true})};
 g.stars=()=>g.miss<6?3:g.miss<14?2:1;
 g.qa=()=>({targets:g.items.filter(i=>!i.got).map(pos)});return g};
/* ================= chapter 3: calm the crocodiles ================= */
GAMES.crocs=()=>{const g={t:0,done:false,calm:0,need:10,hearts:3,crocs:[],next:1.2,spawned:0};
 const ant=()=>[G.land?G.W*0.62:G.W*0.5,G.land?G.H*0.52:G.H*0.46];
 g.down=p=>{let best=null,bd=1e9;for(const c of g.crocs){if(c.calm)continue;const d=Math.hypot(p.x-c.x,p.y-c.y);if(d<bd){bd=d;best=c}}
  if(best&&bd<70*G.s){best.calm=true;best.ct=g.t;g.calm++;Sound.fx('good');if(g.calm>=g.need)setTimeout(()=>g.done=true,1000)}else Sound.fx('tap')};
 g.update=dt=>{g.t+=dt;const[ax,ay]=ant(),s=G.s;g.next-=dt;
  if(g.next<=0&&g.crocs.filter(c=>!c.calm).length<3&&g.calm+g.crocs.filter(c=>!c.calm).length<g.need){const L=Math.random()<0.5;g.crocs.push({x:L?-60*s:G.W+60*s,y:rnd(G.H*0.25,G.H*0.72),v:(38+g.spawned*2.5)*s,calm:false});g.spawned++;g.next=Math.max(0.9,1.9-g.spawned*0.07)}
  for(const c of g.crocs){if(c.calm){const d=Math.sign(c.x-ax)||1;c.x+=d*80*s*dt;continue}const dx=ax-c.x,dy=ay-c.y,d=Math.hypot(dx,dy);c.fl=dx<0;
   if(d<62*s){c.calm=true;c.ct=g.t;c.bit=true;g.lastBit=g.t;g.hearts=Math.max(0,g.hearts-1);Sound.fx('splash');toast('Splash! Antonio got wet!')}else{c.x+=dx/d*c.v*dt;c.y+=dy/d*c.v*dt}}
  g.crocs=g.crocs.filter(c=>!(c.calm&&(c.x<-120*s||c.x>G.W+120*s)));hudInfo('Calm '+g.calm+'/'+g.need+'  '+'\u2665'.repeat(g.hearts))};
 g.draw=()=>{const s=G.s,t=G.t,[ax,ay]=ant();A.sky(G.W,G.H,['#58d0e0','#2a9bc4']);A.sea(G.W,0,G.H,t,'#5fd6e6','#1f86b8',s);
  for(let i=0;i<3;i++){A.palm(G.W*(0.05+i*0.45),G.H*0.12,G.H*0.12,i%2?0.3:-0.3,t)}cx.fillStyle='#f7dd9a';cx.fillRect(0,G.H*0.86,G.W,G.H*0.14);
  A.ell(ax,ay+8*s,70*s,22*s,'#8d92a6',A.LINE,2*s);A.person(ax,ay+2*s,110*s,t,{...A.CAST.antonio,frown:g.t-(g.lastBit||-9)<1.2});
  for(const c of g.crocs){A.croc(c.x,c.y,34*s,t,{flip:c.calm?(c.x<ax):c.fl,calm:c.calm})}
  const bx=G.W*0.18,by=G.H*0.97;drawAsh('adult',{},bx,by,G.H*(G.land?0.3:0.13),false);A.tika(bx+G.W*0.62,by,G.H*(G.land?0.14:0.07),{},t,{flip:true});A.sagi(bx+G.W*0.22,by,G.H*(G.land?0.1:0.05),{},t,{});
  if(g.t<4)label(G.W/2,G.H*0.16,'Tap the crocodiles!',28*s,'#fff')};
 g.stars=()=>g.hearts>=3?3:g.hearts>=2?2:1;
 g.qa=()=>({targets:g.crocs.filter(c=>!c.calm).map(c=>[c.x,c.y])});return g};
/* ================= chapter 4: sail to Apollonia ================= */
GAMES.voyage=()=>{const g={axes:true,t:0,done:false,dur:40,x:0.5,tx:0.5,got:0,hits:0,obj:[],next:0.5,inv:0,n:0};
 g.down=p=>{g.tx=clamp(p.x/G.W,0.08,0.92)};g.move=p=>{g.tx=clamp(p.x/G.W,0.08,0.92)};
 g.update=dt=>{g.t+=dt;const s=G.s,ax=axisX();if(ax)g.tx=clamp(g.x+ax*0.25,0.08,0.92);g.x+=clamp(g.tx-g.x,-1.1*dt,1.1*dt);g.inv=Math.max(0,g.inv-dt);
  g.next-=dt;if(g.next<=0&&g.t<g.dur-2){g.n++;const k=g.n%3===0?'rock':'star';g.obj.push({k,x:rnd(0.1,0.9),y:-0.08});g.next=rnd(0.55,0.9)}
  const sp=0.26;for(const o of g.obj){o.y+=sp*dt;const dx=(o.x-g.x)*G.W,dy=(o.y-0.8)*G.H;if(!o.hit&&Math.hypot(dx,dy)<(o.k==='rock'?48:44)*s){o.hit=true;if(o.k==='star'){g.got++;Sound.fx('collect')}else if(!g.inv){g.hits++;g.inv=1.2;Sound.fx('bad');toast('Bump!')}}}
  g.obj=g.obj.filter(o=>o.y<1.1&&!(o.hit&&o.k==='star'));hudInfo('\u2605 '+g.got+'   '+Math.max(0,Math.ceil(g.dur-g.t))+'s');if(g.t>=g.dur)g.done=true};
 g.draw=()=>{const s=G.s,t=G.t;cx.fillStyle=A.grad(0,G.H,['#2a9bc4','#1b6fa8']);cx.fillRect(0,0,G.W,G.H);
  for(let i=0;i<14;i++){const y=((i/14)*G.H+t*0.26*G.H)%G.H,x=(i*97%100)/100*G.W;A.ln([[x-20*s,y],[x,y-6*s],[x+20*s,y]],'rgba(255,255,255,.45)',3*s)}
  if(g.t>g.dur-6){const p=(g.t-(g.dur-6))/6;A.ell(G.W/2,-40*s+p*G.H*0.25,G.W*0.6,70*s,'#f7dd9a');for(let i=0;i<3;i++)A.rr(G.W*(0.3+i*0.15),-90*s+p*G.H*0.25,30*s,60*s,6*s,'#fff8ec',A.LINE,2*s)}
  for(const o of g.obj){const x=o.x*G.W,y=o.y*G.H;if(o.k==='star'){A.sparkle(x,y,22*s,'#ffd23f');A.sparkle(x,y,10*s,'#fff')}else{A.ell(x,y,40*s,30*s,'#6c7286',A.LINE,2*s);A.ell(x-10*s,y-8*s,14*s,8*s,'#9aa0b4');A.ell(x,y+26*s,46*s,8*s,'rgba(255,255,255,.5)')}}
  for(let i=0;i<2;i++){const dx=G.W*(0.15+i*0.7),dy=G.H*(0.5+0.2*Math.sin(t*0.7+i));A.dolphin(dx,dy,26*s,t,{flip:i===1})}
  const x=g.x*G.W,y=G.H*0.8,r=1;cx.save();cx.translate(x,y);cx.rotate((g.tx-g.x)*0.6);if(g.inv>0)cx.globalAlpha=0.6;
  A.ell(0,0,30*s,62*s,'#8a5a2b',A.LINE,3*s);A.ell(0,4*s,22*s,50*s,'#c79a5a');A.circ(0,-14*s,4*s,'#5a3a1a');A.circ(0,22*s,4*s,'#5a3a1a');cx.beginPath();cx.moveTo(-40*s,-20*s);cx.quadraticCurveTo(0,-34*s,40*s,-20*s);cx.lineTo(40*s,-10*s);cx.quadraticCurveTo(0,-24*s,-40*s,-10*s);cx.closePath();cx.fillStyle='#fffaf0';cx.fill();cx.strokeStyle=A.LINE;cx.lineWidth=2*s;cx.stroke();cx.beginPath();cx.moveTo(-32*s,18*s);cx.quadraticCurveTo(0,6*s,32*s,18*s);cx.lineTo(32*s,27*s);cx.quadraticCurveTo(0,15*s,-32*s,27*s);cx.closePath();cx.fillStyle='#fffaf0';cx.fill();cx.stroke();A.poly([[0,-66*s],[10*s,-56*s],[-10*s,-56*s]],'#3a6fd8');cx.restore();cx.globalAlpha=1;
  A.ell(x,y+70*s,26*s,8*s,'rgba(255,255,255,.4)');if(g.t<4)label(G.W/2,G.H*0.2,'Drag to steer. Catch the stars!',26*s,'#fff')};
 g.stars=()=>starsFrom((g.got-g.hits*2)/Math.max(1,Math.floor(g.n*2/3)));
 g.qa=()=>({x:g.x,obj:g.obj});return g};
/* ================= chapter 6: dance at the ball (rhythm) ================= */
GAMES.ball=()=>{const tr=Sound.track('waltz'),mel=tr.parts[0].tok,sd=60/tr.bpm/tr.div,notes=[];
 for(let loop=0;loop<2;loop++)mel.forEach((tk,i)=>{if(tk==='.'||tk==='-')return;const f=Sound.hz(tk);notes.push({t:2.0+(loop*mel.length+i)*sd,lane:f<760?0:f<1000?1:2,st:0})});
 const g={t:0,done:false,notes,hit:0,perfect:0,miss:0,fb:[],fall:1.7,lastNow:0,started:false};
 const now=()=>g.started?Sound.time()-g.t0:0;
 const lanes=()=>{const w=Math.min(G.W,640),x0=(G.W-w)/2;return{x0,w:w/3,hy:G.H*0.84}};
 function hitLane(l){const n=now();let best=null,bd=9;for(const o of g.notes){if(o.st||o.lane!==l)continue;const d=Math.abs(o.t-n);if(d<bd){bd=d;best=o}}
  if(best&&bd<0.2){best.st=1;g.hit++;const p=bd<0.09;if(p)g.perfect++;g.fb.push({l,t:g.t,txt:p?'Perfect!':'Good!'});Sound.fx('tap')}else{g.fb.push({l,t:g.t,txt:''})}}
 g.down=p=>{const L=lanes();hitLane(clamp(Math.floor((p.x-L.x0)/L.w),0,2))};
 g.key=c=>{const m={ArrowLeft:0,KeyA:0,KeyJ:0,ArrowDown:1,KeyS:1,KeyK:1,ArrowUp:1,ArrowRight:2,KeyD:2,KeyL:2}[c];if(m===undefined)return false;hitLane(m);return true};
 g.padBtn=n=>{const m={left:0,x:0,down:1,a:1,up:1,y:1,right:2,b:2}[n];if(m===undefined)return false;hitLane(m);return true};
 g.act=()=>hitLane(1);
 g.update=dt=>{if(!g.started){g.started=true;Sound.stop();Sound.play('waltz');const i=Sound.info();g.t0=i?i.t0:Sound.time()}
  g.t+=dt;const n=now();if(Sound.time()===0){g.t0=(g.t0||0)-dt}
  const pn=performance.now();if(g.lastNow&&pn-g.lastNow>400){for(const o of g.notes)if(!o.st&&o.t<n+0.3)o.st=3}g.lastNow=pn;
  for(const o of g.notes)if(!o.st&&n>o.t+0.22){o.st=2;g.miss++}
  hudInfo('\u266A '+g.hit+' / '+g.notes.length);if(n>g.notes[g.notes.length-1].t+1.5)g.done=true};
 g.draw=()=>{const s=G.s,t=G.t,n=now(),L=lanes();A.ballroom(G.W,G.H,t,s);
  const sw=Math.sin(n/(sd*3)*Math.PI)*0.06,cy=G.land?G.H*0.62:G.H*0.5,hh=G.land?G.H*0.42:G.H*0.24;
  cx.save();cx.translate(G.W/2,cy);cx.rotate(sw);drawAsh('adult',{},-hh*0.18,0,hh,false);A.person(hh*0.2,0,hh*1.02,t,{...A.CAST.antonio,flip:true});cx.restore();
  for(let l=0;l<3;l++){const x=L.x0+L.w*l;cx.fillStyle=l%2?'rgba(255,255,255,.08)':'rgba(255,255,255,.14)';cx.fillRect(x+4*s,G.H*0.12,L.w-8*s,G.H*0.84)}
  const cols=['#ff8fb8','#ffd23f','#7fd3ff'];for(let l=0;l<3;l++){const x=L.x0+L.w*(l+0.5);A.circ(x,L.hy,30*s,'rgba(255,255,255,.25)',cols[l],5*s)}
  for(const o of g.notes){if(o.st)continue;const p=1-(o.t-n)/g.fall;if(p<0||p>1.2)continue;const y=G.H*0.12+(L.hy-G.H*0.12)*p,x=L.x0+L.w*(o.lane+0.5);A.circ(x,y,24*s,cols[o.lane],A.LINE,3*s);A.heart(x,y+2*s,10*s,'#fff')}
  g.fb=g.fb.filter(f=>g.t-f.t<0.6);for(const f of g.fb){const x=L.x0+L.w*(f.l+0.5);A.circ(x,L.hy,(30+(g.t-f.t)*60)*s,null,'rgba(255,255,255,'+(0.8-(g.t-f.t))+')',4*s);if(f.txt)label(x,L.hy-60*s,f.txt,24*s,'#fff6a0')}
  if(n<2.5)label(G.W/2,G.H*0.2,'Tap the hearts on the circles!',24*s,'#fff')};
 g.stars=()=>starsFrom(g.hit/g.notes.length);
 g.qa=()=>({now:now(),notes:g.notes,lanes:lanes()});return g};
/* ================= chapter 7: stop Ariana's rats ================= */
GAMES.rats=()=>{const g={t:0,done:false,stop:0,bad:0,total:18,spawned:0,rats:[],next:1.0};
 const spot=i=>[G.W*(0.12+i*0.19),G.H*(G.land?0.4:0.36)],bowl=i=>[G.W*(0.2+i*0.3),G.H*(G.land?0.86:0.82)];
 g.down=p=>{let best=null,bd=1e9;for(const r of g.rats){if(r.st)continue;const d=Math.hypot(p.x-r.x,p.y-r.y+10*G.s);if(d<bd){bd=d;best=r}}
  if(best&&bd<60*G.s){best.st=1;g.stop++;Sound.fx('squeak');toast('Shoo!',500)}else Sound.fx('tap')};
 g.update=dt=>{g.t+=dt;g.next-=dt;const s=G.s;
  if(g.next<=0&&g.spawned<g.total&&g.rats.filter(r=>!r.st).length<3){const i=Math.floor(rnd(0,5)),b=Math.floor(rnd(0,3)),[x,y]=spot(i);g.rats.push({x,y,b,st:0,gt:{},d:0,v:(70+g.spawned*3)*s});g.spawned++;g.next=Math.max(0.8,1.8-g.spawned*0.05)}
  for(const r of g.rats){let tx,ty;if(r.st===1){tx=r.x+(r.x<G.W/2?-1:1)*400*s;ty=-80*s}else if(r.st===2){tx=r.x;ty=G.H+100*s}else{[tx,ty]=bowl(r.b)}
   const dx=tx-r.x,dy=ty-r.y,d=Math.hypot(dx,dy),v=r.st?r.v*2.2:r.v;if(d>1){const m=Math.min(d,v*dt);r.x+=dx/d*m;r.y+=dy/d*m;r.d+=m;r.flip=dx<0}
   if(!r.st&&d<14*s){r.st=2;g.bad++;Sound.fx('bad');toast('Oh no, the herb!',700)}A.gaitStep(r.gt,r.d,14*s,dt)}
  g.rats=g.rats.filter(r=>r.y>-60*s&&r.y<G.H+60*s);hudInfo('Stopped '+g.stop+' / '+g.total);if(g.spawned>=g.total&&!g.rats.some(r=>!r.st))g.done=true};
 g.draw=()=>{const s=G.s,t=G.t;A.palaceHall(G.W,G.H,t,s,0,G.H*0.5);cx.fillStyle='#b9c7a0';cx.fillRect(0,G.H*0.5,G.W,G.H*0.5);
  for(let i=0;i<5;i++){const[x,y]=spot(i);A.rr(x-28*s,y-50*s,56*s,56*s,10*s,'#9a5a2a',A.LINE,2*s);A.ln([[x-28*s,y-32*s],[x+28*s,y-32*s]],'#5a3a1a',3*s);A.ln([[x-28*s,y-12*s],[x+28*s,y-12*s]],'#5a3a1a',3*s)}
  for(let i=0;i<3;i++){const[x,y]=bowl(i);A.ell(x,y,40*s,16*s,'#e9e9f2',A.LINE,2*s);A.ell(x,y-4*s,32*s,9*s,'#c9a86a');const n=g.rats.filter(r=>r.b===i&&r.st===2).length;
   const who=['azul','tallulah','sagi'][i];if(who==='azul')A.azul(x+52*s,y+10*s,56*s,t,{flip:true});else if(who==='tallulah')A.tallulah(x+50*s,y+12*s,50*s,t,{flip:true});else A.sagi(x+56*s,y+12*s,40*s,{},t,{flip:true})}
  for(const r of g.rats)A.rat(r.x,r.y,38*s,r.gt,t,{flip:r.flip,herb:!r.st});
  A.person(G.W*0.92,G.H*0.46,G.H*0.18,t,{...A.CAST.ariana,flip:true});if(g.t<4)label(G.W/2,G.H*0.2,'Tap the rats before they reach the bowls!',22*s,'#fff')};
 g.stars=()=>starsFrom(g.stop/g.total);g.qa=()=>({targets:g.rats.filter(r=>!r.st).map(r=>[r.x,r.y-10*G.s])});return g};
/* ================= chapter 8: ride the dolphins home ================= */
GAMES.dolphins=()=>{const g={axes:true,t:0,done:false,dur:38,lane:1,ly:1,got:0,hits:0,obj:[],next:0.8,inv:0,n:0,lastAy:0};
 const laneY=l=>G.H*(G.land?[0.42,0.62,0.82]:[0.48,0.63,0.78])[l];
 const mv=d=>{g.lane=clamp(g.lane+d,0,2);Sound.fx('whoosh')};
 g.up=p=>{if(p.swipe==='up')mv(-1);else if(p.swipe==='down')mv(1);else if(p.tap)mv(p.y<laneY(g.lane)-20*G.s?-1:p.y>laneY(g.lane)+20*G.s?1:0)};
 g.key=c=>{if(c==='ArrowUp'||c==='KeyW'){mv(-1);return true}if(c==='ArrowDown'||c==='KeyS'){mv(1);return true}return false};
 g.padBtn=n=>{if(n==='up'){mv(-1);return true}if(n==='down'){mv(1);return true}return false};
 g.update=dt=>{g.t+=dt;const s=G.s;const ay=G.pad.ay;if(Math.abs(ay)>0.6&&Math.abs(g.lastAy)<=0.6)mv(Math.sign(ay));g.lastAy=ay;g.ly+=clamp(g.lane-g.ly,-6*dt,6*dt);g.inv=Math.max(0,g.inv-dt);
  g.next-=dt;if(g.next<=0&&g.t<g.dur-2){g.n++;g.obj.push({k:g.n%3===0?'rock':'shell',l:Math.floor(rnd(0,3)),x:1.08});g.next=rnd(0.6,0.95)}
  for(const o of g.obj){o.x-=0.33*dt*(G.land?0.8:1);if(!o.hit&&Math.abs(o.x*G.W-G.W*0.28)<36*s&&o.l===g.lane){o.hit=true;if(o.k==='shell'){g.got++;Sound.fx('collect')}else if(!g.inv){g.hits++;g.inv=1.2;Sound.fx('bad');toast('Bump!')}}}
  g.obj=g.obj.filter(o=>o.x>-0.1&&!(o.hit&&o.k==='shell'));hudInfo('\u25D2 '+g.got+'   '+Math.max(0,Math.ceil(g.dur-g.t))+'s');if(g.t>=g.dur)g.done=true};
 g.draw=()=>{const s=G.s,t=G.t,hz=G.H*(G.land?0.3:0.38);A.sky(G.W,hz,['#7fd3ff','#ffe9c4']);A.sun(G.W*0.8,hz*0.4,26*s);A.clouds(G.W,hz,t,s,3);
  if(g.t>g.dur-10){const p=Math.min(1,(g.t-(g.dur-10))/8),x=G.W*(1.1-p*0.35);for(let i=0;i<4;i++)A.rr(x+i*26*s,hz-(40+i%2*20)*s,22*s,(40+i%2*20)*s,4*s,'#fff8ec',A.LINE,1.5*s)}
  A.sea(G.W,hz,G.H,t,'#5fd6e6','#1f86b8',s);
  for(const o of g.obj){const x=o.x*G.W,y=laneY(o.l);if(o.k==='shell'){A.ell(x,y,18*s,14*s,'#ffb6c8',A.LINE,2*s);for(let i=-1;i<=1;i++)A.ln([[x,y+12*s],[x+i*12*s,y-10*s]],'#e7799a',2*s)}else{A.ell(x,y,34*s,26*s,'#6c7286',A.LINE,2*s);A.ell(x-8*s,y-8*s,12*s,7*s,'#9aa0b4')}}
  const fy=laneY(clamp(Math.round(g.ly+1)%3,0,2));A.dolphin(G.W*0.1,laneY((g.lane+1)%3)+6*s,22*s,t,{});A.tika(G.W*0.1,laneY((g.lane+1)%3)-6*s,32*s,{},t,{});
  const x=G.W*0.28,y=G.H*(G.land?[0.42,0.62,0.82]:[0.48,0.63,0.78])[0]+(laneY(2)-laneY(0))*g.ly/2;if(g.inv>0)cx.globalAlpha=0.6;A.dolphin(x,y+8*s,30*s,t,{});
  drawAsh('adult',{},x,y-10*s,G.H*(G.land?0.24:0.13),false);A.sagi(x-34*s,y-12*s,24*s,{},t,{});cx.globalAlpha=1;
  if(g.t<4)label(G.W/2,G.H*0.2,'Swipe up or down. Catch the shells!',24*s,'#fff')};
 g.stars=()=>starsFrom((g.got-g.hits*2)/Math.max(1,Math.floor(g.n*2/3)));g.qa=()=>({lane:g.lane,obj:g.obj,laneY:[0,1,2].map(laneY)});return g};
/* ================= chapter 9: make the antidote ================= */
GAMES.antidote=()=>{const ING=[{k:'lily',n:'Moon Lily',c:'#f4f4ff'},{k:'mint',n:'Sea Mint',c:'#5fd08a'},{k:'root',n:'Golden Root',c:'#f0b030'},{k:'petal',n:'Rainbow Petal',c:'#ff8fb8'},{k:'sunset',n:'Sunset Herb',c:'#ff6a2a',bad:'That is the sleeping herb!'},{k:'thorn',n:'Thorn Weed',c:'#8d92a6',bad:'Not that one!'}];
 const order=[0,1,2,3].sort(()=>Math.random()-0.5),shelf=[0,1,2,3,4,5].sort(()=>Math.random()-0.5);
 const g={t:0,done:false,step:0,wrong:0,phase:'add',stir:0,drag:null,fly:[],ang:0,mix:[]};
 const potPos=i=>G.land?[G.W*(0.1+(i%3)*0.15),G.H*(0.3+Math.floor(i/3)*0.36)]:[G.W*(0.27+(i%2)*0.46),G.H*(0.16+Math.floor(i/2)*0.105)];
 const bowlPos=()=>G.land?[G.W*0.74,G.H*0.72]:[G.W*0.5,G.H*0.8];
 function add(slot){if(g.phase!=='add')return;const ing=ING[shelf[slot]];if(shelf[slot]===order[g.step]){g.step++;g.mix.push(ing.c);g.fly.push({slot,t:g.t});Sound.fx('good');toast(ing.n+'!',600);if(g.step>=4){g.phase='stir';setTimeout(()=>toast('Now stir in circles!',1200),650)}}
  else{g.wrong++;Sound.fx('bad');toast(ing.bad||'Not that one!',900)}}
 function potAt(p){for(let i=0;i<6;i++){const[x,y]=potPos(i);if(Math.hypot(p.x-x,p.y-y)<50*G.s)return i}return -1}
 g.down=p=>{if(g.phase==='add'){const i=potAt(p);if(i>=0)g.drag={i,x:p.x,y:p.y,sx:p.x,sy:p.y}}else if(g.phase==='stir'){const[bx,by]=bowlPos();g.pa=Math.atan2(p.y-by,p.x-bx)}};
 g.move=p=>{if(g.drag){g.drag.x=p.x;g.drag.y=p.y}else if(g.phase==='stir'&&g.pa!==undefined){const[bx,by]=bowlPos(),a=Math.atan2(p.y-by,p.x-bx);let d=a-g.pa;d=Math.atan2(Math.sin(d),Math.cos(d));g.pa=a;stirBy(Math.abs(d))}};
 g.up=p=>{if(g.drag){const d=g.drag,[bx,by]=bowlPos();g.drag=null;if(p.tap||Math.hypot(p.x-bx,p.y-by)<90*G.s)add(d.i)}g.pa=undefined};
 g.key=c=>{const m=/^Digit([1-6])$/.exec(c);if(m){add(+m[1]-1);return true}return false};
 function stirBy(a){if(g.phase!=='stir')return;const before=Math.floor(g.stir/TAU);g.stir+=a;g.ang+=a;if(Math.floor(g.stir/TAU)>before)Sound.fx('stir');if(g.stir>=TAU*3){g.phase='done';Sound.fx('star');toast('The antidote is ready!',1400);setTimeout(()=>g.done=true,1500)}}
 g.update=dt=>{g.t+=dt;if(g.phase==='stir'){const a=Math.abs(axisX())+Math.abs(axisY())+(G.pad.btn.a||G.keys.Space||G.keys.Enter?1:0);if(a)stirBy(Math.min(1,a)*5*dt)}
  hudInfo(g.phase==='add'?'Next: '+ING[order[g.step]].n:g.phase==='stir'?'Stir '+Math.min(3,Math.floor(g.stir/TAU))+' / 3':'Ready!')};
 g.act=()=>{if(g.phase==='stir')stirBy(0.6);else if(G.cur.on){const i=potAt(G.cur);if(i>=0)add(i)}else G.cur.on=true};
 function plant(k,x,y,s){switch(k){case'lily':for(let i=0;i<6;i++){const a=i/6*TAU;A.ell(x+Math.cos(a)*10*s,y+Math.sin(a)*10*s,9*s,5*s,'#f4f4ff',A.LINE,1.2*s,a)}A.circ(x,y,5*s,'#ffd23f');break;
  case'mint':for(let i=0;i<5;i++)A.ell(x+(i-2)*7*s,y-Math.abs(i-2)*-4*s,6*s,12*s,'#5fd08a',A.LINE,1.2*s,(i-2)*0.4);break;
  case'root':A.ell(x,y,8*s,16*s,'#f0b030',A.LINE,1.5*s,0.4);A.ln([[x+4*s,y+12*s],[x+10*s,y+20*s]],'#c08020',2*s);break;
  case'petal':['#ff5d5d','#ffb03a','#ffe14a','#5fd08a','#5fb0ff','#b07aff'].forEach((c,i)=>A.ell(x+Math.cos(i)*8*s,y+Math.sin(i)*8*s,8*s,4*s,c,null,0,i));break;
  case'sunset':for(let i=0;i<4;i++)A.ell(x+(i-1.5)*7*s,y,5*s,14*s,'#ff6a2a',A.LINE,1.2*s,(i-1.5)*0.3);A.circ(x,y-12*s,4*s,'#ffd23f');break;
  case'thorn':A.ln([[x,y+12*s],[x,y-14*s]],'#6c7286',4*s);for(let i=0;i<4;i++)A.poly([[x,y-8*s+i*6*s],[x+(i%2?9:-9)*s,y-12*s+i*6*s],[x,y-4*s+i*6*s]],'#8d92a6');break}}
 g.draw=()=>{const s=G.s,t=G.t;A.greenhouse(G.W,G.H,t,s);
  for(let i=0;i<6;i++){const[x,y]=potPos(i),ing=ING[shelf[i]];A.rr(x-46*s,y+20*s,92*s,10*s,4*s,'#8a5a2b');A.rr(x-24*s,y-2*s,48*s,26*s,6*s,'#c9763a',A.LINE,2*s);
   if(!(g.drag&&g.drag.i===i))plant(ing.k,x,y-14*s,s*1.4);label(x,y+44*s,ing.n,G.land?18*s:20*s,'#fff');if(G.land===false&&false)0;label(x-36*s,y+10*s,String(i+1),20*s,'#ffd23f')}
  const[bx,by]=bowlPos();A.ell(bx,by,78*s,30*s,'#8a5a2b',A.LINE,3*s);const mc=g.mix.length?g.mix[g.mix.length-1]:'#5a8fb0';A.ell(bx,by-6*s,64*s,18*s,g.phase==='done'?'#b9f5ff':mc);
  if(g.phase!=='add'){const a=g.ang;A.ln([[bx+Math.cos(a)*40*s,by-6*s+Math.sin(a)*12*s],[bx+Math.cos(a)*30*s,by-70*s]],'#c79a5a',8*s)}
  if(g.phase==='stir'){cx.strokeStyle='rgba(255,255,255,.8)';cx.lineWidth=4*s;cx.beginPath();cx.ellipse(bx,by-6*s,96*s,40*s,0,0,Math.PI*1.6);cx.stroke()}
  if(g.phase==='done')for(let i=0;i<6;i++)A.sparkle(bx+Math.cos(t*2+i)*70*s,by-30*s+Math.sin(t*3+i)*20*s,10*s,'#fff');
  // recipe card
  const rx=G.land?G.W*0.52:G.W*0.06,ry=G.land?G.H*0.12:G.H*0.5,rw=G.land?G.W*0.44:G.W*0.88;A.rr(rx,ry,rw,58*s,14*s,'#fffcf0',A.LINE,2*s);
  order.forEach((o,i)=>{const x=rx+rw*(i+0.5)/4,y=ry+29*s;if(i<g.step){A.circ(x,y,20*s,'#c8f5c8')}else if(i===g.step&&g.phase==='add')A.circ(x,y,22*s,null,'#ff5d8f',4*s);plant(ING[o].k,x,y,s)});
  if(g.drag){plant(ING[shelf[g.drag.i]].k,g.drag.x,g.drag.y,s*1.6)}for(const f of g.fly){const p=(g.t-f.t)/0.5;if(p<1){const[x,y]=potPos(f.slot);plant(ING[shelf[f.slot]].k,lerp(x,bx,p),lerp(y,by,p)-Math.sin(p*Math.PI)*60*s,s*1.2)}}
  drawAsh('adult',{},G.land?G.W*0.9:G.W*0.86,G.land?G.H*0.98:G.H*0.98,G.H*(G.land?0.38:0.2),true)};
 g.stars=()=>g.wrong===0?3:g.wrong<3?2:1;
 g.qa=()=>({phase:g.phase,next:g.phase==='add'?potPos(shelf.indexOf(order[g.step])):null,bowl:bowlPos()});return g};
/* ================= chapter 10: save the wedding cake ================= */
GAMES.cake=()=>{const who=['king','danielle','rita','sofia','gina','frazer'];const g={t:0,done:false,saved:0,eaten:0,total:14,spawned:0,next:1.0,seats:who.map(w=>({w,r:-1,sleepy:false,gone:0}))};
 const seat=i=>{const w=Math.min(G.W,760),x0=(G.W-w)/2;return[x0+w*(i+0.5)/6,G.H*(G.land?0.72:0.66)]};
 g.down=p=>{let bi=-1,bd=1e9;g.seats.forEach((st,i)=>{if(st.r<0)return;const[x,y]=seat(i),d=Math.hypot(p.x-x,p.y-(y+22*G.s));if(d<bd){bd=d;bi=i}});
  if(bi>=0&&bd<60*G.s){const st=g.seats[bi];st.r=-1;st.gone=g.t;g.saved++;Sound.fx('good');toast('Saved!',500)}else Sound.fx('tap')};
 g.update=dt=>{g.t+=dt;g.next-=dt;const act=g.seats.filter(s=>s.r>=0).length;
  if(g.next<=0&&g.spawned<g.total&&act<2){const free=g.seats.map((s,i)=>i).filter(i=>g.seats[i].r<0&&g.t-g.seats[i].gone>0.8);if(free.length){g.seats[pick(free)].r=0;g.spawned++;g.next=Math.max(0.7,1.6-g.spawned*0.05)}}
  for(const st of g.seats)if(st.r>=0){st.r+=dt/Math.max(1.5,2.6-g.spawned*0.06);if(st.r>=1){st.r=-1;st.gone=g.t;st.sleepy=true;g.eaten++;Sound.fx('bad');toast('Yawn... so sleepy!',700)}}
  hudInfo('Saved '+g.saved+' / '+g.total);if(g.spawned>=g.total&&g.seats.every(s=>s.r<0))g.done=true};
 g.draw=()=>{const s=G.s,t=G.t;A.garden(G.W,G.H,t,s);const ty=G.H*(G.land?0.72:0.66);
  A.person(G.W*0.42,G.H*(G.land?0.5:0.5),G.H*0.16,t,{...A.CAST.luciana});A.person(G.W*0.58,G.H*(G.land?0.5:0.5),G.H*0.17,t,{...A.CAST.antonio,flip:true});
  g.seats.forEach((st,i)=>{const[x,y]=seat(i);A.person(x,y+30*s,G.H*(G.land?0.3:0.17),t,{...A.CAST[st.w],ph:i});if(st.sleepy)zzz(x+16*s,y-G.H*(G.land?0.26:0.14),s,t)});
  A.rr(0,ty+10*s,G.W,G.H-ty,0,'#fffcf0');A.rr(0,ty+10*s,G.W,14*s,0,'#ffd6e6');
  g.seats.forEach((st,i)=>{const[x,y]=seat(i),py=y+30*s;A.ell(x,py,30*s,9*s,'#fff',A.LINE,1.5*s);if(st.r>=0){A.poly([[x-18*s,py-2*s],[x+18*s,py-2*s],[x+10*s,py-26*s]],'#fff3e0',A.LINE,1.5*s);A.ln([[x-14*s,py-10*s],[x+14*s,py-10*s]],'#ff8fb8',4*s);
    cx.strokeStyle='#ff5d8f';cx.lineWidth=5*s;cx.beginPath();cx.arc(x,py-10*s,34*s,-Math.PI/2,-Math.PI/2+TAU*st.r);cx.stroke()}
   else if(t-st.gone<0.5){const p=(t-st.gone)/0.5;A.poly([[x-18*s+p*-120*s,py-2*s-p*60*s],[x+18*s+p*-120*s,py-2*s-p*60*s],[x+10*s+p*-120*s,py-26*s-p*60*s]],'#fff3e0')}});
  A.tika(G.W*0.08,G.H*0.98,G.H*(G.land?0.26:0.12),{},t,{trunkUp:true,flip:false});A.sagi(G.W*0.9,G.H*0.99,G.H*(G.land?0.14:0.07),{},t,{flip:true});
  if(g.t<4)label(G.W/2,G.H*0.2,'Tap the cake before they eat it!',24*s,'#fff')};
 g.stars=()=>starsFrom(g.saved/g.total);g.qa=()=>({targets:g.seats.map((st,i)=>st.r>=0?[seat(i)[0],seat(i)[1]+22*G.s]:null).filter(Boolean)});return g};
/* ================= chapter 11: sing the lullaby together (memory) ================= */
GAMES.lullaby=()=>{const NOTES=['C5','E5','G5','A5'],COL=['#ff8fb8','#ffd23f','#7fd3ff','#9be59b'],ROUNDS=[[0,1,2,1],[0,1,2,3,2,1],[2,3,2,1,0,1,2,0]];
 const g={t:0,done:false,round:0,i:0,phase:'listen',pt:0.8,lit:-1,litT:0,mist:0};
 const shell=k=>{const c=G.land?[G.W*0.72,G.H*0.55]:[G.W*0.5,G.H*0.68],d=G.land?G.H*0.2:Math.min(G.W*0.22,G.H*0.12);return[c[0]+(k%2?d:-d),c[1]+(k<2?-d:d)]};
 function press(k){if(g.phase!=='play')return;g.lit=k;g.litT=g.t;Sound.note(NOTES[k],0.6);const seq=ROUNDS[g.round];
  if(seq[g.i]===k){g.i++;if(g.i>=seq.length){g.round++;Sound.fx('star');if(g.round>=ROUNDS.length){g.phase='end';toast('Beautiful!',1400);setTimeout(()=>g.done=true,1500)}else{g.phase='listen';g.i=0;g.pt=g.t+1.4;toast('Lovely! Next verse...',1000)}}}
  else{g.mist++;g.phase='listen';g.i=0;g.pt=g.t+1.2;toast("Let's sing it again together",1100)}}
 g.down=p=>{for(let k=0;k<4;k++){const[x,y]=shell(k);if(Math.hypot(p.x-x,p.y-y)<70*G.s){press(k);return}}};
 g.key=c=>{const m=/^Digit([1-4])$/.exec(c);if(m){press(+m[1]-1);return true}return false};
 g.update=dt=>{g.t+=dt;if(g.phase==='listen'&&g.t>=g.pt){const seq=ROUNDS[g.round];if(g.i<seq.length){g.lit=seq[g.i];g.litT=g.t;Sound.note(NOTES[seq[g.i]],0.6);g.i++;g.pt=g.t+0.62}else{g.phase='play';g.i=0}}
  hudInfo('Verse '+Math.min(3,g.round+1)+' / 3'+(g.phase==='listen'?'  Listen...':g.phase==='play'?'  Your turn!':''))};
 g.draw=()=>{const s=G.s,t=G.t;A.sky(G.W,G.H,['#2a1d5e','#7b3fb5','#ffb4a0']);for(let i=0;i<30;i++)A.sparkle((i*97%100)/100*G.W,(i*61%40)/100*G.H,3*s,'#fff',0.4+0.4*Math.sin(t+i));
  A.sea(G.W,G.H*(G.land?0.8:0.88),G.H,t,'#7b5fc8','#3a2a7a',s);
  const cy=G.land?G.H*0.85:G.H*0.44,hh=G.land?G.H*0.56:G.H*0.22,x0=G.land?G.W*0.22:G.W*0.5;A.person(x0-hh*0.3,cy,hh*1.02,t,{...A.CAST.marissa});drawAsh('adult',{},x0+hh*0.3,cy,hh,true);
  if(g.phase==='listen'&&g.t-g.litT<0.5){for(let i=0;i<3;i++)label(x0-hh*0.3+(i-1)*24*s,cy-hh*1.15-((t*40+i*20)%30)*s,'\u266A',24*s,'#fff6a0')}
  for(let k=0;k<4;k++){const[x,y]=shell(k),on=g.lit===k&&g.t-g.litT<0.45,r=(on?62:54)*s;A.circ(x,y,r+6*s,on?'rgba(255,255,255,.8)':'rgba(255,255,255,.2)');
   cx.save();cx.translate(x,y);A.ell(0,0,r*0.85,r*0.7,COL[k],A.LINE,3*s);for(let i=-2;i<=2;i++)A.ln([[0,r*0.6],[i*r*0.3,-r*0.55]],'rgba(42,34,56,.45)',2*s);cx.restore();label(x,y+r*0.95,String(k+1),20*s,'#fff')}
  label(G.land?G.W*0.72:G.W/2,G.land?G.H*0.17:G.H*0.5,g.phase==='listen'?'Listen to Queen Marissa...':g.phase==='play'?'Now you sing it! Tap the shells.':'',24*s,'#fff6a0')};
 g.stars=()=>g.mist===0?3:g.mist<3?2:1;
 g.qa=()=>({phase:g.phase,want:g.phase==='play'?shell(ROUNDS[g.round][g.i]):null});return g};
