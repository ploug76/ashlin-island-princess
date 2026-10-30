/* KneeRig (King Juju, Oct 30 2026): jointed limbs for single-pose art.
   Legs: thigh / shin / foot pieces cut from the art (capsules, image px) re-posed with 2-bone IK, so knees bend. The planted foot
   moves back at exactly ground speed (no foot slip); the swing foot kicks back, lifts and arcs forward.
   Cadence (Peter): walk ~1.5-2 steps/s, run ~2.5-3 steps/s; above that the stride gets longer (more air time), never faster legs.
   Arms: upper arm + forearm pieces, shoulder swings opposite the legs at the same rhythm, elbow bends more on the forward swing.
   Everything blends back to the art pose in ~150 ms when the character stops.
   Spec: {S stance sweep px, lift px, kick px (back-kick when running), s0 max stance fraction, vw walk speed / vr run speed (art px/s),
          bob px, kb knee side (+1/-1 image x; 0 = keep the art's bend),
          legs:[{h,k,a,f:[x0,y0,x1,y1],rt,rs,rf,o,far,sh,su}], arms:[{s,e,w,ru,rf,fp?:[[x,y]..] forearm+hand polygon,o,far,A,E}]} */
const KneeRig=(()=>{const C=new WeakMap(),PI=Math.PI,TAU=PI*2,K={clock:()=>performance.now()};
 function cap(x,a,b,r){const g=Math.atan2(b[1]-a[1],b[0]-a[0]);x.moveTo(a[0]+Math.sin(g)*r,a[1]-Math.cos(g)*r);x.arc(b[0],b[1],r,g-PI/2,g+PI/2);x.arc(a[0],a[1],r,g+PI/2,g+PI*1.5);x.closePath()}
 function poly(x,p){x.moveTo(p[0][0],p[0][1]);for(const q of p)x.lineTo(q[0],q[1]);x.closePath()}
 function cv(W,H){const o=document.createElement('canvas');o.width=W;o.height=H;return o}
 function piece(im,fn){const o=cv(im.width,im.height),x=o.getContext('2d');x.beginPath();fn(x);x.clip();x.drawImage(im,0,0);return o}
 function dark(src,W,H,clipY,al){const u=cv(W,H),x=u.getContext('2d');x.beginPath();x.rect(0,0,W,clipY);x.clip();x.drawImage(src,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(40,20,10,'+al+')';x.fillRect(0,0,W,H);return u}
 const ang=(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0]),dist=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
 function prep(im,R){let P=C.get(R);if(P&&P.im===im)return P;const W=im.width,H=im.height,body=cv(W,H),bx=body.getContext('2d');bx.drawImage(im,0,0);bx.globalCompositeOperation='destination-out';const U=[];
  const legs=(R.legs||[]).map(l=>{const f0=[l.f[0],l.f[1]],f1=[l.f[2],l.f[3]],e=l.e!==undefined?l.e:1;
   const ey=l.v?l.h[1]+(l.v.keep!==undefined?l.v.keep:0.5)*(l.k[1]-l.h[1]):l.h[1]+e;
   bx.save();bx.beginPath();bx.rect(0,ey,W,H);bx.clip();for(const q of[[l.h,l.k,l.rt],[l.k,l.a,l.rs],[f0,f1,l.rf]]){bx.beginPath();cap(bx,q[0],q[1],q[2]+(R.ep||0.6));bx.fill()}bx.restore();
   const L1=dist(l.h,l.k),L2=dist(l.k,l.a),t0=ang(l.h,l.k),s0=ang(l.k,l.a),b0=ang(l.h,l.a);let side=Math.atan2(Math.sin(t0-b0),Math.cos(t0-b0));side=Math.abs(side)>0.06?Math.sign(side):0;
   const ep=R.ep||0.6,th=piece(im,x=>{x.rect(0,l.h[1]-(l.ht!==undefined?l.ht:2),W,H);x.clip();x.beginPath();cap(x,l.h,l.k,l.rt+ep)});
   if(l.sh!==0&&!l.v)U.push(dark(th,W,H,l.h[1]+(l.k[1]-l.h[1])*(l.su||1),l.sh||0.4));
   return{l,L1,L2,t0,s0,side,th,sh:piece(im,x=>cap(x,l.k,l.a,l.rs+ep)),ft:piece(im,x=>cap(x,f0,f1,l.rf+ep))}});
  const arms=(R.arms||[]).map(m=>{const ep=R.ep||0.6,up=piece(im,x=>cap(x,m.s,m.e,m.ru+ep)),fo=piece(im,x=>m.fp?poly(x,m.fp):cap(x,m.e,m.w,m.rf+ep));
   bx.beginPath();cap(bx,m.s,m.e,m.ru+(R.ep||0.6));bx.fill();bx.beginPath();if(m.fp)poly(bx,m.fp);else cap(bx,m.e,m.w,m.rf+(R.ep||0.6));bx.fill();
   if(m.sh!==0)U.push(dark(up,W,H,H,m.sh||0.35));if(m.shf)U.push(dark(fo,W,H,H,m.shf));return{m,up,fo}});
  bx.globalCompositeOperation='destination-over';for(const u of U)bx.drawImage(u,0,0);
  let cr=0;for(const g of legs){const l=g.l,R2=0.97*(g.L1+g.L2);for(let c=0;c<40;c+=0.25){if(Math.hypot(R.S/2+Math.abs(l.a[0]-l.h[0]),l.a[1]-l.h[1]-c)<=R2){cr=Math.max(cr,c);break}}}
  P={im,body,legs,arms,cr};C.set(R,P);return P}
 /* cycles/s for a speed v (art px/s): ~0.85 (1.7 steps/s) walking at vw, ~1.4 (2.8 steps/s) running at vr and above */
 function cadence(R,v){const vw=R.vw||R.S*2,vr=R.vr||vw*3,r=Math.max(0,Math.min(1,(v-vw)/(vr-vw)));return (R.cw||0.85)+((R.cr||1.4)-(R.cw||0.85))*r}
 /* advance from world x (k = world px per art px, flip = art drawn mirrored, on = feet on the ground) */
 function step(o,x,k,flip,R,on){const n=K.clock(),dt=o._kt?Math.min(0.1,(n-o._kt)/1000):0;o._kt=n;o._kk=k;let dx=o._kx===undefined?0:x-o._kx;o._kx=x;
  if(Math.abs(dx)>120||on===false)dx=0;const di=dx/k*(flip?-1:1),ad=Math.abs(di);if(ad>0.03){o._km=n;o._kd=Math.sign(di)}const mv=on!==false&&o._km&&n-o._km<90;
  if(dt>0)o._kv=(o._kv||0)+(ad/dt-(o._kv||0))*Math.min(1,dt*6);const v=o._kv||0,D=Math.max(R.S/R.s0,v/cadence(R,v));o._kD=D;o._ku=((o._ku||0)+ad/D)%1;
  const tg=mv?1:0,a=o._ka||0;o._ka=a+Math.sign(tg-a)*Math.min(Math.abs(tg-a),dt/(R.bl||0.15));return o}
 function pose(P,R,o){const a0=o._ka||0,A=a0*a0*(3-2*a0),S=R.S,s=Math.min(R.s0,S/(o._kD||S/R.s0)),u=o._ku||0,dir=o._kd||1,run=Math.max(0,Math.min(1,(R.s0-s)/(R.s0*0.7)));
  const by=A*(P.cr+(R.bob||0)*(0.5+0.5*Math.cos(TAU*u*2))*(1-run*0.5)-run*(R.bob||0)*0.6*Math.max(0,Math.sin(TAU*u*2)));
  const legs=P.legs.map(g=>{const l=g.l,q=((u+(l.o||0))%1+1)%1;let X,Y=0,sw=0;if(q<s)X=S/2-S*q/s;else{const v=(q-s)/(1-s),e=v*v*(3-2*v);sw=Math.sin(PI*v);
    X=-S/2+S*e-run*(R.kick||0)*Math.sin(PI*Math.min(1,v*1.6));Y=-(R.lift*(1+run*0.6))*sw}
   const ax=l.a[0]+dir*X*A,ay=l.a[1]+Y*A,hx=l.h[0],hy=l.h[1]+by;let d=Math.hypot(ax-hx,ay-hy);d=Math.min(Math.max(d,Math.abs(g.L1-g.L2)+0.01),g.L1+g.L2-0.01);
   const base=Math.atan2(ay-hy,ax-hx),off=Math.acos(Math.max(-1,Math.min(1,(g.L1*g.L1+d*d-g.L2*g.L2)/(2*g.L1*d))));let sd=g.side;
   if(!sd){const kb=(R.kb||1);sd=Math.cos(base+off)*kb>=Math.cos(base-off)*kb?1:-1}const t=base+sd*off,kx=hx+g.L1*Math.cos(t),ky=hy+g.L1*Math.sin(t),st=Math.atan2(ay-ky,ax-kx);
   return{g,hx,hy,kx,ky,ax,ay,tr:t-g.t0,sr:st-g.s0,fr:(st-g.s0)*(R.fk!==undefined?R.fk:0.5)*sw*A,stance:q<s}});
  const arms=P.arms.map(g=>{const m=g.m,w=Math.cos(TAU*(u+(m.o||0))),Am=(m.A||0.3)*(1+run*0.5),Em=(m.E||0.35)*(1+run*0.6);
   const sa=-dir*Am*w*A,ea=-dir*(Em*(0.5+0.5*w)+run*0.25)*A,ex=m.s[0]+(m.e[0]-m.s[0])*Math.cos(sa)-(m.e[1]-m.s[1])*Math.sin(sa),ey=m.s[1]+by+(m.e[0]-m.s[0])*Math.sin(sa)+(m.e[1]-m.s[1])*Math.cos(sa);
   return{g,sx:m.s[0],sy:m.s[1]+by,sa,ex,ey,fa:sa+ea}});
  return{A,by,legs,arms}}
 function blit(x,img,p0,px,py,r){x.save();x.translate(px,py);if(r)x.rotate(r);x.translate(-p0[0],-p0[1]);x.drawImage(img,0,0);x.restore()}
 function vleg(x,L){const v=L.g.l.v,ol=v.ol||1.6;x.save();x.lineCap='round';x.lineJoin='round';
  const seg=(w,c)=>{x.strokeStyle=c;x.lineWidth=w[0];x.beginPath();x.moveTo(L.hx,L.hy);x.lineTo(L.kx,L.ky);x.stroke();x.lineWidth=w[1];x.beginPath();x.moveTo(L.kx,L.ky);x.lineTo(L.ax,L.ay);x.stroke()};
  seg([v.wt+ol*2,v.ws+ol*2],v.line);seg([v.wt,v.ws],v.col);if(v.hi){x.globalAlpha=0.35;seg([v.wt*0.35,v.ws*0.35],v.hi)}x.restore();blit(x,L.g.ft,L.g.l.a,L.ax,L.ay,L.fr)}
 function leg(x,L){const l=L.g.l;if(l.v)return vleg(x,L);blit(x,L.g.ft,l.a,L.ax,L.ay,L.fr);blit(x,L.g.sh,l.k,L.kx,L.ky,L.sr);blit(x,L.g.th,l.h,L.hx,L.hy,L.tr)}
 function arm(x,M){const m=M.g.m;blit(x,M.g.fo,m.e,M.ex,M.ey,M.fa);blit(x,M.g.up,m.s,M.sx,M.sy,M.sa)}
 /* draw in art space (ctx transformed so 1 unit = 1 art px, art top-left at 0,0) */
 function draw(x,im,R,o){if(!im||!im.width)return;const a=o&&o._ka||0;if(a<0.002){x.drawImage(im,0,0);return}const P=prep(im,R),Q=pose(P,R,o);o._kf=Q.legs.map(L=>[L.ax,L.ay,L.stance]);
  for(const M of Q.arms)if(M.g.m.far)arm(x,M);for(const L of Q.legs)if(L.g.l.far)leg(x,L);x.drawImage(P.body,0,Q.by);for(const L of Q.legs)if(!L.g.l.far)leg(x,L);for(const M of Q.arms)if(!M.g.m.far)arm(x,M)}
 K.step=step;K.draw=draw;K.pose=pose;K.prep=prep;K.cadence=cadence;return K})();
