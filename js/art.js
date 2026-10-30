/* Original vector art for Ashlin as the Island Princess (all drawn in code). */
const Art=(()=>{
 const TAU=Math.PI*2;let X;const LINE='#2a2238';
 function use(c){X=c}
 function circ(x,y,r,f,s,w){X.beginPath();X.arc(x,y,Math.max(0.1,r),0,TAU);if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=w||1;X.stroke()}}
 function ell(x,y,rx,ry,f,s,w,rot){X.beginPath();X.ellipse(x,y,Math.max(0.1,rx),Math.max(0.1,ry),rot||0,0,TAU);if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=w||1;X.stroke()}}
 function poly(p,f,s,w){X.beginPath();X.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)X.lineTo(p[i][0],p[i][1]);X.closePath();if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=w||1;X.lineJoin='round';X.stroke()}}
 function rr(x,y,w,h,r,f,s,lw){X.beginPath();X.roundRect?X.roundRect(x,y,w,h,r):X.rect(x,y,w,h);if(f){X.fillStyle=f;X.fill()}if(s){X.strokeStyle=s;X.lineWidth=lw||1;X.stroke()}}
 function ln(pts,c,w){X.beginPath();X.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)X.lineTo(pts[i][0],pts[i][1]);X.strokeStyle=c;X.lineWidth=w;X.lineCap='round';X.lineJoin='round';X.stroke()}
 function grad(y0,y1,stops){const g=X.createLinearGradient(0,y0,0,y1);stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c));return g}
 /* ---------- scenery ---------- */
 function sky(W,H,stops){X.fillStyle=grad(0,H,stops);X.fillRect(0,0,W,H)}
 function sun(x,y,r,c){const g=X.createRadialGradient(x,y,r*0.2,x,y,r*2.2);g.addColorStop(0,c||'#fff6c8');g.addColorStop(0.35,'rgba(255,230,150,.55)');g.addColorStop(1,'rgba(255,220,150,0)');X.fillStyle=g;X.fillRect(x-r*2.3,y-r*2.3,r*4.6,r*4.6);circ(x,y,r,c||'#fff3b0')}
 function cloud(x,y,s,a){X.globalAlpha=a===undefined?0.9:a;circ(x,y,22*s,'#fff');circ(x+24*s,y-8*s,26*s,'#fff');circ(x+52*s,y,20*s,'#fff');rr(x-10*s,y,72*s,16*s,8*s,'#fff');X.globalAlpha=1}
 function clouds(W,H,t,s,n=4){for(let i=0;i<n;i++){const sp=6+i*3,x=((i*W*0.37+t*sp)%(W+200))-120;cloud(x,H*(0.08+0.07*(i%3)),s*(0.8+0.25*(i%2)))}}
 function sea(W,y,H,t,c1,c2,s){X.fillStyle=grad(y,H,[c1||'#3fc1d9',c2||'#1b6fa8']);X.fillRect(0,y,W,H-y);
  X.strokeStyle='rgba(255,255,255,.45)';X.lineWidth=2*s;for(let r=0;r<5;r++){const yy=y+(H-y)*(0.08+r*0.2),ph=t*0.6*(1+r*0.15)+r;X.beginPath();
   for(let x=0;x<=W;x+=12*s){const v=Math.sin(x/(40*s)+ph)*3*s;x?X.lineTo(x,yy+v):X.moveTo(x,yy+v)}X.globalAlpha=0.5-r*0.07;X.stroke()}X.globalAlpha=1}
 function palm(x,y,h,lean,t){const s=h/200,sw=Math.sin(t*0.8+x)*0.04;const top=[x+lean*h*0.35,y-h];
  X.beginPath();X.moveTo(x-7*s,y);X.quadraticCurveTo(x+lean*h*0.1,y-h*0.5,top[0]-4*s,top[1]);X.lineTo(top[0]+4*s,top[1]);X.quadraticCurveTo(x+lean*h*0.12+10*s,y-h*0.5,x+7*s,y);X.closePath();X.fillStyle='#8a5a2b';X.fill();X.strokeStyle=LINE;X.lineWidth=2*s;X.stroke();
  for(let i=0;i<7;i++){const a=-Math.PI/2+(i-3)*0.5+sw,L=h*0.42;const ex=top[0]+Math.cos(a)*L*1.1,ey=top[1]+Math.sin(a)*L*0.6+L*0.35*Math.abs(Math.cos(a));
   X.beginPath();X.moveTo(top[0],top[1]);X.quadraticCurveTo(top[0]+Math.cos(a)*L*0.6,top[1]+Math.sin(a)*L*0.6-14*s,ex,ey);X.quadraticCurveTo(top[0]+Math.cos(a)*L*0.5,top[1]+Math.sin(a)*L*0.4+6*s,top[0],top[1]);X.fillStyle=i%2?'#2f9e44':'#3cb554';X.fill();X.strokeStyle='#1d5e2a';X.lineWidth=1.5*s;X.stroke()}
  circ(top[0]-6*s,top[1]+8*s,7*s,'#6b3e1c');circ(top[0]+6*s,top[1]+9*s,7*s,'#7a4a22')}
 function bush(x,y,s,c){circ(x,y,26*s,c||'#2e8b3e');circ(x+26*s,y-8*s,30*s,c||'#35a047');circ(x+54*s,y,24*s,c||'#2e8b3e');circ(x+20*s,y+4*s,6*s,'#ff6fa8');circ(x+44*s,y-14*s,6*s,'#ffd23f')}
 function islandBg(W,H,t,s,gy){sky(W,H,['#7fd3ff','#c8f0ff','#fff1c9']);sun(W*0.78,H*0.13,30*s);clouds(W,H,t,s);
  sea(W,gy-H*0.12,gy,t,'#58d0e0','#2a9bc4',s);X.fillStyle='#2f7d3a';X.beginPath();X.moveTo(0,gy-H*0.1);X.quadraticCurveTo(W*0.25,gy-H*0.22,W*0.5,gy-H*0.11);X.quadraticCurveTo(W*0.8,gy-H*0.2,W,gy-H*0.1);X.lineTo(W,gy);X.lineTo(0,gy);X.fill();
  X.fillStyle=grad(gy-8*s,H,['#f7dd9a','#e8c477']);X.fillRect(0,gy-6*s,W,H-gy+6*s)}
 function waterfall(x,y,w,h,t,s){rr(x-12*s,y-8*s,w+24*s,h*0.2,10*s,'#6c7a86');X.fillStyle=grad(y,y+h,['#bdf3ff','#5fd0ec']);X.fillRect(x,y,w,h);
  X.strokeStyle='rgba(255,255,255,.7)';X.lineWidth=2*s;for(let i=0;i<5;i++){const xx=x+w*(0.15+i*0.18),o=(t*120*s+i*30)%(h*0.5);ln([[xx,y+o],[xx,y+o+h*0.25]],'rgba(255,255,255,.65)',2*s)}
  for(let i=0;i<6;i++)circ(x+w*(i/5),y+h,10*s+4*s*Math.sin(t*2+i),'rgba(255,255,255,.85)')}
 function palaceHall(W,H,t,s,cam,gy){sky(W,H,['#fbe9d0','#f5d9b8']);const sp=180*s,o=-(cam*0.5)%sp;
  for(let x=o-sp;x<W+sp;x+=sp){rr(x+sp*0.2,H*0.12,sp*0.6,gy-H*0.12,sp*0.3,'#ffe9a8');X.fillStyle='#9fd8f5';X.beginPath();X.ellipse(x+sp*0.5,H*0.12+sp*0.3,sp*0.24,sp*0.24,0,Math.PI,0);X.lineTo(x+sp*0.74,gy-H*0.25);X.lineTo(x+sp*0.26,gy-H*0.25);X.fill();
   rr(x-14*s,H*0.08,28*s,gy-H*0.08,6*s,'#fff8ec','#c9a86a',2*s);rr(x-20*s,H*0.07,40*s,14*s,4*s,'#e9cf8f');rr(x-20*s,gy-16*s,40*s,16*s,4*s,'#e9cf8f');
   X.fillStyle='#3a6fd8';X.beginPath();X.moveTo(x+sp*0.35,H*0.1);X.lineTo(x+sp*0.65,H*0.1);X.lineTo(x+sp*0.65,H*0.26);X.lineTo(x+sp*0.5,H*0.22);X.lineTo(x+sp*0.35,H*0.26);X.fill();circ(x+sp*0.5,H*0.15,9*s,'#ffd23f')}
  const to=-(cam)%(60*s);for(let x=to-60*s;x<W+60*s;x+=60*s){X.fillStyle=((Math.round((x-to)/(60*s)))%2)?'#e6d2b0':'#f4e6cc';X.fillRect(x,gy,60*s,H-gy)}rr(0,gy-3*s,W,6*s,0,'#b78a4a')}
 function ballroom(W,H,t,s){sky(W,H,['#3b1d5e','#6b3f8f','#e7a96b']);for(let i=0;i<3;i++){const x=W*(0.2+i*0.3),y=H*0.08;ln([[x,0],[x,y]],'#e9cf8f',3*s);
   for(let j=0;j<7;j++){const a=j/6*Math.PI;circ(x+Math.cos(a)*30*s,y+Math.sin(a)*12*s,5*s,'#fff3b0');const g=X.createRadialGradient(x,y+10*s,2,x,y+10*s,80*s);g.addColorStop(0,'rgba(255,240,180,.35)');g.addColorStop(1,'rgba(255,240,180,0)');}
   ell(x,y+4*s,34*s,10*s,'#e9cf8f');circ(x,y+18*s,6*s,'#fff')}
  X.fillStyle=grad(H*0.62,H,['#b98a5a','#7a5232']);X.fillRect(0,H*0.62,W,H*0.38);for(let i=0;i<10;i++){X.globalAlpha=0.15;ell(W*i/9,H*0.8,50*s,10*s,'#fff');X.globalAlpha=1}}
 function greenhouse(W,H,t,s){sky(W,H,['#d6f5e3','#a6e3c1']);X.strokeStyle='rgba(255,255,255,.7)';X.lineWidth=3*s;for(let x=0;x<W;x+=70*s){ln([[x,0],[x,H*0.7]],'rgba(255,255,255,.7)',3*s)}for(let y=0;y<H*0.7;y+=70*s)ln([[0,y],[W,y]],'rgba(255,255,255,.5)',2*s);
  X.fillStyle='#8a5a2b';X.fillRect(0,H*0.7,W,H*0.3);for(let i=0;i<8;i++)bush(i*W/7-20*s,H*0.7,s*0.9,i%2?'#3aa35a':'#2e8b4e')}
 function garden(W,H,t,s){sky(W,H,['#8fd8ff','#e2f6ff']);sun(W*0.15,H*0.1,24*s);clouds(W,H,t,s,3);X.fillStyle='#7cc26a';X.fillRect(0,H*0.55,W,H*0.45);
  const ax=W/2,ay=H*0.55;X.strokeStyle='#fff';X.lineWidth=10*s;X.beginPath();X.arc(ax,ay,Math.min(W,H)*0.28,Math.PI,0);X.stroke();for(let i=0;i<12;i++){const a=Math.PI+i/11*Math.PI;circ(ax+Math.cos(a)*Math.min(W,H)*0.28,ay+Math.sin(a)*Math.min(W,H)*0.28,9*s,i%2?'#ff8fb8':'#fff3b0')}}
 function shipSide(x,y,w,t,s,flag){const h=w*0.35;X.fillStyle='#7a4a22';X.beginPath();X.moveTo(x-w/2,y-h*0.3);X.lineTo(x+w/2,y-h*0.35);X.lineTo(x+w*0.38,y);X.lineTo(x-w*0.4,y);X.closePath();X.fill();X.strokeStyle=LINE;X.lineWidth=2*s;X.stroke();
  rr(x-w*0.45,y-h*0.36,w*0.9,6*s,3*s,'#e9cf8f');ln([[x,y-h*0.3],[x,y-h*2.1]],'#5a3a1a',5*s);
  poly([[x+4*s,y-h*2],[x+w*0.34,y-h*1.2],[x+4*s,y-h*0.5]],'#fffaf0',LINE,2*s);poly([[x-4*s,y-h*1.9],[x-w*0.3,y-h*0.6],[x-4*s,y-h*0.6]],'#fffaf0',LINE,2*s);
  poly([[x,y-h*2.1],[x+26*s,y-h*2.0],[x,y-h*1.88]],flag||'#3a6fd8')}
 /* Paladia banner (purple + gold sun) and Apollonia (blue + gold crown) */
 function banner(x,y,w,kind,s){const h=w*0.62;rr(x,y,w,h,3*s,kind==='paladia'?'#7b3fb5':'#3a6fd8',LINE,2*s);if(kind==='paladia'){circ(x+w/2,y+h/2,h*0.22,'#ffd23f');for(let i=0;i<8;i++){const a=i/8*TAU;ln([[x+w/2+Math.cos(a)*h*0.26,y+h/2+Math.sin(a)*h*0.26],[x+w/2+Math.cos(a)*h*0.38,y+h/2+Math.sin(a)*h*0.38]],'#ffd23f',2*s)}}
  else crown(x+w/2,y+h*0.7,w*0.45,'#ffd23f')}
 function crown(x,y,w,c){const h=w*0.6;poly([[x-w/2,y],[x-w/2,y-h],[x-w/4,y-h*0.5],[x,y-h*1.1],[x+w/4,y-h*0.5],[x+w/2,y-h],[x+w/2,y]],c||'#ffd23f',LINE,Math.max(1,w*0.06));circ(x,y-h*0.35,w*0.08,'#e33b6b')}
 function sparkle(x,y,r,c,a){X.globalAlpha=a===undefined?1:a;poly([[x,y-r],[x+r*0.25,y-r*0.25],[x+r,y],[x+r*0.25,y+r*0.25],[x,y+r],[x-r*0.25,y+r*0.25],[x-r,y],[x-r*0.25,y-r*0.25]],c||'#fff6a0');X.globalAlpha=1}
 function heart(x,y,r,c){X.beginPath();X.moveTo(x,y+r*0.9);X.bezierCurveTo(x-r*1.4,y-r*0.1,x-r*0.6,y-r*1.1,x,y-r*0.35);X.bezierCurveTo(x+r*0.6,y-r*1.1,x+r*1.4,y-r*0.1,x,y+r*0.9);X.fillStyle=c||'#ff5d8f';X.fill()}
 /* ---------- animals: 4-leg gait with the planted foot moving at ground speed (no slide) ---------- */
 function gaitStep(g,x,stride,dt){const dx=g.px===undefined?0:x-g.px;g.px=x;const ad=Math.abs(dx);if(ad>0.02){g.dir=Math.sign(dx);g.mv=Math.min(1,(g.mv||0)+dt/0.15)}else g.mv=Math.max(0,(g.mv||0)-dt/0.15);
  g.ph=((g.ph||0)+ad/(stride/0.6))%1;return g}
 function quadLegs(g,hips,len,stride,lift,col,w,s){const mv=g.mv||0,e=mv*mv*(3-2*mv);
  for(const [hx,hy,off] of hips){const q=((g.ph||0)+off)%1,S=stride;let X0,Y0=0;if(q<0.6)X0=S/2-S*q/0.6;else{const v=(q-0.6)/0.4,ee=v*v*(3-2*v);X0=-S/2+S*ee;Y0=-lift*Math.sin(Math.PI*v)}
   const ax=hx+X0*e*(g.flip?-1:1),ay=hy+len+Y0*e,L=len/2*1.08,d=Math.min(Math.hypot(ax-hx,ay-hy),2*L-0.01),b=Math.atan2(ay-hy,ax-hx),of=Math.acos(Math.min(1,d/(2*L)));
   const kx=hx+L*Math.cos(b-of*(g.flip?-1:1)),ky=hy+L*Math.sin(b-of*(g.flip?-1:1));ln([[hx,hy],[kx,ky],[ax,ay]],LINE,w+3*s);ln([[hx,hy],[kx,ky],[ax,ay]],col,w);ell(ax+(g.flip?-2:2)*s,ay,w*0.62,w*0.38,col,LINE,1.5*s)}}
 function sagi(x,y,h,g,t,o={}){const s=h/60;g=g||{};X.save();X.translate(x,y);if(o.flip)X.scale(-1,1);const gg=Object.assign({},g,{flip:false});
  const sleep=o.sleep;X.lineWidth=2*s;
  // tail with rings
  for(let i=0;i<5;i++){const a=-0.6+i*0.2+Math.sin(t*1.2)*0.05;circ(-28*s-i*8*s,-30*s-Math.sin(a)*14*s,9*s,i%2?'#f0c890':'#c4521f',LINE,1.5*s)}
  quadLegs(gg,[[-16*s,-24*s,0.5],[14*s,-24*s,0]],22*s,16*s,6*s,'#3a1a10',7*s,s);
  ell(0,-32*s,26*s,14*s,'#c4521f',LINE,2*s);ell(2*s,-24*s,18*s,6*s,'#4a1f12');
  quadLegs(gg,[[-12*s,-24*s,0],[18*s,-24*s,0.5]],22*s,16*s,6*s,'#4a1f12',7.5*s,s);
  circ(28*s,-44*s,14*s,'#d86a2e',LINE,2*s);poly([[18*s,-54*s],[22*s,-64*s],[28*s,-55*s]],'#fff',LINE,1.5*s);poly([[30*s,-56*s],[36*s,-64*s],[38*s,-52*s]],'#fff',LINE,1.5*s);
  ell(34*s,-40*s,8*s,6*s,'#fff');ell(24*s,-42*s,5*s,4*s,'#fff');circ(41*s,-41*s,2.6*s,LINE);
  if(sleep){ln([[25*s,-46*s],[31*s,-46*s]],LINE,2*s)}else{circ(29*s,-47*s,2.4*s,LINE);circ(29.8*s,-47.8*s,0.8*s,'#fff')}
  if(o.glasses){X.strokeStyle=LINE;X.lineWidth=1.5*s;X.beginPath();X.arc(29*s,-47*s,4.5*s,0,TAU);X.stroke()}X.restore()}
 function tika(x,y,h,g,t,o={}){const s=h/80;g=g||{};X.save();X.translate(x,y);if(o.flip)X.scale(-1,1);const gg=Object.assign({},g,{flip:false});
  quadLegs(gg,[[-18*s,-30*s,0.5],[16*s,-30*s,0]],30*s,20*s,7*s,'#7e8799',13*s,s);
  ell(0,-44*s,34*s,24*s,'#9aa3b5',LINE,2*s);ln([[-34*s,-44*s],[-42*s,-36*s]],'#9aa3b5',4*s);
  quadLegs(gg,[[-12*s,-30*s,0],[22*s,-30*s,0.5]],30*s,20*s,7*s,'#9aa3b5',14*s,s);
  circ(34*s,-58*s,20*s,'#a7b0c2',LINE,2*s);ell(22*s,-58*s,13*s,17*s,'#9aa3b5',LINE,2*s);ell(22*s,-58*s,8*s,12*s,'#f2b8c6');
  const tr=o.trunkUp?-1:1,sw=Math.sin(t*1.5)*0.15;X.beginPath();X.moveTo(48*s,-58*s);X.quadraticCurveTo(62*s,-50*s+sw*10*s,58*s,(-40+tr*-8)*s);X.quadraticCurveTo(56*s,(-34+tr*-14)*s,62*s,(-30+tr*-22)*s);X.strokeStyle=LINE;X.lineWidth=11*s;X.lineCap='round';X.stroke();X.strokeStyle='#a7b0c2';X.lineWidth=8*s;X.stroke();
  if(o.sleep)ln([[36*s,-64*s],[42*s,-64*s]],LINE,2*s);else{circ(40*s,-64*s,3*s,LINE);circ(41*s,-65*s,1*s,'#fff')}
  if(o.bow){heart(30*s,-80*s,6*s,'#ff5d8f')}X.restore()}
 function azul(x,y,h,t,o={}){const s=h/70;X.save();X.translate(x,y);if(o.flip)X.scale(-1,1);
  if(o.fan){for(let i=0;i<11;i++){const a=-Math.PI*0.95+i/10*Math.PI*0.9;const ex=Math.cos(a)*55*s-10*s,ey=-34*s+Math.sin(a)*50*s;ln([[-8*s,-30*s],[ex,ey]],'#1f8a5a',6*s);circ(ex,ey,7*s,'#2fbf7a');circ(ex,ey,4*s,'#1e5fd6');circ(ex,ey,2*s,'#ffd23f')}}
  else{X.beginPath();X.moveTo(-10*s,-26*s);X.quadraticCurveTo(-40*s,-18*s,-58*s,-8*s);X.lineTo(-54*s,-2*s);X.quadraticCurveTo(-34*s,-12*s,-8*s,-18*s);X.fillStyle='#1f8a5a';X.fill();X.strokeStyle=LINE;X.lineWidth=1.5*s;X.stroke();for(let i=0;i<4;i++)circ(-20*s-i*10*s,-17*s+i*2.5*s,3*s,'#ffd23f')}
  const fl=o.fly?Math.sin(t*12)*0.6:0;ln([[-4*s,-8*s],[-2*s,0]],'#c79a3a',3*s);ln([[6*s,-8*s],[8*s,0]],'#c79a3a',3*s);
  ell(0,-22*s,15*s,13*s,'#1e5fd6',LINE,2*s);X.save();X.translate(-2*s,-24*s);X.rotate(-0.4+fl);ell(-6*s,0,13*s,7*s,'#2b7be0',LINE,1.5*s);X.restore();
  X.beginPath();X.moveTo(6*s,-30*s);X.quadraticCurveTo(14*s,-44*s,12*s,-52*s);X.lineWidth=9*s;X.strokeStyle='#1e5fd6';X.lineCap='round';X.stroke();circ(13*s,-54*s,7*s,'#2b7be0',LINE,1.5*s);
  for(let i=0;i<3;i++){ln([[12*s,-60*s],[8*s+i*4*s,-70*s]],'#1e5fd6',1.5*s);circ(8*s+i*4*s,-70*s,2*s,'#2fbf7a')}poly([[19*s,-55*s],[25*s,-53*s],[19*s,-51*s]],'#f0b030');
  if(o.sleep)ln([[13*s,-56*s],[17*s,-56*s]],LINE,1.6*s);else circ(15*s,-56*s,1.8*s,LINE);X.restore()}
 function tallulah(x,y,h,t,o={}){const s=h/60;X.save();X.translate(x,y);if(o.flip)X.scale(-1,1);X.beginPath();X.moveTo(-12*s,-14*s);X.quadraticCurveTo(-34*s,-20*s,-28*s,-44*s);X.strokeStyle='#8a5a32';X.lineWidth=4*s;X.stroke();
  ell(0,-18*s,14*s,16*s,'#b07a4a',LINE,2*s);ell(-6*s,-2*s,6*s,4*s,'#8a5a32');ell(6*s,-2*s,6*s,4*s,'#8a5a32');circ(0,-42*s,13*s,'#b07a4a',LINE,2*s);circ(-12*s,-44*s,5*s,'#f0b8a0',LINE,1.5*s);circ(12*s,-44*s,5*s,'#f0b8a0',LINE,1.5*s);ell(0,-39*s,9*s,8*s,'#f4c2b0');
  if(o.sleep){ln([[-5*s,-43*s],[-1*s,-43*s]],LINE,1.6*s);ln([[2*s,-43*s],[6*s,-43*s]],LINE,1.6*s)}else{circ(-3*s,-43*s,1.8*s,LINE);circ(4*s,-43*s,1.8*s,LINE)}X.beginPath();X.arc(0,-37*s,3*s,0.2,Math.PI-0.2);X.strokeStyle=LINE;X.lineWidth=1.3*s;X.stroke();
  heart(8*s,-56*s,4.5*s,'#ff5d8f');X.restore()}
 function rat(x,y,h,g,t,o={}){const s=h/30;X.save();X.translate(x,y);if(o.flip)X.scale(-1,1);const gg=Object.assign({},g||{},{flip:false});X.beginPath();X.moveTo(-14*s,-8*s);X.quadraticCurveTo(-30*s,-4*s,-34*s,-14*s);X.strokeStyle='#e8a0a8';X.lineWidth=2*s;X.stroke();
  quadLegs(gg,[[-8*s,-8*s,0],[8*s,-8*s,0.5]],8*s,7*s,3*s,'#6b6f80',3*s,s);ell(0,-12*s,16*s,9*s,'#8d92a6',LINE,1.5*s);circ(15*s,-16*s,7*s,'#9aa0b4',LINE,1.5*s);circ(11*s,-23*s,4*s,'#f2b8c6',LINE,1*s);circ(22*s,-15*s,1.8*s,'#ff8fa8');circ(16*s,-18*s,1.5*s,LINE);
  if(o.herb){ln([[20*s,-12*s],[28*s,-4*s]],'#6a8a2a',2*s);ell(28*s,-4*s,5*s,3*s,'#ff9a3c')}X.restore()}
 function croc(x,y,h,t,o={}){const s=h/30;X.save();X.translate(x,y);if(o.flip)X.scale(-1,1);const sw=Math.sin(t*3)*3*s;
  X.beginPath();X.moveTo(-50*s,-2*s);X.quadraticCurveTo(-30*s,-14*s+sw,0,-14*s);X.lineTo(40*s,-10*s);X.quadraticCurveTo(50*s,-6*s,48*s,0);X.lineTo(-50*s,0);X.closePath();X.fillStyle=o.calm?'#5fbf6a':'#3d8f4a';X.fill();X.strokeStyle=LINE;X.lineWidth=2*s;X.stroke();
  for(let i=0;i<6;i++)poly([[-34*s+i*10*s,-11*s],[-30*s+i*10*s,-17*s],[-26*s+i*10*s,-11*s]],'#2e7a3b');circ(12*s,-16*s,5*s,'#e8f5c8',LINE,1.5*s);circ(13*s,-16*s,2*s,LINE);if(o.calm){heart(14*s,-32*s,6*s);X.beginPath();X.arc(36*s,-6*s,5*s,0.2,Math.PI-0.4);X.strokeStyle=LINE;X.stroke()}X.restore()}
 function dolphin(x,y,h,t,o={}){const s=h/40;X.save();X.translate(x,y);if(o.flip)X.scale(-1,1);X.rotate(Math.sin(t*2.4)*0.06);X.beginPath();X.moveTo(-40*s,-4*s);X.quadraticCurveTo(-10*s,-26*s,26*s,-12*s);X.quadraticCurveTo(40*s,-8*s,46*s,-4*s);X.quadraticCurveTo(30*s,2*s,10*s,6*s);X.quadraticCurveTo(-20*s,8*s,-40*s,-4*s);X.fillStyle='#6fa6c8';X.fill();X.strokeStyle=LINE;X.lineWidth=2*s;X.stroke();
  poly([[-4*s,-18*s],[4*s,-30*s],[8*s,-16*s]],'#5a8fb0',LINE,1.5*s);poly([[-40*s,-4*s],[-52*s,-14*s],[-48*s,0],[-52*s,8*s]],'#5a8fb0',LINE,1.5*s);ell(10*s,2*s,14*s,4*s,'#dff0fa');circ(28*s,-10*s,2*s,LINE);X.restore()}
 function bird(x,y,h,t,o={}){const s=h/20,f=Math.sin(t*14)*0.7;X.save();X.translate(x,y);if(o.flip)X.scale(-1,1);ell(0,0,10*s,7*s,'#3b8cff',LINE,1.5*s);X.save();X.rotate(-0.3+f);ell(-3*s,-4*s,8*s,4*s,'#2a6fe0',LINE,1*s);X.restore();circ(9*s,-5*s,5*s,'#3b8cff',LINE,1.5*s);poly([[13*s,-6*s],[17*s,-5*s],[13*s,-3*s]],'#f0b030');circ(10*s,-6*s,1.2*s,LINE);ell(2*s,3*s,5*s,3*s,'#ffb6a0');X.restore()}
 /* ---------- people (static, gently breathing) ---------- */
 function person(x,y,h,t,p={}){const s=h/200,br=Math.sin(t*1.6+(p.ph||0))*0.8*s;X.save();X.translate(x,y);if(p.flip)X.scale(-1,1);X.lineWidth=2*s;
  const skin=p.skin||'#f1c6a0',hair=p.hair||'#3a2418';
  if(p.hairLong){rr(-26*s,-182*s,52*s,90*s,20*s,hair,LINE,2*s)}
  if(p.cape)poly([[-24*s,-148*s],[24*s,-148*s],[40*s,-6*s],[-40*s,-6*s]],p.cape,LINE,2*s);
  if(p.gown){X.beginPath();X.moveTo(-18*s,-120*s);X.lineTo(18*s,-120*s);X.quadraticCurveTo(26*s,-60*s,48*s,0);X.lineTo(-48*s,0);X.quadraticCurveTo(-26*s,-60*s,-18*s,-120*s);X.fillStyle=p.gown;X.fill();X.strokeStyle=LINE;X.stroke();if(p.trim)ln([[-46*s,-4*s],[46*s,-4*s]],p.trim,4*s)}
  else{rr(-15*s,-90*s,13*s,88*s,5*s,p.pants||'#2a3a6a',LINE,2*s);rr(2*s,-90*s,13*s,88*s,5*s,p.pants||'#2a3a6a',LINE,2*s);ell(-9*s,-2*s,12*s,5*s,'#3a2418');ell(9*s,-2*s,12*s,5*s,'#3a2418')}
  rr(-21*s,-150*s+br,42*s,p.gown?44*s:68*s,12*s,p.top||p.gown||'#3a6fd8',LINE,2*s);if(p.sash)ln([[-18*s,-146*s+br],[18*s,-100*s+br]],p.sash,6*s);
  for(const sd of[-1,1]){ln([[sd*20*s,-142*s+br],[sd*26*s,-110*s],[sd*24*s,-84*s]],LINE,13*s);ln([[sd*20*s,-142*s+br],[sd*26*s,-110*s],[sd*24*s,-84*s]],p.sleeve||p.top||p.gown,10*s);circ(sd*24*s,-80*s,6*s,skin,LINE,1.5*s)}
  rr(-6*s,-162*s+br,12*s,14*s,4*s,skin);circ(0,-176*s+br,20*s,skin,LINE,2*s);
  X.beginPath();X.arc(0,-180*s+br,21*s,Math.PI*1.05,Math.PI*1.95);X.lineTo(14*s,-186*s+br);X.quadraticCurveTo(0,-176*s+br,-14*s,-186*s+br);X.closePath();X.fillStyle=hair;X.fill();
  if(p.bun)circ(0,-200*s+br,10*s,hair,LINE,1.5*s);if(p.tall){rr(-16*s,-222*s+br,32*s,30*s,14*s,hair,LINE,1.5*s)}
  circ(-7*s,-176*s+br,2.2*s,LINE);circ(7*s,-176*s+br,2.2*s,LINE);X.beginPath();if(p.frown)X.arc(0,-162*s+br,5*s,Math.PI+0.4,-0.4);else X.arc(0,-168*s+br,5*s,0.3,Math.PI-0.3);X.strokeStyle=LINE;X.lineWidth=1.6*s;X.stroke();
  if(p.brows){ln([[-11*s,-184*s+br],[-3*s,-181*s+br]],LINE,2*s);ln([[11*s,-184*s+br],[3*s,-181*s+br]],LINE,2*s)}
  if(p.beard)X.fillStyle=hair,X.beginPath(),X.arc(0,-168*s+br,16*s,0.1,Math.PI-0.1),X.fill();
  ell(-12*s,-169*s+br,4*s,2.5*s,'rgba(255,120,140,.35)');ell(12*s,-169*s+br,4*s,2.5*s,'rgba(255,120,140,.35)');
  if(p.crown)crown(0,(p.tall?-218:-194)*s+br,26*s,p.crown);if(p.tiara)crown(0,-195*s+br,18*s,p.tiara);X.restore()}
 const CAST={
  antonio:{top:'#2f5fc4',pants:'#f3efe6',hair:'#3a2418',sash:'#ffd23f',sleeve:'#2f5fc4'},
  king:{top:'#8a2be2',pants:'#3a2a5a',hair:'#b8b8c8',beard:1,crown:'#ffd23f',cape:'#c0392b',frown:1,brows:1},
  danielle:{gown:'#e0789a',hair:'#8a5a2a',bun:1,tiara:'#ffd23f',trim:'#fff'},
  ariana:{gown:'#5a2a8a',hair:'#1e1428',tall:1,crown:'#c9c9d9',brows:1,trim:'#c9a0ff'},
  luciana:{gown:'#ff9ec7',hair:'#f2d17a',hairLong:1,tiara:'#ffd23f',trim:'#fff'},
  rita:{gown:'#ff9a3c',hair:'#5a3a1a',hairLong:1,tiara:'#ffd23f'},sofia:{gown:'#4cc3a0',hair:'#2a1a10',bun:1,tiara:'#ffd23f'},gina:{gown:'#f7d84a',hair:'#c05a2a',hairLong:1,tiara:'#ffd23f'},
  marissa:{gown:'#7b3fb5',hair:'#d9b36a',hairLong:1,crown:'#ffd23f',trim:'#ffd23f'},
  guard:{top:'#c0392b',pants:'#2a2a3a',hair:'#3a2418',sash:'#ffd23f',crown:null},sailor:{top:'#e9e9f2',pants:'#2a3a6a',hair:'#6a4a2a',sash:'#2a3a6a',brows:1},
  frazer:{top:'#6a8a4a',pants:'#e9dcc0',hair:'#9a9aa8',beard:1},lorenzo:{top:'#fff',pants:'#4a4a5a',hair:'#3a3a3a'}};
 return{use,circ,ell,poly,rr,ln,grad,sky,sun,cloud,clouds,sea,palm,bush,islandBg,waterfall,palaceHall,ballroom,greenhouse,garden,shipSide,banner,crown,sparkle,heart,
  gaitStep,sagi,tika,azul,tallulah,rat,croc,dolphin,bird,person,CAST,LINE}})();
