/* The mini-games, one per story beat. Every game always finishes (no game over); stars depend on how well you did.
   Visuals: painted backgrounds + sprites (GFX), Ashlin's jointed rig (drawAsh), particles and pops for feedback. */
const S=GFX,TAU=Math.PI*2;
function starsFrom(r){return r>=0.85?3:r>=0.5?2:1}
function yay(x,y,t,o={}){S.burst(x,y,{n:o.n||16,colors:o.colors,shape:o.shape||'spark',speed:o.speed||240,up:120});if(t)S.popText(x,y-24*G.s,t,o.col||'#fff6a0',o.size||30);Sound.fx(o.snd||'good')}
function oops(x,y,t){S.burst(x,y,{n:10,colors:['#d8d2e6','#b9b2cc'],shape:'puff',speed:90,g:-40,life:0.7});if(t)S.popText(x,y-24*G.s,t,'#ffd0d6',26);S.shake(7);Sound.fx('bad')}
function hint(t,txt,y,dur){const D=dur||4.5;if(t<D){cxa(Math.min(1,(D-t)*2));const L=txt.split('\n'),sz=Math.min(30*G.s,G.W/(L.length>1?17:18));L.forEach((l,i)=>S.txt(l,G.W/2,(y||G.H*0.17)+i*sz*1.2,sz,'#fff'));cxa(1)}}
function cxa(a){cx.globalAlpha=a}
const GAMES={};
/* ================= walk & run level (chapter 2 island as a child, chapter 5 palace as an adult) ================= */
GAMES.walk=cfg=>{const isl=cfg.bg==='island',v=cfg.v,hs0=v==='child'?0.92:1.1,HS=()=>hs0*(G.land?1.18:1);
 /* Controls (Peter's standard, same as Hair Mob): swipe & hold anywhere to walk (swipe farther = run), swipe up = jump,
    JUMP button bottom-right (hold = higher), ACTION button just up-left of it (say hi / pick up / shoo a rat). Keys: arrows/WASD, Shift run,
    Space/Up jump, X/E/Enter action. Gamepad: stick or d-pad, A jump, X/B action, stick pushed far or RB = run. */
 const g={axes:true,pad:true,t:0,done:false,got:0,met:0,bumps:0,hx:0.8,hy:0,vx:0,vy:0,flip:false,o:{},items:cfg.items.map(i=>({...i,got:false})),
  friends:(cfg.friends||[]).map(f=>({...f,met:false,mt:0})),movers:(cfg.movers||[]).map(m=>({...m,x:m.x0,d:1,ph:Math.random(),y:0,gone:0})),
  sagi:S.hopper(-0.2),tika:S.hopper(-1.2),azx:0.3,azy:0,max:cfg.items.length+(cfg.friends||[]).length,wasOn:true,
  coy:0,jbuf:0,jhold:false,onG:true,cam:0,camI:false,say:null};
 const ch=()=>G.ash[v],SR=()=>{const c=ch();return c.side?c.side.R:c.R};
 /* landscape: ground a bit higher so the JUMP / ACTION buttons sit below everyone's feet */
 function dims(){const U=G.land?G.H*0.34:Math.min(G.H*0.25,G.W*0.52);return{U,gy:G.land?G.H*0.78:G.H*0.8}}
 const ground=x=>{let h=0;for(const o of cfg.obst)if(Math.abs(x-o.x)<o.w/2+0.1)h=Math.max(h,o.h);return h};
 /* jump physics (world units = U): apex ~0.85 U in 0.36 s when held, short hop when tapped, heavier fall, coyote 0.1 s, buffer 0.14 s */
 const PH={gu:13.1,gd:17.5,cut:2.6,jv:4.72,coy:0.12,buf:0.14,vmax:9,acc:5.5,dec:7.5,air:3.2};
 g.jump=()=>{g.jbuf=PH.buf;g.tPress=g.t};
 const jumpHeld=()=>!!(G.keys.Space||G.keys.ArrowUp||G.keys.KeyW||G.pad.btn.a||G.pad.btn.up||PAD.jump||g.swUp);
 function near(x,r){return Math.abs(x-g.hx)<r}
 g.act=()=>{const{U,gy}=dims(),cam=g.cam;Sound.fx('tap');
  for(const f of g.friends)if(!f.met&&near(f.x,1.0)){f.met=true;f.mt=g.t;g.got++;yay(f.x*U-cam,gy-U,'Friend!',{shape:'heart',colors:['#ff7aa8','#ffb3cc']});return}
  for(const m of g.movers)if(!m.gone&&near(m.x,0.9)){m.gone=1;m.d=Math.sign(m.x-g.hx)||1;S.popText(m.x*U-cam,gy-U*0.4,'Shoo!','#fff6a0',26);Sound.fx('squeak');return}
  const reach=g.hy+hs0*0.95;for(const it of g.items)if(!it.got&&near(it.x,0.45)&&it.h<=reach+0.05&&it.h>=g.hy-0.1){collect(it);return}
  const who=isl?['Sagi: Hee hee!','Tika: Toot toot!']:['Sagi: This way, Ash!','Azul: Ooh, fancy!'];S.popText(g.hx*U-cam,gy-U*HS()*1.1,who[(g.t*2|0)%2],'#fff',22)};
 function collect(it){const{U,gy}=dims();it.got=true;g.got++;yay(it.x*U-g.cam,gy-it.h*U,'+1',{snd:'collect',colors:isl?['#ffd23f','#ffb03a','#fff']:['#ff8fb8','#fff','#ffd23f']})}
 g.key=c=>{if(c==='ArrowUp'||c==='KeyW'||c==='Space'){g.jump();return true}if(c==='KeyX'||c==='KeyE'||c==='KeyJ'){g.act();return true}return false};
 g.padBtn=n=>{if(n==='a'||n==='up'){g.jump();return true}if(n==='x'||n==='b'||n==='y'){g.act();return true}return false};
 g.btn=(k)=>{if(k==='jump')g.jump();else g.act()};
 /* swipe & hold: the anchor trails the finger (max 110 px), so sliding back the other way turns her right away */
 g.down=p=>{p.ax=p.x;p.ay=p.y;p.up=false};
 g.move=p=>{if(p.ax===undefined){p.ax=p.x;p.ay=p.y}const R=110*G.s,dx=p.x-p.ax;if(Math.abs(dx)>R)p.ax=p.x-Math.sign(dx)*R;
  const uy=p.ay-p.y;if(!p.up&&uy>42*G.s&&uy>Math.abs(p.x-p.sx)*1.1){p.up=true;g.jump();g.swUpId=p.id}if(p.ay-p.y>R)p.ay=p.y+R;if(p.y>p.ay)p.ay=p.y};
 g.up=p=>{if(g.swUpId===p.id)g.swUpId=null};
 g.update=dt=>{g.t+=dt;const{U,gy}=dims(),R=SR(),walkV=R.vw/R.ground*0.95*HS(),runV=R.vr/R.ground*1.05*HS();
  let dir=axisX(),run=runHeld();g.swUp=false;
  for(const p of G.ptr.values()){if(p.ax===undefined)continue;const dx=p.x-p.ax;if(g.swUpId===p.id)g.swUp=true;
   if(Math.abs(dx)>14*G.s){dir=Math.sign(dx);run=Math.abs(dx)>64*G.s}}
  if(Math.abs(dir)<0.2)dir=0;const tv=dir?Math.sign(dir)*(run?runV:walkV):0;
  /* ground: quick start, a short soft stop; air: she keeps her momentum and can steer a little */
  const a=g.onG?(tv&&Math.sign(tv)===Math.sign(g.vx||tv)?PH.acc:PH.dec):PH.air;g.vx+=clamp(tv-g.vx,-a*dt,a*dt);
  if(dir)g.flip=dir<0;else if(Math.abs(g.vx)>0.02)g.flip=g.vx<0;
  let nx=clamp(g.hx+g.vx*dt,0.3,cfg.len+0.5);if(g.hy<ground(nx)-0.02){nx=g.hx;g.vx=0}g.hx=nx;
  const gh0=ground(g.hx),wasG=g.onG;g.onG=g.hy<=gh0+0.001&&g.vy<=0;if(wasG&&!g.onG)g.tLeave=g.t;if(g.onG){g.hy=gh0;g.vy=0;g.coy=PH.coy}else g.coy-=dt;
  if(g.jbuf>0&&g.coy>0){g.vy=PH.jv;g.coy=0;g.jbuf=0;g.jhold=true;g.onG=false;Sound.fx('jump');S.burst(g.hx*U-g.cam,gy-g.hy*U,{n:8,colors:isl?['#d9b98a','#c9a36a']:['#fff','#e8e0d0'],shape:'puff',speed:80,g:-20,life:0.5})}
  g.jbuf=Math.max(0,g.jbuf-dt);if(!jumpHeld())g.jhold=false;
  if(!g.onG){const gr=g.vy>0?PH.gu*(g.jhold?1:PH.cut):PH.gd;g.vy=Math.max(-PH.vmax,g.vy-gr*dt);g.hy+=g.vy*dt;const gh=ground(g.hx);if(g.hy<=gh&&g.vy<=0){g.hy=gh;g.vy=0;g.onG=true;g.coy=PH.coy}}
  const on=g.onG;if(on&&!g.wasOn)S.burst(g.hx*U-g.cam,gy-g.hy*U,{n:6,colors:isl?['#d9b98a']:['#fff'],shape:'puff',speed:60,g:-10,life:0.4});g.wasOn=on;
  stepAsh(v,g.o,g.hx*U,U*HS(),g.flip,on);
  for(const it of g.items)if(!it.got&&Math.abs(it.x-g.hx)<0.28&&it.h>=g.hy-0.05&&it.h<=g.hy+hs0*0.78)collect(it);
  g.say=null;for(const f of g.friends)if(!f.met&&near(f.x,1.0))g.say=f;
  for(const m of g.movers){m.ph+=dt*(m.gone?4:2.2);const f=m.ph%1,air=f<0.62;if(air){m.x+=m.d*(m.gone?1.6:0.32/0.62)*dt;m.y=Math.sin(Math.PI*f/0.62)*0.07}else{m.y=0;if(!m.gone){if(m.x>m.x0+m.r)m.d=-1;else if(m.x<m.x0-m.r)m.d=1}}m.flip=m.d<0;if(m.gone)continue;
   if(Math.abs(m.x-g.hx)<0.25&&g.hy<0.14&&(!g.bt||g.t-g.bt>0.8)){g.bt=g.t;g.bumps++;g.vx=-Math.sign(m.x-g.hx||1)*0.9;g.vy=2.4;g.hy+=0.001;g.onG=false;g.coy=0;Sound.fx('squeak');oops(g.hx*U-g.cam,gy-U*0.5,'Eek! A rat!')}}
  /* friends follow in hops: they only move while in the air, so their feet never slide */
  const lead=g.hx,rate=1+clamp(Math.abs(g.vx)-0.5,0,1)*0.6;S.hopTo(g.sagi,lead-0.7,dt,0.5,rate);S.hopTo(g.tika,g.sagi.x-0.8,dt,0.62,rate);
  g.azx=lerp(g.azx,g.hx+(g.flip?-0.5:0.5),Math.min(1,dt*1.5));
  {const tc=clamp(g.hx*U-G.W*(g.flip?0.56:0.36),0,cfg.len*U+U-G.W);if(!g.camI){g.cam=tc;g.camI=true}else g.cam+=(tc-g.cam)*Math.min(1,dt*3.2)}
  hudInfo((isl?'Mangoes':'Flowers & friends')+' '+g.got+' / '+g.max);
  if(g.hx>=cfg.len){g.done=true}};
 /* painted far layer (slow), ground band that moves 1:1 with Ashlin's feet, foreground foliage (fast) */
 function back(U,gy,cam,t){const gv=isl?0.86:0.8,bh=gy/gv;S.strip(isl?'jungle':'palace',cam*0.4,0,bh);
  if(isl){const k=clamp((g.hx-(cfg.len-6))/5,0,1);if(k>0){cxa(k*0.9);S.strip('lagoon',cam*0.4,0,bh);cxa(1)}S.amb('rays',t,{x:0.2});S.amb('motes',t,{n:14})}
  else S.amb('motes',t,{n:12,c:'rgba(255,240,200,.6)'});
  const gr=cx.createLinearGradient(0,gy-10*G.s,0,G.H);if(isl){gr.addColorStop(0,'rgba(201,163,106,0)');gr.addColorStop(0.12,'#caa46c');gr.addColorStop(1,'#9c7a48')}else{gr.addColorStop(0,'rgba(236,228,214,0)');gr.addColorStop(0.12,'#e9e1d2');gr.addColorStop(1,'#c9bca4')}
  cx.fillStyle=gr;cx.fillRect(0,gy-10*G.s,G.W,G.H);
  /* ground details at exactly ground speed */
  const step=0.37*U,i0=Math.floor(cam/step);for(let i=i0;i<i0+G.W/step+2;i++){const x=i*step-cam,r=Math.abs(Math.sin(i*12.9898)*43758.5)%1;
   if(isl){cx.fillStyle='rgba(120,90,50,.35)';cx.beginPath();cx.ellipse(x,gy+(6+r*20)*G.s,(3+r*6)*G.s,(2+r*3)*G.s,0,0,7);cx.fill()}
   else{cx.strokeStyle='rgba(150,130,100,.35)';cx.lineWidth=2*G.s;cx.beginPath();cx.moveTo(x,gy+4*G.s);cx.lineTo(x-(G.H-gy)*0.5,G.H);cx.stroke()}}
  if(!isl){cx.strokeStyle='rgba(150,130,100,.3)';cx.lineWidth=2*G.s;for(let k=1;k<4;k++){const y=gy+(G.H-gy)*k/4;cx.beginPath();cx.moveTo(0,y);cx.lineTo(G.W,y);cx.stroke()}}}
 function front(U,gy,cam,t){const step=4.3*U,i0=Math.floor(cam*1.3/step);for(let i=i0-1;i<i0+G.W/step+2;i++){const x=i*step-cam*1.3;
  if(isl){S.fern(x,G.H+10*G.s,U*0.75,t,'rgba(18,58,28,.9)',i%2?1:-1)}else{cx.fillStyle='rgba(90,60,30,.35)';S.rr(x,0,U*0.25,G.H,6*G.s);cx.fill();cx.fillStyle='rgba(255,220,140,.25)';cx.fillRect(x+U*0.04,0,U*0.03,G.H)}}}
 g.draw=()=>{const{U,gy}=dims(),s=G.s,cam=g.cam||0,t=G.t;back(U,gy,cam,t);
  /* goal */
  const gx=cfg.len*U-cam+U*0.3;
  if(isl){S.spr('blanket',gx+U*0.2,gy+U*0.05,U*0.3);for(let i=0;i<4;i++)S.spr('mango',gx+U*(0.05+i*0.11),gy-U*0.02,U*0.13);S.txt('Picnic!',gx+U*0.2,gy-U*1.1,28*s,'#fff6a0');S.amb('sparkle',t,{n:0})}
  else{cx.save();cx.shadowColor='rgba(255,220,120,.9)';cx.shadowBlur=30*s;const dw=U*0.9,dh=U*1.55;cx.fillStyle='#f7e3a8';S.rr(gx-dw*0.1,gy-dh-U*0.1,dw*1.2,dh+U*0.1,dw*0.6);cx.fill();cx.restore();
   const dg=cx.createLinearGradient(gx,gy-dh,gx+dw,gy);dg.addColorStop(0,'#8a4a26');dg.addColorStop(1,'#5a2a14');cx.fillStyle=dg;S.rr(gx,gy-dh,dw,dh,dw*0.5);cx.fill();cx.strokeStyle='#e8c05a';cx.lineWidth=4*s;cx.stroke();
   cx.fillStyle='#ffd86a';cx.beginPath();cx.arc(gx+dw*0.8,gy-dh*0.45,6*s,0,7);cx.fill();S.txt('Ballroom',gx+dw/2,gy-dh-U*0.3,26*s,'#ffe9a0')}
  if(cfg.ariana){const ax=cfg.ariana*U-cam;if(ax>-U&&ax<G.W+U){S.actor('ariana',ax,gy,U*1.08,t,{face:'l'});if(Math.abs(cfg.ariana-g.hx)<2.2)S.bubble(ax,gy-U*1.15,'Hmph!')}}
  for(const o of cfg.obst){const x=o.x*U-cam;if(x<-U||x>G.W+U)continue;const n=o.kind==='log'?'log':o.kind==='rock'?'boulder':'cart',w=o.w*U*1.45,h=w*(S.IMG[n].naturalHeight||1)/(S.IMG[n].naturalWidth||1);
   S.shadow(x,gy,w*0.45);S.spr(n,x,gy+h*0.06,Math.max(h,o.h*U*1.25))}
  for(const it of g.items){if(it.got)continue;const x=it.x*U-cam,y=gy-it.h*U+Math.sin(t*2+it.x)*4*s;if(x<-50||x>G.W+50)continue;
   S.glowDot(x,y,0.16*U,'rgba(255,240,170,.55)');S.spr(isl?'mango':'flower',x,y,0.17*U,{center:1,rot:Math.sin(t*1.5+it.x)*0.15});const p=(t*0.7+it.x)%1;if(p<0.25){cx.fillStyle='rgba(255,255,255,'+(1-p*4)+')';S.star4(x+0.06*U,y-0.06*U,10*s*Math.sin(p*4*Math.PI))}}
  for(const f of g.friends){const x=f.x*U-cam;if(x<-U||x>G.W+U)continue;if(f.who==='tallulah')S.actor('tallulah',x,gy,U*0.42,t,{face:'l'});else S.actor(f.who,x,gy,U*0.98,t,{ph:f.x});
   if(f.met&&g.t-f.mt<2.4)S.bubble(x,gy-(f.who==='tallulah'?U*0.5:U*1.05),f.line)}
  for(const m of g.movers){const x=m.x*U-cam;if(x>-U&&x<G.W+U){S.shadow(x,gy,U*0.1);S.spr('rat',x,gy-m.y*U,U*0.2,{face:m.flip?'l':'r'})}}
  const hop=(o,n,h)=>{const x=o.x*U-cam,q=S.squash(o);S.shadow(x,gy,S.sprW(n,h)*0.4*(1-o.y));S.spr(n,x,gy-o.y*U,h,{face:o.face,sy:q,sx:2-q})};
  hop(g.tika,'tika',U*(v==='child'?0.5:0.46));hop(g.sagi,'sagi',U*0.3);
  S.spr('azul_fly',g.azx*U-cam,gy-U*1.25+Math.sin(t*1.6)*8*s,U*0.42,{center:1,face:g.flip?'l':'r',rot:Math.sin(t*1.6)*0.05});
  drawAsh(v,g.o,g.hx*U-cam,gy-g.hy*U,U*HS(),g.flip);
  front(U,gy,cam,t);S.drawParticles();
  if(g.say){const x=g.say.x*U-cam;S.bubble(x,gy-(g.say.who==='tallulah'?U*0.5:U*1.05),'Tap ACTION to say hi!')}
  hint(g.t,G.land?'Swipe & hold anywhere to walk (farther = run).\nJUMP and ACTION are bottom-right.':'Swipe & hold to walk\n(swipe farther = run).\nJUMP + ACTION bottom-right.',G.land?G.H*0.2:G.H*0.15,7)};
 g.stars=()=>starsFrom((g.got-g.bumps*0.5)/g.max);
 g.qa=()=>{const{U,gy}=dims();return{hx:g.hx,len:cfg.len,obst:cfg.obst,U,gy,cam:g.cam,hy:g.hy,vx:g.vx,o:{u:g.o._ku,a:g.o._ka,v:g.o._kv,D:g.o._kD,f:g.o._kf},
  hop:[g.sagi.x,g.sagi.ph,g.tika.x,g.tika.ph],onG:g.onG,vy:g.vy,flip:g.flip,side:!!g.o._side,gnd:ground(g.hx),fr:g.friends.filter(f=>!f.met).map(f=>f.x),mv:g.movers.filter(m=>!m.gone).map(m=>m.x),
  it:g.items.filter(i=>!i.got).map(i=>[i.x,i.h]),got:g.got,max:g.max,hs:HS(),hs0,tLeave:g.tLeave,tPress:g.tPress,t:g.t}};
 return g};
