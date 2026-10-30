/* AshRig: Ashlin's jointed cutout. Same gait math as KneeRig (kneerig.js: 2-bone IK knees, planted foot moves at exactly
   ground speed, cadence walk ~1.7 / run ~2.8 steps/s, arms swing opposite the legs with elbows, 150 ms blend to standing),
   but the limbs are drawn as clean vector capsules from the joint list in assets/ashlin-*.json, and the image file is only
   head + hair + torso + skirt. So a photo can replace the PNG (or just the face) and the legs/arms still animate. */
const AshRig=(()=>{
 const cache=new Map();
 function prep(R){let P=cache.get(R);if(P)return P;
  const legs=R.legs.map(l=>{const d=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]),g=(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0]);
   const L1=d(l.h,l.k),L2=d(l.k,l.a),t0=g(l.h,l.k),s0=g(l.k,l.a),b0=g(l.h,l.a);let side=Math.atan2(Math.sin(t0-b0),Math.cos(t0-b0));side=Math.abs(side)>0.06?Math.sign(side):0;
   return{l,L1,L2,t0,s0,side}});
  let cr=0;for(const g of legs){const l=g.l,R2=0.97*(g.L1+g.L2);for(let c=0;c<40;c+=0.25){if(Math.hypot(R.S/2+Math.abs(l.a[0]-l.h[0]),l.a[1]-l.h[1]-c)<=R2){cr=Math.max(cr,c);break}}}
  P={legs,arms:R.arms.map(m=>({m})),cr};cache.set(R,P);return P}
 const rot=(x,y,a)=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];
 function seg(x,pts,r){x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)x.lineTo(pts[i][0],pts[i][1]);x.lineWidth=r*2;x.stroke()}
 function limb(x,R,chain,rad,end){/* outline pass then fill pass so joints are seamless */
  const ow=R.outline||2;x.lineCap='round';x.lineJoin='round';
  for(const pass of[0,1]){x.strokeStyle=pass?R.limb:R.line;const e=pass?0:ow;
   for(let i=0;i<chain.length-1;i++)seg(x,[chain[i],chain[i+1]],rad[i]+e);
   if(end){x.fillStyle=pass?R.limb:R.line;x.beginPath();x.arc(end[0],end[1],end[2]+e,0,7);x.fill()}}}
 function legDraw(x,R,L){const l=L.g.l,fa=[l.f[0]-l.a[0],l.f[1]-l.a[1]],fb=[l.f[2]-l.a[0],l.f[3]-l.a[1]],A=rot(fa[0],fa[1],L.fr),B=rot(fb[0],fb[1],L.fr);
  limb(x,R,[[L.hx,L.hy],[L.kx,L.ky],[L.ax,L.ay]],[l.rt,l.rs]);limb(x,R,[[L.ax+A[0],L.ay+A[1]],[L.ax+B[0],L.ay+B[1]]],[l.rf])}
 function armDraw(x,R,M){const m=M.g.m,w=rot(m.w[0]-m.e[0],m.w[1]-m.e[1],M.fa);const wx=M.ex+w[0],wy=M.ey+w[1];
  limb(x,R,[[M.sx,M.sy],[M.ex,M.ey],[wx,wy]],[m.ru,m.rf],[wx,wy,m.hand||m.rf+1])}
 /* o: per-character state. x: world x. k: world px per art px. flip: facing left. on: feet on the ground */
 function step(o,x,k,flip,R,on){return KneeRig.step(o,x,k,flip,R,on)}
 /* draw in art space (ctx already translated/scaled so 1 unit = 1 art px, top-left of the art at 0,0) */
 function draw(x,ch,o){const R=ch.R,P=prep(R),Q=KneeRig.pose(P,R,o||{});o&&(o._kf=Q.legs.map(L=>[L.ax,L.ay,L.stance]));
  for(const M of Q.arms)if(M.g.m.far)armDraw(x,R,M);
  for(const L of Q.legs)if(L.g.l.far)legDraw(x,R,L);
  for(const L of Q.legs)if(!L.g.l.far)legDraw(x,R,L);
  x.drawImage(ch.img,0,Q.by,R.w,R.h);
  if(ch.face&&ch.face.width){const h=R.head;x.save();x.beginPath();x.arc(h[0],h[1]+Q.by,h[2],0,7);x.clip();
   const s=Math.max(2*h[2]/ch.face.width,2*h[2]/ch.face.height);x.drawImage(ch.face,h[0]-ch.face.width*s/2,h[1]+Q.by-ch.face.height*s/2,ch.face.width*s,ch.face.height*s);x.restore();
   x.strokeStyle=R.line;x.lineWidth=R.outline||2;x.beginPath();x.arc(h[0],h[1]+Q.by,h[2],0,7);x.stroke()}
  for(const M of Q.arms)if(!M.g.m.far)armDraw(x,R,M);
  return Q}
 /* load one version: assets/ashlin-<v>.png + assets/ashlin-<v>.json, plus an optional face photo named in assets/photos.json */
 let photos=null;
 async function load(v){const q='?v='+(window.GAMEV||1);if(!photos)photos=await fetch('assets/photos.json'+q).then(r=>r.json()).catch(()=>({}));
  const R=await (await fetch('assets/ashlin-'+v+'.json'+q)).json();
  const img=new Image();img.src='assets/ashlin-'+v+'.png'+q;await img.decode().catch(()=>{});
  const ch={R,img,face:null},fn=photos[v+'Face'];
  if(fn){const f=new Image();f.onload=()=>{ch.face=f};f.src='assets/'+fn+q}return ch}
 return{prep,step,draw,load}})();
