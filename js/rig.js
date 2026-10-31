/* AshRig: Ashlin's jointed cutout. Same gait math as KneeRig (kneerig.js: 2-bone IK knees, planted foot moves at exactly
   ground speed, cadence walk ~1.7 / run ~2.8 steps/s, arms swing opposite the legs with elbows, 150 ms blend to standing),
   but the limbs are drawn as clean vector capsules from the joint list in assets/ashlin-*.json, and the image file is only
   head + hair + torso + skirt. The body is Ashlin's painted storybook art (tools/build_ashlin_art.py); the legs/arms animate on top. */
const AshRig=(()=>{
 const cache=new Map();
 function prep(R){let P=cache.get(R);if(P)return P;
  const legs=R.legs.map(l=>{const d=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]),g=(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0]);
   const L1=d(l.h,l.k),L2=d(l.k,l.a),t0=g(l.h,l.k),s0=g(l.k,l.a),b0=g(l.h,l.a);let side=Math.atan2(Math.sin(t0-b0),Math.cos(t0-b0));side=Math.abs(side)>0.06?Math.sign(side):0;
   return{l,L1,L2,t0,s0,side}});
  let cr=0;for(const g of legs){const l=g.l,R2=0.97*(g.L1+g.L2);for(let c=0;c<40;c+=0.25){if(Math.hypot(R.S/2+Math.abs(l.a[0]-l.h[0]),l.a[1]-l.h[1]-c)<=R2){cr=Math.max(cr,c);break}}}
  P={legs,arms:R.arms.map(m=>({m})),cr};cache.set(R,P);return P}
 const rot=(x,y,a)=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];
 /* tapered capsule from a (radius r0) to b (radius r1) */
 function tap(x,a,b,r0,r1){const g=Math.atan2(b[1]-a[1],b[0]-a[0]),PI=Math.PI;x.moveTo(a[0]+Math.sin(g)*r0,a[1]-Math.cos(g)*r0);x.lineTo(b[0]+Math.sin(g)*r1,b[1]-Math.cos(g)*r1);
  x.arc(b[0],b[1],r1,g-PI/2,g+PI/2);x.lineTo(a[0]-Math.sin(g)*r0,a[1]+Math.cos(g)*r0);x.arc(a[0],a[1],r0,g+PI/2,g+PI*1.5);x.closePath()}
 function shape(x,chain,rad,end,e){x.beginPath();for(let i=0;i<chain.length-1;i++)tap(x,chain[i],chain[i+1],rad[i]+e,rad[i+1]+e);
  if(end){const rx=end[2]*1.15+e,ra=end[3]||0;x.moveTo(end[0]+rx*Math.cos(ra),end[1]+rx*Math.sin(ra));x.ellipse(end[0],end[1],rx,end[2]*0.9+e,ra,0,Math.PI*2)}}
 /* painted-style limb: soft outline, skin fill, a light highlight down the front and a soft shade down the back; far limbs a touch darker.
    rad = radius at each joint (tapers between them); end = [x,y,r,angle] for a hand */
 function limb(x,R,chain,rad,end,far,col){const ow=R.outline||1,fill=col||R.limb;x.save();x.lineJoin='round';
  x.fillStyle=R.line;shape(x,chain,rad,end,ow);x.fill('nonzero');
  x.fillStyle=fill;shape(x,chain,rad,end,0);x.fill('nonzero');
  x.save();shape(x,chain,rad,end,0);x.clip('nonzero');
   if(R.hi){x.globalAlpha=0.45;x.fillStyle=R.hi;const off=chain.map((p,i)=>[p[0]+rad[i]*0.28,p[1]-rad[i]*0.15]);shape(x,off,rad.map(r=>r*0.32),null,0);x.fill('nonzero')}
   if(R.lo){x.globalAlpha=0.35;x.fillStyle=R.lo;const off=chain.map((p,i)=>[p[0]-rad[i]*0.75,p[1]]);shape(x,off,rad.map(r=>r*0.5),null,0);x.fill('nonzero')}
  x.restore();
  if(far&&R.shade){x.globalAlpha=R.shade;x.fillStyle='#5a2a14';shape(x,chain,rad,end,ow);x.fill('nonzero')}
  x.restore()}
 /* front view (standing: title, stories, idle in games): the foot points at the viewer, so it is drawn foreshortened in FRONT
    of the ankle: instep coming down toward us, rounded toes at the bottom, turned out a little, on a sandal sole (adult) or
    bare with little toe lines (child). The old side-view heel-to-toe capsule read as backwards feet (Peter, Oct 31). */
 function footFront(x,R,L){const l=L.g.l,rf=l.rf,far=l.far,ra=l.ra||l.rs*0.78,sgn=far?-1:1,out=sgn*rf*0.38,
   gy=L.ay+Math.max(l.f[1],l.f[3])+rf*0.9-l.a[1],fx=L.ax+out,ow=R.outline||1,sandal=R.foot&&R.foot!==R.limb,PI=Math.PI;
  if(sandal){x.save();x.fillStyle=R.line;x.beginPath();x.ellipse(fx,gy-rf*0.42,rf*1.55+ow,rf*0.5+ow,sgn*0.08,0,PI*2);x.fill();
   x.fillStyle=R.foot;x.beginPath();x.ellipse(fx,gy-rf*0.42,rf*1.55,rf*0.5,sgn*0.08,0,PI*2);x.fill();x.restore()}
  const ty=gy-(sandal?rf*1.25:rf*0.95);
  limb(x,R,[[L.ax,L.ay-rf*0.7],[L.ax+out*0.5,L.ay+rf*0.35],[fx,ty]],[ra*0.82,rf*0.95,rf*1.18],[fx,ty+rf*0.05,rf*1.12,sgn*0.12],far);
  x.save();x.strokeStyle=R.line;x.globalAlpha=0.55;x.lineWidth=Math.max(0.35,rf*0.1);x.lineCap='round';
  for(const d of[-0.45,0,0.45]){const tx=fx+d*rf*1.15;x.beginPath();x.moveTo(tx,ty+rf*0.55);x.lineTo(tx,ty+rf*0.95);x.stroke()}x.restore();
  if(sandal){x.save();x.strokeStyle=R.foot;x.lineWidth=rf*0.5;x.lineCap='round';x.beginPath();
   x.moveTo(fx-rf*1.15,ty-rf*0.05);x.quadraticCurveTo(fx,ty+rf*0.45,fx+rf*1.15,ty-rf*0.05);x.stroke();x.restore()}}
 function legDraw(x,R,L,front){const l=L.g.l,fa=[l.f[0]-l.a[0],l.f[1]-l.a[1]],fb=[l.f[2]-l.a[0],l.f[3]-l.a[1]],A=rot(fa[0],fa[1],L.fr),B=rot(fb[0],fb[1],L.fr),far=l.far;
  const rk=l.rk||(l.rt+l.rs)/2,ra=l.ra||l.rs*0.78;
  if(!front)limb(x,R,[[L.ax+A[0],L.ay+A[1]],[L.ax+B[0],L.ay+B[1]]],[l.rf,l.rf*0.9],null,far,R.foot);
  /* calf: a soft bulge a third of the way down the shin, toward the back of the leg */
  const dx=L.ax-L.kx,dy=L.ay-L.ky,dl=Math.hypot(dx,dy)||1,dir=(L.ax>=L.kx?1:1),cb=l.rs*0.22,cxp=L.kx+dx*0.33+(dy/dl)*cb*-1*(R.back||1)*0+(-dy/dl)*0,cyp=L.ky+dy*0.33;
  const nx=-dy/dl,ny=dx/dl,calf=[L.kx+dx*0.33-nx*cb,L.ky+dy*0.33-ny*cb];
  limb(x,R,[[L.hx,L.hy],[L.kx,L.ky],calf,[L.ax,L.ay-(front?l.rf*0.5:0)]],[l.rt,rk,l.rs*1.06,ra],null,far);if(front)footFront(x,R,L)}
 function armDraw(x,R,M){const m=M.g.m,w=rot(m.w[0]-m.e[0],m.w[1]-m.e[1],M.fa);const wx=M.ex+w[0],wy=M.ey+w[1];
  const re=m.re||(m.ru+m.rf)/2*0.95,rw=m.rw||m.rf*0.72,g=Math.atan2(wy-M.ey,wx-M.ex),hl=(m.hand||m.rf)*1.05;
  const fm=[M.ex+(wx-M.ex)*0.3,M.ey+(wy-M.ey)*0.3];
  limb(x,R,[[M.sx,M.sy],[M.ex,M.ey],fm,[wx,wy]],[m.ru,re,m.rf,rw],[wx+Math.cos(g)*hl,wy+Math.sin(g)*hl,m.hand||m.rf,g],m.far)}
 /* Side-view gait (profile art). Same clock/stride state as KneeRig (o._ku phase, o._kD cycle length, o._ka blend), but:
    - the hips ride up and down so the standing leg stays almost straight (no squat), lowest when both feet are down;
    - heel strikes first (toe up), then the foot rolls flat, then the heel lifts and the foot pushes off the toe;
    - the touching point (heel / sole / toe) moves back at exactly ground speed, so nothing slides. */
 function sidePose(P,R,o){const PI=Math.PI,TAU=PI*2,c01=v=>Math.max(0,Math.min(1,v)),ka=o._ka||0,A=ka*ka*(3-2*ka),S=R.S,s=Math.min(R.s0,S/(o._kD||S/R.s0)),u=o._ku||0,
   dir=o._kd||1,run=c01((R.s0-s)/(R.s0*0.7)),T1=R.toe!==undefined?R.toe:0.55,H1=R.heel!==undefined?R.heel:0.22,piv=(v,t)=>{const r=rot(v[0],v[1],t);return[v[0]-r[0],v[1]-r[1]]};
  const tg=P.legs.map(g=>{const l=g.l,q=((u+(l.o||0))%1+1)%1,st=q<s,fv=[l.f[2]-l.a[0],l.f[3]-l.a[1]],hv=[l.f[0]-l.a[0],l.f[1]-l.a[1]];let X,Y=0,th=0,off=[0,0],cp=[0,0];
   if(st){const qa=q/s;X=S/2-S*qa;
    cp=hv;if(qa>0.62){th=T1*((qa-0.62)/0.38)**2;off=piv(fv,th);cp=fv}else if(qa<0.14){th=-H1*(1-qa/0.14)**2;off=piv(hv,th)}}
   else{const v=(q-s)/(1-s),e=v*v*(3-2*v);X=-S/2+S*e-run*(R.kick||0)*Math.sin(PI*Math.min(1,v*1.6));
    /* lift: knee pulls the foot up early in the swing, then it reaches forward and comes down heel first */
    Y=-(R.lift*(1+run*1.1))*Math.sin(PI*Math.pow(v,0.8));
    if(v<0.4){const d=(1-v/0.4)**2;th=T1*d;const oe=piv(fv,T1);off=[oe[0]*d,oe[1]*d]}else if(v>0.72){const d=((v-0.72)/0.28)**2;th=-H1*d;const oe=piv(hv,-H1);off=[oe[0]*d,oe[1]*d]}}
   return{g,st,ax:l.a[0]+(dir*X+off[0])*A,ay:l.a[1]+(Y+off[1])*A,fr:th*A,cp,ci:cp===fv?1:0}});
  let drop=0;for(const t of tg){const g=t.g,l=g.l,Lm=0.985*(g.L1+g.L2),dx=t.ax-l.h[0],need=t.ay-Math.sqrt(Math.max(0,Lm*Lm-dx*dx))-l.h[1];if(need>drop)drop=need}
  const by=drop+A*run*(R.S*0.05);
  const legs=tg.map(t=>{const g=t.g,l=g.l,hx=l.h[0],hy=l.h[1]+by,ax=t.ax,ay=t.ay;let d=Math.hypot(ax-hx,ay-hy);d=Math.min(Math.max(d,Math.abs(g.L1-g.L2)+0.01),g.L1+g.L2-0.01);
   const base=Math.atan2(ay-hy,ax-hx),of=Math.acos(Math.max(-1,Math.min(1,(g.L1*g.L1+d*d-g.L2*g.L2)/(2*g.L1*d)))),sd=g.side||1,a=base+sd*of,kx=hx+g.L1*Math.cos(a),ky=hy+g.L1*Math.sin(a);
   const c=rot(t.cp[0],t.cp[1],t.fr);return{g,hx,hy,kx,ky,ax,ay,fr:t.fr,stance:t.st,cx:ax+c[0],cy:ay+c[1],ci:t.ci}});
  const arms=P.arms.map(g=>{const m=g.m,w=Math.cos(TAU*(u+(m.o||0))),Am=(m.A||0.3)*(1+run*0.6),Em=(m.E||0.35)*(1+run*0.9);
   const sa=-dir*Am*w*A,ea=-dir*(Em*(0.55+0.45*w)+run*0.35)*A,ex=m.s[0]+(m.e[0]-m.s[0])*Math.cos(sa)-(m.e[1]-m.s[1])*Math.sin(sa),ey=m.s[1]+by+(m.e[0]-m.s[0])*Math.sin(sa)+(m.e[1]-m.s[1])*Math.cos(sa);
   return{g,sx:m.s[0],sy:m.s[1]+by,sa,ex,ey,fa:sa+ea}});
  return{A,by,legs,arms,run}}
 /* o: per-character state. x: world x. k: world px per art px. flip: facing left. on: feet on the ground */
 /* Walking/running uses the side-view (profile) art so her face, body and feet all point the way she goes (Peter, Oct 30);
    the front art is only for standing still. o._sm = last time she moved sideways (in the air too), so a jump keeps the profile. */
 const SIDE_HOLD=260;
 function step(o,x,k,flip,R,on){const n=KneeRig.clock();if(o._sx!==undefined){const d=Math.abs(x-o._sx);if(d>0.05*k&&d<120)o._sm=n}o._sx=x;return KneeRig.step(o,x,k,flip,R,on)}
 function sideOn(ch,o){return !!(ch.side&&o&&o._sm&&KneeRig.clock()-o._sm<SIDE_HOLD)}
 /* draw in art space (ctx already translated/scaled so 1 unit = 1 art px, top-left of the art at 0,0) */
 function draw(x,ch,o){const sd=sideOn(ch,o);if(sd)ch=ch.side;const R=ch.R,P=prep(R),Q=sd?sidePose(P,R,o):KneeRig.pose(P,R,o||{});o&&(o._kf=Q.legs.map(L=>[L.cx!==undefined?L.cx:L.ax,L.cy!==undefined?L.cy:L.ay,L.stance,L.ci||0]),o._side=sd);
  /* profile: lean the upper body (torso + arms) a little forward from the hips, more when running */
  let lean=0,px=0,py=0;if(sd){lean=Q.A*((R.lean||0.035)+(R.leanRun||0.07)*Q.run);px=R.legs[0].h[0];py=R.legs[0].h[1]+Q.by}
  const up=()=>{if(lean){x.translate(px,py);x.rotate(lean);x.translate(-px,-py)}};
  x.save();up();for(const M of Q.arms)if(M.g.m.far)armDraw(x,R,M);x.restore();
  for(const L of Q.legs)if(L.g.l.far)legDraw(x,R,L,!sd);
  for(const L of Q.legs)if(!L.g.l.far)legDraw(x,R,L,!sd);
  x.save();up();x.drawImage(ch.img,0,Q.by,R.w,R.h);
  for(const M of Q.arms)if(!M.g.m.far)armDraw(x,R,M);x.restore();
  return Q}
 /* load one version: assets/ashlin-<v>.json (joints + colours) and the painted body it names (head, hair, torso, dress; no limbs) */
 async function load(v){const q='?v='+(window.GAMEV||1);
  const R=await (await fetch('assets/ashlin-'+v+'.json'+q)).json();
  const img=new Image();img.src='assets/'+(R.art||'ashlin-'+v+'.png')+q;await img.decode().catch(()=>{});
  const ch={R,img};
  /* side view (profile, facing right) for walking/running: assets/ashlin-<v>-side.json + its art; same frame, ground and gait numbers */
  try{const r=await fetch('assets/ashlin-'+v+'-side.json'+q);if(r.ok){const SR=await r.json(),si=new Image();si.src='assets/'+SR.art+q;await si.decode();ch.side={R:SR,img:si}}}catch(e){}
  return ch}
 return{prep,step,draw,load,sideOn}})();