/* ================= chapter 1: find the clues on the beach ================= */
GAMES.find=()=>{const L=[['chest','the chest'],['banner','the purple banner'],['blanket','the blanket'],['lantern','the lantern'],['bottle','the bottle'],['rope','the rope']];
 const g={t:0,done:false,got:0,max:6,last:0,miss:0};
 const spots=()=>G.land?[[0.5,0.42],[0.86,0.5],[0.66,0.6],[0.92,0.8],[0.46,0.78],[0.72,0.86]]:[[0.2,0.36],[0.78,0.33],[0.5,0.45],[0.84,0.56],[0.2,0.58],[0.64,0.64]];
 g.items=L.map(([k,n],i)=>({k,n,i,got:false,ft:0,rot:(i%3-1)*0.25}));
 const pos=it=>{const p=spots()[it.i];return[p[0]*G.W,p[1]*G.H]};
 const isz=()=>Math.min(G.W,G.H)*(G.land?0.17:0.15);
 const slot=i=>{const w=Math.min(G.W-20*G.s,560*G.s),x0=(G.W-w)/2;return[x0+w*(i+0.5)/6,G.H-40*G.s]};
 g.down=p=>{let best=null,bd=1e9;for(const it of g.items){if(it.got)continue;const[x,y]=pos(it),d=Math.hypot(p.x-x,p.y-(y-isz()*0.4));if(d<bd){bd=d;best=it}}
  if(best&&bd<Math.max(56*G.s,isz()*0.8)){const[x,y]=pos(best);best.got=true;best.ft=g.t;g.got++;g.last=g.t;yay(x,y-isz()*0.4,'Found '+best.n+'!',{size:24});if(g.got>=g.max)setTimeout(()=>g.done=true,1100)}
  else{g.miss++;Sound.fx('tap');S.burst(p.x,p.y,{n:6,colors:['#e8d3a6','#fff'],shape:'puff',speed:60,g:-20,life:0.4})}};
 g.update=dt=>{g.t+=dt;hudInfo('Clues '+g.got+' / 6')};
 g.draw=()=>{const s=G.s,t=G.t,z=isz();S.bg('beach',{px:Math.sin(t*0.1)*6*s});S.amb('waves',t,{y0:G.land?0.4:0.18,y1:G.land?0.58:0.38,n:5});S.amb('birds',t,{y:0.08});S.amb('sparkle',t,{n:10,y0:0.6,yh:0.4});
  for(const it of g.items){const[x,y]=pos(it);if(it.got)continue;
   S.shadow(x,y,z*0.45,0.25);S.spr(it.k,x,y,z,{rot:it.rot});cx.fillStyle='rgba(232,206,150,.85)';cx.beginPath();cx.ellipse(x,y,z*0.5,z*0.12,0,0,7);cx.fill();
   const p=(t*0.45+it.i*0.37)%1;if(p<0.2){cx.fillStyle='rgba(255,255,255,'+(1-p*5)+')';S.star4(x+z*0.25,y-z*0.7,14*s*Math.sin(p*5*Math.PI))}
   if(g.t-g.last>8){cx.strokeStyle='rgba(255,255,255,'+(0.5+0.4*Math.sin(t*5))+')';cx.lineWidth=4*s;cx.beginPath();cx.arc(x,y-z*0.4,z*0.75+6*s*Math.sin(t*4),0,TAU);cx.stroke()}}
  const bx=G.land?G.W*0.17:G.W*0.5,by=G.land?G.H*0.9:G.H*0.84,hh=G.land?G.H*0.4:G.H*0.17;
  S.actor('sagi',bx-hh*0.62,by,hh*0.36,t,{face:'r'});S.actor('azul_stand',bx+hh*0.6,by,hh*0.62,t,{face:'l'});drawAsh('child',{},bx,by,hh,false);
  /* tray of found clues */
  const w=Math.min(G.W-20*s,560*s),x0=(G.W-w)/2;S.panel(x0,G.H-74*s,w,64*s,20*s,'rgba(255,248,232,.92)');
  g.items.forEach((it,i)=>{const[x,y]=slot(i);if(it.got){const k=Math.min(1,(g.t-it.ft)/0.7),e=S.E.inOut(k),[sx,sy]=pos(it);
    const px=lerp(sx,x,e),py=lerp(sy-z*0.4,y,e)-Math.sin(k*Math.PI)*80*s,sc=lerp(z,46*s,e)*(k>=1?1:1+0.3*Math.sin(k*Math.PI));S.spr(it.k,px,py,sc,{center:1})}
   else{cxa(0.25);S.spr(it.k,x,y,40*s,{center:1});cxa(1)}});
  S.drawParticles();hint(g.t,'Tap the clues in the sand!',G.H*(G.land?0.1:0.12))};
 g.stars=()=>g.miss<6?3:g.miss<14?2:1;
 g.qa=()=>({targets:g.items.filter(i=>!i.got).map(it=>{const[x,y]=pos(it);return[x,y-isz()*0.4]})});return g};
/* ================= chapter 3: calm the crocodiles ================= */
GAMES.crocs=()=>{const g={t:0,done:false,calm:0,need:10,hearts:3,crocs:[],next:1.2,spawned:0,lastBit:-9};
 const ant=()=>{const m=S.mapOf('lagoon');return m?S.at(m,G.land?0.61:0.5,G.land?0.6:0.675):[G.W*0.5,G.H*0.6]};
 const band=()=>G.land?[0.66,0.88]:[0.6,0.84];
 g.down=p=>{let best=null,bd=1e9;for(const c of g.crocs){if(c.calm)continue;const d=Math.hypot(p.x-c.x,p.y-c.y);if(d<bd){bd=d;best=c}}
  if(best&&bd<75*G.s){best.calm=true;best.ct=g.t;g.calm++;yay(best.x,best.y-30*G.s,'Calm!',{shape:'heart',colors:['#ff7aa8','#ffb3cc','#fff']});if(g.calm>=g.need)setTimeout(()=>g.done=true,1100)}
  else{Sound.fx('tap');S.burst(p.x,p.y,{n:6,colors:['#bff4ff','#fff'],shape:'drop',speed:90,life:0.4})}};
 g.update=dt=>{g.t+=dt;const[ax,ay]=ant(),s=G.s,[b0,b1]=band();g.next-=dt;
  if(g.next<=0&&g.crocs.filter(c=>!c.calm).length<3&&g.calm+g.crocs.filter(c=>!c.calm).length<g.need){const L=Math.random()<0.5;g.crocs.push({x:L?-70*s:G.W+70*s,y:rnd(G.H*b0,G.H*b1),v:(38+g.spawned*2.5)*s,calm:false,ph:Math.random()*6});g.spawned++;g.next=Math.max(0.9,1.9-g.spawned*0.07)}
  for(const c of g.crocs){c.ph+=dt;if(c.calm){const d=Math.sign(c.x-ax)||1;c.x+=d*90*s*dt;c.fl=d<0;continue}const dx=ax-c.x,dy=ay-c.y,d=Math.hypot(dx,dy);c.fl=dx<0;
   if(d<62*s){c.calm=true;c.ct=g.t;c.bit=true;g.lastBit=g.t;g.hearts=Math.max(0,g.hearts-1);Sound.fx('splash');S.burst(ax,ay,{n:26,colors:['#e8fbff','#9fe6ff','#fff'],shape:'drop',speed:300,up:200,life:0.9});S.shake(10);S.popText(ax,ay-80*s,'Splash!','#bfefff',30)}
   else{c.x+=dx/d*c.v*dt;c.y+=dy/d*c.v*dt}}
  g.crocs=g.crocs.filter(c=>!(c.calm&&(c.x<-140*s||c.x>G.W+140*s)));hudInfo('Calm '+g.calm+'/'+g.need+'  '+'\u2665'.repeat(g.hearts)+'\u2661'.repeat(3-g.hearts))};
 g.draw=()=>{const s=G.s,t=G.t,[ax,ay]=ant();S.bg('lagoon');S.amb('waves',t,{y0:band()[0]-0.05,y1:band()[1]+0.05,n:6});S.amb('motes',t,{n:10});S.amb('birds',t,{y:0.1,n:2});
  const ah=G.land?G.H*0.3:G.H*0.15,wet=g.t-g.lastBit<1.2;S.actor('antonio',ax,ay,ah,t,{face:'l',rot:wet?Math.sin(t*30)*0.03:0});if(wet)S.bubble(ax,ay-ah*1.02,'Whoa!');
  for(const c of g.crocs){const w=110*s,h=w*0.42;cx.save();cx.beginPath();cx.rect(c.x-w,c.y-h*2,w*2,h*2+4*s);cx.clip();
    S.spr('croc',c.x,c.y+h*0.45+Math.sin(c.ph*3)*2*s,h*1.1,{face:c.fl?'l':'r',rot:Math.sin(c.ph*4)*0.03});cx.restore();
    cx.strokeStyle='rgba(255,255,255,.55)';cx.lineWidth=2*s;for(let k=0;k<2;k++){const p=(c.ph*0.8+k*0.5)%1;cx.globalAlpha=1-p;cx.beginPath();cx.ellipse(c.x,c.y+4*s,w*0.5+p*30*s,6*s+p*6*s,0,0,TAU);cx.stroke()}cx.globalAlpha=1;
    if(c.calm&&!c.bit){cx.fillStyle='#ff7aa8';S.heart(c.x,c.y-h*1.3-((g.t-c.ct)*30*s),10*s)}}
  const bx=G.land?G.W*0.12:G.W*0.16,by=G.H*0.985,bh=G.H*(G.land?0.34:0.14);S.actor('tika',bx+bh*0.75,by,bh*0.42,t,{face:'r'});S.actor('sagi',bx+bh*1.2,by,bh*0.26,t,{face:'r'});drawAsh('adult',{},bx,by,bh,false);
  S.drawParticles();hint(g.t,'Tap the crocodiles to calm them!')};
 g.stars=()=>g.hearts>=3?3:g.hearts>=2?2:1;
 g.qa=()=>({targets:g.crocs.filter(c=>!c.calm).map(c=>[c.x,c.y])});return g};
/* ================= chapter 4: sail to Apollonia ================= */
GAMES.voyage=()=>{const g={axes:true,t:0,done:false,dur:40,x:0.5,tx:0.5,got:0,hits:0,obj:[],next:0.5,inv:0,n:0,scroll:0,jumps:[]};
 g.down=p=>{g.tx=clamp(p.x/G.W,0.08,0.92)};g.move=p=>{g.tx=clamp(p.x/G.W,0.08,0.92)};
 g.update=dt=>{g.t+=dt;const s=G.s,ax=axisX();if(ax)g.tx=clamp(g.x+ax*0.25,0.08,0.92);g.x+=clamp(g.tx-g.x,-1.1*dt,1.1*dt);g.inv=Math.max(0,g.inv-dt);g.scroll+=0.26*G.H*dt;
  g.next-=dt;if(g.next<=0&&g.t<g.dur-2){g.n++;const k=g.n%3===0?'rock':'star';g.obj.push({k,x:rnd(0.1,0.9),y:-0.08,r:Math.random()*6});g.next=rnd(0.55,0.9)}
  if(Math.random()<dt*0.35)g.jumps.push({x:Math.random()<0.5?0.1:0.9,y:rnd(0.25,0.6),t:0});g.jumps=g.jumps.filter(j=>(j.t+=dt)<1.2);
  const sx=g.x*G.W,sy=G.H*0.8;if(Math.random()<dt*20)S.burst(sx+rnd(-10,10)*s,sy+60*s,{n:1,colors:['rgba(255,255,255,.8)'],shape:'dot',speed:30,g:0.26*G.H/s,life:0.9,size:9});
  const sp=0.26;for(const o of g.obj){o.y+=sp*dt;o.r+=dt;const dx=(o.x-g.x)*G.W,dy=(o.y-0.8)*G.H;if(!o.hit&&Math.hypot(dx,dy)<(o.k==='rock'?48:46)*s){o.hit=true;
   if(o.k==='star'){g.got++;yay(o.x*G.W,o.y*G.H,'+1',{snd:'collect',colors:['#ffd23f','#fff6a0','#fff']})}else if(!g.inv){g.hits++;g.inv=1.2;oops(o.x*G.W,o.y*G.H,'Bump!')}}}
  g.obj=g.obj.filter(o=>o.y<1.1&&!(o.hit&&o.k==='star'));hudInfo('\u2605 '+g.got+'   '+Math.max(0,Math.ceil(g.dur-g.t))+'s');if(g.t>=g.dur)g.done=true};
 g.draw=()=>{const s=G.s,t=G.t;S.stripV('ocean_top',g.scroll);
  if(g.t>g.dur-7){const p=S.E.out(clamp((g.t-(g.dur-7))/6,0,1)),y=-G.H*0.3+p*G.H*0.42;const gr=cx.createLinearGradient(0,y-G.H*0.2,0,y+30*s);gr.addColorStop(0,'#f3dca0');gr.addColorStop(0.8,'#ead08a');gr.addColorStop(1,'rgba(255,255,255,.0)');
   cx.fillStyle=gr;cx.fillRect(0,y-G.H*0.4,G.W,G.H*0.4+30*s);for(let i=0;i<6;i++)S.fern(G.W*(i/5),y-G.H*0.05,70*s,t,'rgba(40,110,60,.95)',i%2?1:-1);S.txt('Apollonia!',G.W/2,y-G.H*0.12,34*s,'#fff6a0')}
  for(const j of g.jumps){const p=j.t/1.2,x=j.x*G.W+(j.x<0.5?1:-1)*p*90*s,y=j.y*G.H-Math.sin(p*Math.PI)*50*s;S.spr('dolphin',x,y,70*s,{center:1,face:j.x<0.5?'r':'l',rot:(p-0.5)*1.2*(j.x<0.5?1:-1)});if(p>0.85)S.burst(x,y,{n:2,colors:['#fff'],shape:'drop',speed:80,life:0.4})}
  for(const o of g.obj){const x=o.x*G.W,y=o.y*G.H;if(o.k==='star'){S.glowDot(x,y,38*s,'rgba(255,230,120,.6)');S.spr('star',x,y,46*s,{center:1,rot:Math.sin(o.r*2)*0.3})}
   else{cx.strokeStyle='rgba(255,255,255,.6)';cx.lineWidth=3*s;cx.beginPath();cx.ellipse(x,y+8*s,46*s+Math.sin(o.r*4)*3*s,20*s,0,0,TAU);cx.stroke();S.spr('rock',x,y+14*s,58*s)}}
  const x=g.x*G.W,y=G.H*0.8;if(g.inv>0&&Math.floor(g.t*10)%2)cxa(0.5);S.spr('ship',x,y,150*s,{center:1,rot:(g.tx-g.x)*0.5});cxa(1);
  S.drawParticles();hint(g.t,'Drag to steer. Catch the stars!')};
 g.stars=()=>starsFrom((g.got-g.hits*2)/Math.max(1,Math.floor(g.n*2/3)));
 g.qa=()=>({x:g.x,obj:g.obj});return g};
/* ================= chapter 6: dance at the ball (rhythm) ================= */
GAMES.ball=()=>{const tr=Sound.track('waltz'),mel=tr.parts[0].tok,sd=60/tr.bpm/tr.div,notes=[];
 for(let loop=0;loop<2;loop++)mel.forEach((tk,i)=>{if(tk==='.'||tk==='-')return;const f=Sound.hz(tk);notes.push({t:2.0+(loop*mel.length+i)*sd,lane:f<760?0:f<1000?1:2,st:0})});
 const g={t:0,done:false,notes,hit:0,perfect:0,miss:0,combo:0,fall:1.7,lastNow:0,started:false,ring:[0,0,0]};
 const now=()=>g.started?Sound.time()-g.t0:0;
 const lanes=()=>G.land?{x0:G.W*0.42,w:G.W*0.54/3,hy:G.H*0.84,top:G.H*0.08}:{x0:G.W*0.06,w:G.W*0.88/3,hy:G.H*0.85,top:G.H*0.44};
 const COL=['#ff8fb8','#ffd23f','#7fd3ff'];
 function hitLane(l){const n=now(),L=lanes(),x=L.x0+L.w*(l+0.5);g.ring[l]=g.t;let best=null,bd=9;for(const o of g.notes){if(o.st||o.lane!==l)continue;const d=Math.abs(o.t-n);if(d<bd){bd=d;best=o}}
  if(best&&bd<0.2){best.st=1;g.hit++;g.combo++;const p=bd<0.09;if(p)g.perfect++;S.burst(x,L.hy,{n:p?18:10,colors:[COL[l],'#fff'],shape:p?'heart':'spark',speed:220,up:100});S.popText(x,L.hy-60*G.s,p?'Perfect!':'Good!',p?'#fff6a0':'#ffffff',26);Sound.fx('tap')}
  else{g.combo=0}}
 g.down=p=>{const L=lanes();hitLane(clamp(Math.floor((p.x-L.x0)/L.w),0,2))};
 g.key=c=>{const m={ArrowLeft:0,KeyA:0,KeyJ:0,ArrowDown:1,KeyS:1,KeyK:1,ArrowUp:1,ArrowRight:2,KeyD:2,KeyL:2}[c];if(m===undefined)return false;hitLane(m);return true};
 g.padBtn=n=>{const m={left:0,x:0,down:1,a:1,up:1,y:1,right:2,b:2}[n];if(m===undefined)return false;hitLane(m);return true};
 g.act=()=>hitLane(1);
 g.update=dt=>{if(!g.started){g.started=true;Sound.stop();Sound.play('waltz');const i=Sound.info();g.t0=i?i.t0:Sound.time()}
  g.t+=dt;const n=now();if(Sound.time()===0){g.t0=(g.t0||0)-dt}
  const pn=performance.now();if(g.lastNow&&pn-g.lastNow>400){for(const o of g.notes)if(!o.st&&o.t<n+0.3)o.st=3}g.lastNow=pn;
  for(const o of g.notes)if(!o.st&&n>o.t+0.22){o.st=2;g.miss++;g.combo=0}
  hudInfo('\u266A '+g.hit+' / '+g.notes.length+(g.combo>2?'   Combo '+g.combo:''));if(n>g.notes[g.notes.length-1].t+1.5)g.done=true};
 g.draw=()=>{const s=G.s,t=G.t,n=now(),L=lanes();S.bg('ballroom');S.amb('sparkle',t,{n:18,yh:0.5});S.amb('petals',t,{n:10});
  const sw=Math.sin(n/(sd*3)*Math.PI)*0.07,cxp=G.land?G.W*0.21:G.W*0.5,cy=G.land?G.H*0.93:G.H*0.4,hh=G.land?G.H*0.62:G.H*0.25;
  S.glowDot(cxp,cy-hh*0.5,hh*0.9,'rgba(255,230,200,.45)');S.shadow(cxp,cy,hh*0.4);
  cx.save();cx.translate(cxp,cy);cx.rotate(sw);drawAsh('adult',{},-hh*0.17,0,hh,false,{noShadow:1});S.spr('antonio',hh*0.2,0,hh*1.04,{face:'l'});cx.restore();
  for(let l=0;l<3;l++){const x=L.x0+L.w*l,gr=cx.createLinearGradient(0,L.top,0,L.hy+40*s);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(255,240,250,.28)');cx.fillStyle=gr;S.rr(x+6*s,L.top,L.w-12*s,L.hy-L.top+40*s,16*s);cx.fill()}
  for(let l=0;l<3;l++){const x=L.x0+L.w*(l+0.5),k=Math.max(0,1-(g.t-g.ring[l])/0.25);S.glowDot(x,L.hy,(46+k*20)*s,'rgba(255,255,255,'+(0.25+k*0.4)+')');
   cx.strokeStyle=COL[l];cx.lineWidth=6*s;cx.beginPath();cx.arc(x,L.hy,(32+k*6)*s,0,TAU);cx.stroke();cx.strokeStyle='#fff';cx.lineWidth=2*s;cx.stroke()}
  for(const o of g.notes){if(o.st)continue;const p=1-(o.t-n)/g.fall;if(p<0||p>1.2)continue;const y=L.top+(L.hy-L.top)*p,x=L.x0+L.w*(o.lane+0.5),r=(18+6*p)*s;
   S.glowDot(x,y,r*2,'rgba(255,255,255,.35)');cx.save();cx.shadowColor=COL[o.lane];cx.shadowBlur=14*s;cx.fillStyle=COL[o.lane];S.heart(x,y,r);cx.restore();cx.fillStyle='rgba(255,255,255,.7)';cx.beginPath();cx.ellipse(x-r*0.35,y-r*0.3,r*0.22,r*0.14,-0.6,0,TAU);cx.fill()}
  if(g.combo>4)S.txt('Combo '+g.combo+'!',L.x0+L.w*1.5,L.top-18*s+(G.land?40*s:0),24*s,'#fff6a0');
  S.drawParticles();if(n<2.5)S.txt('Tap the hearts on the rings!',G.land?L.x0+L.w*1.5:G.W/2,G.H*(G.land?0.18:0.1),24*s,'#fff')};
 g.stars=()=>starsFrom(g.hit/g.notes.length);
 g.qa=()=>({now:now(),notes:g.notes,lanes:lanes()});return g};
/* ================= chapter 7: stop Ariana's rats ================= */
GAMES.rats=()=>{const g={t:0,done:false,stop:0,bad:0,total:18,spawned:0,rats:[],next:1.0,sleepy:[0,0,0]};
 const spot=i=>[G.W*(0.12+i*0.19),G.H*(G.land?0.5:0.52)],bowl=i=>[G.W*(0.2+i*0.3),G.H*(G.land?0.84:0.8)];
 g.down=p=>{let best=null,bd=1e9;for(const r of g.rats){if(r.st)continue;const d=Math.hypot(p.x-r.x,p.y-(r.y-14*G.s));if(d<bd){bd=d;best=r}}
  if(best&&bd<64*G.s){best.st=1;best.spin=0;g.stop++;Sound.fx('squeak');S.burst(best.x,best.y-14*G.s,{n:12,colors:['#e9e4f2','#fff'],shape:'puff',speed:120,g:-30,life:0.6});S.popText(best.x,best.y-50*G.s,'Shoo!','#fff6a0',28)}else Sound.fx('tap')};
 g.update=dt=>{g.t+=dt;g.next-=dt;const s=G.s;
  if(g.next<=0&&g.spawned<g.total&&g.rats.filter(r=>!r.st).length<3){const i=Math.floor(rnd(0,5)),b=Math.floor(rnd(0,3)),[x,y]=spot(i);g.rats.push({x,y,b,st:0,ph:0,hy:0,v:(70+g.spawned*3)*s,face:'r'});g.spawned++;g.next=Math.max(0.8,1.8-g.spawned*0.05)}
  for(const r of g.rats){let tx,ty;if(r.st===1){tx=r.x+(r.x<G.W/2?-1:1)*400*s;ty=-80*s;r.spin=(r.spin||0)+dt*12}else if(r.st===2){tx=r.x;ty=G.H+100*s}else{[tx,ty]=bowl(r.b)}
   const dx=tx-r.x,dy=ty-r.y,d=Math.hypot(dx,dy);
   if(r.st){const v=r.v*2.4;if(d>1){const m=Math.min(d,v*dt);r.x+=dx/d*m;r.y+=dy/d*m}}
   else{/* hops: moves only while airborne */r.ph+=dt*2.6;const f=r.ph%1;if(f<0.7&&d>1){const m=Math.min(d,r.v/0.7*dt);r.x+=dx/d*m;r.y+=dy/d*m;r.hy=Math.sin(Math.PI*f/0.7)*14*s}else r.hy=0;r.face=dx<0?'l':'r'}
   if(!r.st&&d<14*s){r.st=2;g.bad++;g.sleepy[r.b]=g.t;Sound.fx('bad');S.burst(r.x,r.y,{n:16,colors:['#ff9a3a','#ffc06a'],shape:'puff',speed:90,g:-40,life:0.9});S.popText(r.x,r.y-50*s,'Oh no, the herb!','#ffd0a0',24)}}
  g.rats=g.rats.filter(r=>r.y>-60*s&&r.y<G.H+60*s);hudInfo('Stopped '+g.stop+' / '+g.total);if(g.spawned>=g.total&&!g.rats.some(r=>!r.st))g.done=true};
 g.draw=()=>{const s=G.s,t=G.t;S.bg('courtyard');S.amb('motes',t,{n:10});S.amb('birds',t,{y:0.06,n:2});
  for(let i=0;i<5;i++){const[x,y]=spot(i);cx.fillStyle='rgba(40,25,10,.55)';cx.beginPath();cx.ellipse(x,y,22*s,9*s,0,0,TAU);cx.fill()}
  const who=['azul_stand','tallulah','sagi'],hh=[78,60,46];
  for(let i=0;i<3;i++){const[x,y]=bowl(i);S.shadow(x,y+10*s,46*s);S.spr('bowl',x,y+16*s,52*s);cx.fillStyle='#e9a84a';cx.beginPath();cx.ellipse(x,y-14*s,36*s,8*s,0,0,TAU);cx.fill();
   for(let k=0;k<6;k++){cx.fillStyle=['#ff6a5a','#ffd23f','#7fd36a'][k%3];cx.beginPath();cx.arc(x-24*s+k*10*s,y-16*s+(k%2)*3*s,4*s,0,TAU);cx.fill()}
   const sl=g.sleepy[i]&&g.t-g.sleepy[i]<3;S.actor(who[i],x+52*s,y+14*s,hh[i]*s*(G.land?1.1:1),t,{face:'l',rot:sl?-0.25:0,ph:i});if(sl)S.amb('zzz',t,{x:x+60*s,y:y-hh[i]*s})}
  for(const r of g.rats){S.shadow(r.x,r.y,16*s,0.22);S.spr('rat',r.x,r.y-r.hy,50*s,{face:r.st===1?(r.x<G.W/2?'l':'r'):r.face,rot:r.st===1?r.spin:0})}
  S.actor('ariana',G.land?G.W*0.94:G.W*0.88,G.H*(G.land?0.56:0.5),G.H*(G.land?0.36:0.19),t,{face:'l'});
  S.drawParticles();hint(g.t,'Tap the rats before they reach the bowls!')};
 g.stars=()=>starsFrom(g.stop/g.total);g.qa=()=>({targets:g.rats.filter(r=>!r.st).map(r=>[r.x,r.y-14*G.s])});return g};
/* ================= chapter 8: ride the dolphins home ================= */
GAMES.dolphins=()=>{const g={axes:true,t:0,done:false,dur:38,lane:1,ly:1,got:0,hits:0,obj:[],next:0.8,inv:0,n:0,lastAy:0,sc:0};
 const laneY=l=>G.H*(G.land?[0.48,0.66,0.84]:[0.52,0.66,0.8])[l];
 const mv=d=>{const nl=clamp(g.lane+d,0,2);if(nl!==g.lane){g.lane=nl;Sound.fx('whoosh');S.burst(G.W*0.28,laneY(nl)+10*G.s,{n:12,colors:['#fff','#bff4ff'],shape:'drop',speed:200,up:150,life:0.6})}};
 g.up=p=>{if(p.swipe==='up')mv(-1);else if(p.swipe==='down')mv(1);else if(p.tap)mv(p.y<laneY(g.lane)-20*G.s?-1:p.y>laneY(g.lane)+20*G.s?1:0)};
 g.key=c=>{if(c==='ArrowUp'||c==='KeyW'){mv(-1);return true}if(c==='ArrowDown'||c==='KeyS'){mv(1);return true}return false};
 g.padBtn=n=>{if(n==='up'){mv(-1);return true}if(n==='down'){mv(1);return true}return false};
 g.update=dt=>{g.t+=dt;g.sc+=dt;const s=G.s;const ay=G.pad.ay;if(Math.abs(ay)>0.6&&Math.abs(g.lastAy)<=0.6)mv(Math.sign(ay));g.lastAy=ay;g.ly+=clamp(g.lane-g.ly,-6*dt,6*dt);g.inv=Math.max(0,g.inv-dt);
  g.next-=dt;if(g.next<=0&&g.t<g.dur-2){g.n++;g.obj.push({k:g.n%3===0?'rock':'shell',l:Math.floor(rnd(0,3)),x:1.08,ph:Math.random()*6});g.next=rnd(0.6,0.95)}
  const y=laneY(0)+(laneY(2)-laneY(0))*g.ly/2;if(Math.random()<dt*25)S.burst(G.W*0.2,y+16*s,{n:1,colors:['#fff'],shape:'drop',speed:120,dir:Math.PI*1.1,spread:0.5,life:0.5,size:6});
  for(const o of g.obj){o.x-=0.33*dt*(G.land?0.8:1);o.ph+=dt;if(!o.hit&&Math.abs(o.x*G.W-G.W*0.28)<38*s&&o.l===g.lane){o.hit=true;
   if(o.k==='shell'){g.got++;yay(o.x*G.W,laneY(o.l),'+1',{snd:'collect',colors:['#ffb6c8','#fff','#ffd23f']})}else if(!g.inv){g.hits++;g.inv=1.2;oops(o.x*G.W,laneY(o.l),'Bump!')}}}
  g.obj=g.obj.filter(o=>o.x>-0.1&&!(o.hit&&o.k==='shell'));hudInfo('Shells '+g.got+'   '+Math.max(0,Math.ceil(g.dur-g.t))+'s');if(g.t>=g.dur)g.done=true};
 function waveBand(y,amp,col,spd,t){cx.fillStyle=col;cx.beginPath();cx.moveTo(0,G.H);for(let x=0;x<=G.W+10;x+=10*G.s)cx.lineTo(x,y+Math.sin((x/G.s)*0.018+t*spd)*amp*G.s+Math.sin((x/G.s)*0.041-t*spd*1.3)*amp*0.4*G.s);cx.lineTo(G.W,G.H);cx.closePath();cx.fill()}
 g.draw=()=>{const s=G.s,t=G.t;S.bg('sea_sunset',{fy:G.land?0.3:0.5});S.amb('birds',t,{y:0.08,n:3,c:'rgba(90,50,90,.7)'});
  if(g.t>g.dur-10){const p=S.E.out(clamp((g.t-(g.dur-10))/8,0,1));const m=S.mapOf('kingdom');if(m){cxa(p);const w=G.W*0.5,h=w*m.h/m.w;cx.save();cx.beginPath();cx.rect(0,0,G.W,G.H*(G.land?0.42:0.47));cx.clip();cx.drawImage(m.im,G.W*(1.05-p*0.5),G.H*(G.land?0.42:0.47)-h*0.75,w,h);cx.restore();cxa(1)}}
  waveBand(laneY(0)-30*s,6,'rgba(120,90,200,.25)',1.2,t*2);
  for(let L=0;L<3;L++){const Y=laneY(L);for(const o of g.obj){if(o.l!==L)continue;const x=o.x*G.W,y=Y+Math.sin(o.ph*3)*4*s;
    if(o.k==='shell'){S.glowDot(x,y-6*s,30*s,'rgba(255,220,240,.6)');S.spr('shell',x,y,40*s,{center:1})}else{S.spr('rock',x,y+16*s,62*s);cx.strokeStyle='rgba(255,255,255,.6)';cx.lineWidth=3*s;cx.beginPath();cx.ellipse(x,y+12*s,40*s,9*s,0,0,TAU);cx.stroke()}}
   waveBand(Y+18*s,5,['rgba(70,170,200,.45)','rgba(80,140,200,.5)','rgba(90,110,190,.6)'][L],1.6+L*0.3,t*(2+L))}
  const x=G.W*0.28,y=laneY(0)+(laneY(2)-laneY(0))*g.ly/2,bob=Math.sin(t*5)*4*s,dh=G.land?G.H*0.17:G.H*0.085;
  const ty=laneY((g.lane+1)%3);S.spr('dolphin',G.W*0.1,ty+dh*0.25,dh*1.2,{center:1,rot:0.75});S.spr('tika',G.W*0.1,ty-dh*0.05,dh*0.62);
  if(g.inv>0&&Math.floor(g.t*10)%2)cxa(0.5);S.spr('dolphin',x,y+bob+dh*0.25,dh*1.4,{center:1,rot:0.75});
  drawAsh('adult',{},x+4*s,y+bob-dh*0.12,G.H*(G.land?0.24:0.12),false,{noShadow:1});S.spr('sagi',x-dh*0.62,y+bob-dh*0.08,dh*0.42);cxa(1);
  S.drawParticles();hint(g.t,'Swipe up or down. Catch the shells!',G.H*0.14)};
 g.stars=()=>starsFrom((g.got-g.hits*2)/Math.max(1,Math.floor(g.n*2/3)));g.qa=()=>({lane:g.lane,obj:g.obj,laneY:[0,1,2].map(laneY)});return g};
/* ================= chapter 9: make the antidote ================= */
GAMES.antidote=()=>{const ING=[{k:'lily',n:'Moon Lily',c:'#f4f4ff'},{k:'mint',n:'Sea Mint',c:'#5fd08a'},{k:'root',n:'Golden Root',c:'#f0b030'},{k:'petal',n:'Rainbow Petal',c:'#ff8fb8'},{k:'sunset',n:'Sunset Herb',c:'#ff6a2a',bad:'That is the sleeping herb!'},{k:'thorn',n:'Thorn Weed',c:'#8d92a6',bad:'Not that one!'}];
 const order=[0,1,2,3].sort(()=>Math.random()-0.5),shelf=[0,1,2,3,4,5].sort(()=>Math.random()-0.5);
 const g={t:0,done:false,step:0,wrong:0,phase:'add',stir:0,drag:null,fly:[],ang:0,mix:[],shk:{}};
 const potPos=i=>G.land?[G.W*(0.09+(i%3)*0.145),G.H*(0.36+Math.floor(i/3)*0.36)]:[G.W*(0.2+(i%3)*0.3),G.H*(0.2+Math.floor(i/3)*0.15)];
 const bowlPos=()=>G.land?[G.W*0.66,G.H*0.72]:[G.W*0.5,G.H*0.76];
 function add(slot){if(g.phase!=='add')return;const ing=ING[shelf[slot]],[bx,by]=bowlPos();if(shelf[slot]===order[g.step]){g.step++;g.mix.push(ing.c);g.fly.push({slot,t:g.t});Sound.fx('good');
   setTimeout(()=>{S.burst(bx,by-10*G.s,{n:16,colors:[ing.c,'#fff'],shape:'drop',speed:200,up:200});S.popText(bx,by-70*G.s,ing.n+'!','#fff6a0',26)},450);
   if(g.step>=4){g.phase='stir';setTimeout(()=>S.popText(bx,by-110*G.s,'Now stir in circles!','#ffffff',28),900)}}
  else{g.wrong++;g.shk[slot]=g.t;const[x,y]=potPos(slot);oops(x,y-30*G.s,ing.bad||'Not that one!')}}
 function potAt(p){for(let i=0;i<6;i++){const[x,y]=potPos(i);if(Math.hypot(p.x-x,p.y-(y-14*G.s))<54*G.s)return i}return -1}
 g.down=p=>{if(g.phase==='add'){const i=potAt(p);if(i>=0)g.drag={i,x:p.x,y:p.y,sx:p.x,sy:p.y}}else if(g.phase==='stir'){const[bx,by]=bowlPos();g.pa=Math.atan2(p.y-by,p.x-bx)}};
 g.move=p=>{if(g.drag){g.drag.x=p.x;g.drag.y=p.y}else if(g.phase==='stir'&&g.pa!==undefined){const[bx,by]=bowlPos(),a=Math.atan2(p.y-by,p.x-bx);let d=a-g.pa;d=Math.atan2(Math.sin(d),Math.cos(d));g.pa=a;stirBy(Math.abs(d))}};
 g.up=p=>{if(g.drag){const d=g.drag,[bx,by]=bowlPos();g.drag=null;if(p.tap||Math.hypot(p.x-bx,p.y-by)<100*G.s)add(d.i)}g.pa=undefined};
 g.key=c=>{const m=/^Digit([1-6])$/.exec(c);if(m){add(+m[1]-1);return true}return false};
 function stirBy(a){if(g.phase!=='stir')return;const before=Math.floor(g.stir/TAU);g.stir+=a;g.ang+=a;const[bx,by]=bowlPos();
  if(Math.random()<a*2)S.burst(bx+rnd(-40,40)*G.s,by-14*G.s,{n:1,colors:['rgba(255,255,255,.8)'],shape:'dot',speed:30,g:-60,life:0.8,size:8});
  if(Math.floor(g.stir/TAU)>before){Sound.fx('stir');S.popText(bx,by-90*G.s,Math.floor(g.stir/TAU)+'!','#fff6a0',30)}
  if(g.stir>=TAU*3){g.phase='done';Sound.fx('star');S.burst(bx,by-20*G.s,{n:40,colors:['#b9f5ff','#fff','#ffd23f'],speed:320,up:200,life:1.2});S.popText(bx,by-120*G.s,'The antidote is ready!','#ffffff',28);setTimeout(()=>g.done=true,1600)}}
 g.update=dt=>{g.t+=dt;if(g.phase==='stir'){const a=Math.abs(axisX())+Math.abs(axisY())+(G.pad.btn.a||G.keys.Space||G.keys.Enter?1:0);if(a)stirBy(Math.min(1,a)*5*dt)}
  hudInfo(g.phase==='add'?'Next: '+ING[order[g.step]].n:g.phase==='stir'?'Stir '+Math.min(3,Math.floor(g.stir/TAU))+' / 3':'Ready!')};
 g.act=()=>{if(g.phase==='stir')stirBy(0.6);else if(G.cur.on){const i=potAt(G.cur);if(i>=0)add(i)}else G.cur.on=true};
 g.draw=()=>{const s=G.s,t=G.t;S.bg('greenhouse');S.amb('rays',t,{x:0.45});S.amb('motes',t,{n:16,c:'rgba(230,255,200,.6)'});
  for(let i=0;i<6;i++){const[x0,y]=potPos(i),ing=ING[shelf[i]],sh=g.shk[i]&&g.t-g.shk[i]<0.4?Math.sin(g.t*60)*5*s:0,x=x0+sh;
   const pg=cx.createLinearGradient(x-30*s,0,x+30*s,0);pg.addColorStop(0,'#a8552a');pg.addColorStop(0.5,'#d9844a');pg.addColorStop(1,'#9a4a22');cx.fillStyle=pg;
   cx.beginPath();cx.moveTo(x-30*s,y-6*s);cx.lineTo(x+30*s,y-6*s);cx.lineTo(x+22*s,y+26*s);cx.lineTo(x-22*s,y+26*s);cx.closePath();cx.fill();cx.fillStyle='#c4703c';S.rr(x-34*s,y-12*s,68*s,10*s,4*s);cx.fill();
   if(!(g.drag&&g.drag.i===i)&&!g.fly.some(f=>f.slot===i&&g.t-f.t<0.5))S.spr(ing.k,x,y-6*s,60*s,{rot:Math.sin(t*1.5+i)*0.05});
   S.txt(ing.n,x,y+42*s,Math.min(19*s,G.W/24),'#fff');S.txt(String(i+1),x-38*s,y-34*s,18*s,'#ffd23f')}
  const[bx,by]=bowlPos(),bw=200*s;S.shadow(bx,by+30*s,bw*0.42);S.spr('bowl',bx,by+40*s,bw*0.85);
  const mc=g.phase==='done'?'#b9f5ff':g.mix.length?g.mix[g.mix.length-1]:'#7aa8c0';cx.save();cx.shadowColor=mc;cx.shadowBlur=g.phase==='done'?30*s:10*s;cx.fillStyle=mc;cx.beginPath();cx.ellipse(bx,by-18*s,bw*0.36,bw*0.1,0,0,TAU);cx.fill();cx.restore();
  if(g.phase!=='add'){cx.strokeStyle='rgba(255,255,255,.55)';cx.lineWidth=3*s;for(let k=0;k<3;k++){cx.beginPath();cx.ellipse(bx,by-18*s,bw*(0.1+k*0.08),bw*(0.03+k*0.02),0,g.ang+k,g.ang+k+2);cx.stroke()}
   const a=g.ang;cx.strokeStyle='#c79a5a';cx.lineWidth=9*s;cx.lineCap='round';cx.beginPath();cx.moveTo(bx+Math.cos(a)*bw*0.22,by-18*s+Math.sin(a)*bw*0.06);cx.lineTo(bx+Math.cos(a)*bw*0.16,by-110*s);cx.stroke()}
  if(g.phase==='stir'){cx.setLineDash([10*s,10*s]);cx.strokeStyle='rgba(255,255,255,.85)';cx.lineWidth=4*s;cx.beginPath();cx.ellipse(bx,by-18*s,bw*0.55,bw*0.22,0,t*2,t*2+Math.PI*1.7);cx.stroke();cx.setLineDash([])}
  if(g.phase==='done')S.amb('sparkle',t,{n:12,y0:0.5,yh:0.4});
  const rx=G.land?G.W*0.5:G.W*0.06,ry=G.land?G.H*0.08:G.H*0.42,rw=G.land?G.W*0.44:G.W*0.88,rh=64*s;S.panel(rx,ry,rw,rh,16*s,'rgba(255,250,232,.94)','rgba(160,120,60,.7)');
  order.forEach((o,i)=>{const x=rx+rw*(i+0.5)/4,y=ry+rh/2;if(i<g.step){cx.fillStyle='#c8f5c8';cx.beginPath();cx.arc(x,y,24*s,0,TAU);cx.fill()}else if(i===g.step&&g.phase==='add'){cx.strokeStyle='#ff5d8f';cx.lineWidth=4*s;cx.beginPath();cx.arc(x,y,(24+3*Math.sin(t*6))*s,0,TAU);cx.stroke()}
   S.spr(ING[o].k,x,y,40*s,{center:1});if(i<3)S.txt('\u203A',rx+rw*(i+1)/4,y,24*s,'#a07040',{stroke:'rgba(0,0,0,0)'})});
  if(g.drag)S.spr(ING[shelf[g.drag.i]].k,g.drag.x,g.drag.y,80*s,{center:1});
  for(const f of g.fly){const p=(g.t-f.t)/0.5;if(p<1){const[x,y]=potPos(f.slot),e=S.E.inOut(p);S.spr(ING[shelf[f.slot]].k,lerp(x,bx,e),lerp(y,by-20*s,e)-Math.sin(p*Math.PI)*80*s,70*s,{center:1,rot:p*4})}}
  drawAsh('adult',{},G.land?G.W*0.92:G.W*0.87,G.land?G.H*0.98:G.H*0.985,G.H*(G.land?0.42:0.2),true);
  S.drawParticles()};
 g.stars=()=>g.wrong===0?3:g.wrong<3?2:1;
 g.qa=()=>({phase:g.phase,next:g.phase==='add'?(()=>{const[x,y]=potPos(shelf.indexOf(order[g.step]));return[x,y-14*G.s]})():null,bowl:bowlPos()});return g};
/* ================= chapter 10: save the wedding cake ================= */
GAMES.cake=()=>{const who=['king','danielle','rita','sofia','gina','frazer'];const g={t:0,done:false,saved:0,eaten:0,total:14,spawned:0,next:1.0,seats:who.map(w=>({w,r:-1,sleepy:false,gone:0})),fly:[]};
 const tableY=()=>G.H*(G.land?0.66:0.56);
 const seat=i=>{const w=Math.min(G.W*0.96,820*G.s),x0=(G.W-w)/2;return[x0+w*(i+0.5)/6,tableY()]};
 g.down=p=>{let bi=-1,bd=1e9;g.seats.forEach((st,i)=>{if(st.r<0)return;const[x,y]=seat(i),d=Math.hypot(p.x-x,p.y-(y+22*G.s));if(d<bd){bd=d;bi=i}});
  if(bi>=0&&bd<64*G.s){const st=g.seats[bi],[x,y]=seat(bi);st.r=-1;st.gone=g.t;g.saved++;g.fly.push({x,y:y+22*G.s,t:g.t});yay(x,y,'Saved!',{n:12,colors:['#ffd6e6','#fff','#ffd23f']})}else Sound.fx('tap')};
 g.update=dt=>{g.t+=dt;g.next-=dt;const act=g.seats.filter(s=>s.r>=0).length;
  if(g.next<=0&&g.spawned<g.total&&act<2){const free=g.seats.map((s,i)=>i).filter(i=>g.seats[i].r<0&&g.t-g.seats[i].gone>0.8);if(free.length){const i=pick(free),[x,y]=seat(i);g.seats[i].r=0;g.spawned++;g.next=Math.max(0.7,1.6-g.spawned*0.05);S.burst(x,y+20*G.s,{n:6,colors:['#fff'],speed:80,life:0.4})}}
  for(let i=0;i<6;i++){const st=g.seats[i];if(st.r>=0){st.r+=dt/Math.max(1.5,2.6-g.spawned*0.06);if(st.r>=1){const[x,y]=seat(i);st.r=-1;st.gone=g.t;st.sleepy=true;st.st=g.t;g.eaten++;Sound.fx('bad');S.popText(x,y-60*G.s,'Yawn...','#cfe6ff',24)}}}
  hudInfo('Saved '+g.saved+' / '+g.total);if(g.spawned>=g.total&&g.seats.every(s=>s.r<0))g.done=true};
 g.draw=()=>{const s=G.s,t=G.t,ty=tableY();S.bg('wedding');S.amb('petals',t,{n:14});S.amb('sparkle',t,{n:8,yh:0.4});
  const ch=G.H*(G.land?0.3:0.17);S.actor('luciana',G.W*0.42,ty-ch*0.55,ch,t,{face:'r'});S.actor('antonio',G.W*0.58,ty-ch*0.55,ch*1.04,t,{face:'l'});
  const gh=G.H*(G.land?0.36:0.2);g.seats.forEach((st,i)=>{const[x]=seat(i),sl=st.sleepy;S.spr(st.w,x,ty+gh*0.42,gh,{rot:sl?0.12*Math.sin(t+i):0,face:i<3?'r':'l'});if(sl)S.amb('zzz',t,{x:x+16*s,y:ty-gh*0.5})});
  /* table */
   /* draped table: a finite cloth with folds, scalloped pink runner, flower garland and a soft shadow on the terrace */
   const tH=G.H*(G.land?0.2:0.13),tb=ty+tH;cx.fillStyle='rgba(40,20,30,.22)';cx.beginPath();cx.ellipse(G.W/2,tb+6*s,G.W*0.55,12*s,0,0,TAU);cx.fill();
   const tg=cx.createLinearGradient(0,ty,0,tb);tg.addColorStop(0,'#fffaf3');tg.addColorStop(1,'#eadbd0');cx.fillStyle=tg;cx.beginPath();cx.moveTo(0,ty);cx.lineTo(G.W,ty);cx.lineTo(G.W,tb);
   for(let x=G.W;x>=-30*s;x-=30*s)cx.quadraticCurveTo(x-15*s,tb+8*s,x-30*s,tb);cx.closePath();cx.fill();
   cx.strokeStyle='rgba(180,150,150,.35)';cx.lineWidth=2*s;for(let x=15*s;x<G.W;x+=30*s){cx.beginPath();cx.moveTo(x,ty+30*s);cx.quadraticCurveTo(x+3*s,ty+tH*0.6,x,tb);cx.stroke()}
   cx.fillStyle='#ffd6e6';cx.beginPath();cx.moveTo(0,ty+6*s);for(let x=0;x<=G.W+40*s;x+=40*s)cx.quadraticCurveTo(x+20*s,ty+34*s,x+40*s,ty+6*s);cx.lineTo(G.W,ty);cx.lineTo(0,ty);cx.fill();
   cx.fillStyle='#fff';cx.fillRect(0,ty,G.W,8*s);
   for(let x=20*s;x<G.W;x+=40*s){const y=ty+30*s;cx.fillStyle=['#ff8fb8','#ffd23f','#fff','#c9a0ff'][Math.round(x/40/s)%4];for(let k=0;k<5;k++){cx.beginPath();cx.arc(x+Math.cos(k*1.26)*4*s,y+Math.sin(k*1.26)*4*s,3.4*s,0,TAU);cx.fill()}cx.fillStyle='#ffe58a';cx.beginPath();cx.arc(x,y,2*s,0,TAU);cx.fill()}
  g.seats.forEach((st,i)=>{const[x,y]=seat(i),py=y+30*s;cx.fillStyle='rgba(0,0,0,.08)';cx.beginPath();cx.ellipse(x,py+4*s,34*s,8*s,0,0,TAU);cx.fill();
   if(st.r>=0){const wob=st.r>0.7?Math.sin(t*40)*2*s:0;S.spr('cake',x+wob,py+6*s,46*s);cx.strokeStyle='rgba(255,255,255,.7)';cx.lineWidth=7*s;cx.beginPath();cx.arc(x,py-14*s,36*s,0,TAU);cx.stroke();
    cx.strokeStyle=st.r>0.7?'#ff4a6a':'#ff8fb8';cx.lineWidth=5*s;cx.beginPath();cx.arc(x,py-14*s,36*s,-Math.PI/2,-Math.PI/2+TAU*st.r);cx.stroke()}});
  const tx=G.W*0.08,tby=G.H*0.99;
  for(const f of g.fly){const p=(g.t-f.t)/0.6;if(p<1){const e=S.E.inOut(p);S.spr('cake',lerp(f.x,tx+40*s,e),lerp(f.y,tby-60*s,e)-Math.sin(p*Math.PI)*120*s,46*s*(1-p*0.4),{center:1,rot:p*6})}}
  S.actor('tika',tx,tby,G.H*(G.land?0.24:0.15),t,{face:'r'});S.actor('sagi',G.W*0.9,tby,G.H*(G.land?0.14:0.08),t,{face:'l'});
  S.drawParticles();hint(g.t,'Tap the cake before they eat it!')};
 g.stars=()=>starsFrom(g.saved/g.total);g.qa=()=>({targets:g.seats.map((st,i)=>st.r>=0?[seat(i)[0],seat(i)[1]+22*G.s]:null).filter(Boolean)});return g};
/* ================= chapter 11: sing the lullaby together (memory) ================= */
GAMES.lullaby=()=>{const NOTES=['C5','E5','G5','A5'],COL=['#ff8fb8','#ffd23f','#7fd3ff','#9be59b'],ROUNDS=[[0,1,2,1],[0,1,2,3,2,1],[2,3,2,1,0,1,2,0]];
 const g={t:0,done:false,round:0,i:0,phase:'listen',pt:0.8,lit:-1,litT:0,mist:0};
 const shell=k=>{const c=G.land?[G.W*0.7,G.H*0.55]:[G.W*0.5,G.H*0.7],d=G.land?G.H*0.21:Math.min(G.W*0.23,G.H*0.12);return[c[0]+(k%2?d:-d),c[1]+(k<2?-d:d)]};
 function press(k){if(g.phase!=='play')return;g.lit=k;g.litT=g.t;Sound.note(NOTES[k],0.6);const seq=ROUNDS[g.round],[x,y]=shell(k);
  if(seq[g.i]===k){S.burst(x,y,{n:10,colors:[COL[k],'#fff'],shape:'note',speed:150,g:-80,life:1});g.i++;if(g.i>=seq.length){g.round++;Sound.fx('star');
    if(g.round>=ROUNDS.length){g.phase='end';S.popText(G.W/2,G.H*0.3,'Beautiful!','#fff6a0',36);S.burst(G.W/2,G.H*0.35,{n:40,shape:'heart',colors:['#ff8fb8','#fff','#ffd23f'],speed:300,up:150,life:1.4});setTimeout(()=>g.done=true,1600)}
    else{g.phase='listen';g.i=0;g.pt=g.t+1.4;S.popText(G.W/2,G.H*0.3,'Lovely! Next verse...','#fff6a0',28)}}}
  else{g.mist++;g.phase='listen';g.i=0;g.pt=g.t+1.2;S.popText(G.W/2,G.H*0.3,"Let's sing it again together",'#ffd0e0',24)}}
 g.down=p=>{for(let k=0;k<4;k++){const[x,y]=shell(k);if(Math.hypot(p.x-x,p.y-y)<72*G.s){press(k);return}}};
 g.key=c=>{const m=/^Digit([1-4])$/.exec(c);if(m){press(+m[1]-1);return true}return false};
 g.padBtn=n=>{const m={y:0,b:1,x:2,a:3}[n];if(m===undefined)return false;press(m);return true};
 g.update=dt=>{g.t+=dt;if(g.phase==='listen'&&g.t>=g.pt){const seq=ROUNDS[g.round];if(g.i<seq.length){g.lit=seq[g.i];g.litT=g.t;Sound.note(NOTES[seq[g.i]],0.6);const[x,y]=shell(seq[g.i]);S.burst(x,y,{n:6,colors:[COL[seq[g.i]]],shape:'note',speed:100,g:-60,life:0.9});g.i++;g.pt=g.t+0.62}else{g.phase='play';g.i=0}}
  hudInfo('Verse '+Math.min(3,g.round+1)+' / 3'+(g.phase==='listen'?'  Listen...':g.phase==='play'?'  Your turn!':''))};
 g.draw=()=>{const s=G.s,t=G.t;S.bg('moon');S.amb('stars',t,{n:30,yh:0.4});S.amb('fireflies',t,{n:12,y0:0.45,yh:0.5});
  const cy=G.land?G.H*0.93:G.H*0.45,hh=G.land?G.H*0.58:G.H*0.22,x0=G.land?G.W*0.24:G.W*0.5;S.glowDot(x0,cy-hh*0.5,hh,'rgba(220,200,255,.35)');
  S.actor('marissa',x0-hh*0.3,cy,hh*1.02,t,{face:'r'});drawAsh('adult',{},x0+hh*0.3,cy,hh,true);
  for(let k=0;k<4;k++){const[x,y]=shell(k),on=g.lit===k&&g.t-g.litT<0.45,r=(on?64:54)*s;S.glowDot(x,y,r*1.6,on?COL[k]:'rgba(255,255,255,.18)');
   cx.save();cx.shadowColor=COL[k];cx.shadowBlur=on?30*s:10*s;S.spr('shell',x,y,r*1.5*(on?1.08:1),{center:1});cx.restore();
   cx.fillStyle=COL[k];cx.globalAlpha=0.35;cx.beginPath();cx.arc(x,y,r*0.75,0,TAU);cx.fill();cx.globalAlpha=1;S.txt(String(k+1),x,y+r*0.95,20*s,'#fff')}
  S.txt(g.phase==='listen'?'Listen to Queen Marissa...':g.phase==='play'?'Now you sing it! Tap the shells.':'',G.land?G.W*0.7:G.W/2,G.land?G.H*0.12:G.H*0.52,Math.min(26*s,G.W/17),'#fff6a0');
  S.drawParticles()};
 g.stars=()=>g.mist===0?3:g.mist<3?2:1;
 g.qa=()=>({phase:g.phase,want:g.phase==='play'?shell(ROUNDS[g.round][g.i]):null});return g};
