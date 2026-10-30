/* Original music + sound effects, all synthesized live with WebAudio (no audio files, nothing copied). */
const Sound=(()=>{
 let ac=null,master,mus,sfx,bus,on=true,cur=null,timer=null,tStart=0;
 const NOTE={C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11,Bb:10,Eb:3,Ab:8};
 function hz(n){const m=/^([A-G][#b]?)(\d)$/.exec(n);if(!m)return 0;return 440*Math.pow(2,(NOTE[m[1]]+12*(+m[2]+1)-69)/12)}
 function init(){if(ac)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ac=new C();
  master=ac.createGain();master.gain.value=on?0.9:0;master.connect(ac.destination);
  mus=ac.createGain();mus.gain.value=0.32;mus.connect(master);sfx=ac.createGain();sfx.gain.value=0.55;sfx.connect(master);bus=mus;
  /* soft hall reverb (generated impulse) on music and effects */
  try{const len=ac.sampleRate*2.2,ir=ac.createBuffer(2,len,ac.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
   const cv=ac.createConvolver();cv.buffer=ir;const rg=ac.createGain();rg.gain.value=0.22;cv.connect(rg);rg.connect(master);mus.connect(cv);const sg=ac.createGain();sg.gain.value=0.5;sfx.connect(sg);sg.connect(cv)}catch(e){}
  try{const s=localStorage.getItem('aip-sound');if(s==='0')setOn(false)}catch(e){}}
 function unlock(){init();if(ac&&ac.state==='suspended')ac.resume()}
 function setOn(v){on=v;if(master)master.gain.setTargetAtTime(v?0.9:0,ac.currentTime,0.05);try{localStorage.setItem('aip-sound',v?'1':'0')}catch(e){}}
 function env(g,t,a,d,peak,sus,rel,len){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(Math.max(0.0001,peak*sus),t+a+d);
  g.gain.setValueAtTime(Math.max(0.0001,peak*sus),t+len);g.gain.exponentialRampToValueAtTime(0.0001,t+len+rel)}
 function voice(type,f,t,len,vol,dest,opt={}){if(!f)return;const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
  if(opt.slide)o.frequency.exponentialRampToValueAtTime(opt.slide,t+len);
  let node=o;if(opt.lp){const fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=opt.lp;o.connect(fl);node=fl}
  node.connect(g);g.connect(dest);env(g,t,opt.a||0.008,opt.d||0.15,vol,opt.s===undefined?0.3:opt.s,opt.r||0.18,len);o.start(t);o.stop(t+len+(opt.r||0.18)+0.05)}
 function noise(t,len,vol,dest,hp){const n=Math.floor(ac.sampleRate*len),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type=hp?'highpass':'lowpass';f.frequency.value=hp||800;const g=ac.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(dest);s.start(t)}
 const INST={
  pluck:(f,t,l,v)=>{voice('sine',f,t,Math.min(l,0.25),v,bus,{d:0.12,s:0.25,r:0.3});voice('sine',f*4,t,0.05,v*0.18,bus,{d:0.04,s:0.1,r:0.06})},
  bell:(f,t,l,v)=>{voice('sine',f,t,l,v*0.8,bus,{d:0.3,s:0.3,r:0.6});voice('sine',f*2.01,t,0.2,v*0.25,bus,{d:0.15,s:0.1,r:0.3})},
  flute:(f,t,l,v)=>voice('triangle',f,t,l*0.95,v,bus,{a:0.04,d:0.1,s:0.75,r:0.12,lp:2600}),
  pad:(f,t,l,v)=>{voice('triangle',f,t,l,v*0.5,bus,{a:0.25,d:0.3,s:0.8,r:0.5,lp:1200});voice('sine',f*1.5,t,l,v*0.2,bus,{a:0.3,d:0.3,s:0.8,r:0.5})},
  bass:(f,t,l,v)=>voice('triangle',f,t,l*0.9,v,bus,{d:0.1,s:0.6,r:0.1,lp:700}),
  pizz:(f,t,l,v)=>voice('sawtooth',f,t,0.12,v*0.5,bus,{d:0.08,s:0.15,r:0.12,lp:1500}),
  hat:(f,t,l,v)=>noise(t,0.05,v*0.5,bus,6000),
  kick:(f,t,l,v)=>voice('sine',140,t,0.12,v*1.2,bus,{slide:45,d:0.1,s:0.2,r:0.08}),
  shaker:(f,t,l,v)=>noise(t,0.08,v*0.35,bus,4000)};
 /* tracks: tokens per step; '-' holds the previous note, '.' rest. All melodies original. */
 const T={
  island:{bpm:100,div:2,parts:[
   ['pluck',0.30,'E5 G5 A5 G5 E5 D5 C5 D5 E5 . G5 . A5 C6 A5 G5 E5 G5 A5 C6 D6 C6 A5 G5 A5 . G5 E5 D5 . C5 .'],
   ['bass',0.34,'C3 . . . G2 . . . A2 . . . E2 . . . F2 . . . C3 . . . G2 . . . C3 . G2 .'],
   ['pad',0.16,'C4 - - - - - - - A3 - - - - - - - F3 - - - - - - - G3 - - - - - - -'],
   ['shaker',0.4,'x . x x x . x x x . x x x . x x x . x x x . x x x . x x x . x x']]},
  story:{bpm:76,div:2,parts:[
   ['bell',0.22,'E5 . . . G5 . . . A5 . . . G5 . E5 . D5 . . . E5 . . . C5 . . . . . . .'],
   ['pad',0.2,'C4 - - - - - - - A3 - - - - - - - F3 - - - - - - - G3 - - - - - - -']]},
  voyage:{bpm:112,div:3,parts:[
   ['flute',0.22,'D5 - E5 F#5 - A5 B5 - A5 F#5 - E5 D5 - - A4 - - B4 - D5 E5 - F#5 E5 - D5 B4 - A4 D5 - - - - -'],
   ['bass',0.34,'D3 . . A2 . . G2 . . D3 . . B2 . . G2 . . A2 . . D3 . .'],
   ['pluck',0.12,'D4 F#4 A4 D4 F#4 A4 G4 B4 D5 D4 F#4 A4 B3 D4 F#4 G3 B3 D4 A3 C#4 E4 D4 F#4 A4']]},
  palace:{bpm:104,div:2,parts:[
   ['flute',0.2,'G5 . D5 . G5 A5 B5 . A5 . G5 . E5 . D5 . C5 . E5 . G5 . C6 . B5 . A5 . G5 . . .'],
   ['pizz',0.25,'G3 D4 B3 D4 G3 D4 B3 D4 C4 E4 G3 E4 D4 F#4 A3 F#4 C4 E4 A3 E4 G3 B3 D4 B3 D4 F#4 A3 F#4 G3 D4 G3 .'],
   ['bass',0.3,'G2 . . . G2 . . . C3 . . . D3 . . . A2 . . . G2 . . . D3 . . . G2 . . .']]},
  waltz:{bpm:120,div:1,parts:[
   ['flute',0.24,'A5 - C6 Bb5 - G5 A5 - F5 C5 - - D5 - F5 E5 - G5 F5 - A5 C6 - - A5 - C6 D6 - C6 Bb5 - G5 A5 - - F5 - - G5 - A5 Bb5 - D6 C6 - A5 F5 - -'],
   ['bass',0.34,'F2 . . C3 . . F2 . . C3 . . Bb2 . . C3 . . F2 . . F2 . . D3 . . G2 . . C3 . . F2 . . C3 . . Bb2 . . C3 . . F2 . .'],
   ['pluck',0.12,'. A4 A4 . G4 G4 . A4 A4 . A4 A4 . F4 F4 . G4 G4 . A4 A4 . A4 A4 . F4 F4 . D4 D4 . E4 E4 . A4 A4 . G4 G4 . F4 F4 . E4 E4 . A4 A4']]},
  danger:{bpm:124,div:2,parts:[
   ['pizz',0.32,'A4 . C5 . E5 . C5 . A4 . D5 . F5 . D5 . G#4 . B4 . E5 . B4 . A4 C5 E5 A5 E5 C5 A4 .'],
   ['bass',0.32,'A2 . A2 . A2 . A2 . D2 . D2 . D2 . D2 . E2 . E2 . E2 . E2 . A2 . E2 . A2 . . .'],
   ['hat',0.3,'x . x . x . x . x . x . x . x . x . x . x . x . x . x . x x x x']]},
  garden:{bpm:88,div:2,parts:[
   ['bell',0.22,'E5 . B4 . D5 . E5 . F#5 . E5 . D5 . B4 . A4 . B4 . D5 . E5 . B4 . . . . . . .'],
   ['pad',0.2,'E3 - - - - - - - D3 - - - - - - - A3 - - - - - - - E3 - - - - - - -']]},
  dance:{bpm:118,div:2,parts:[
   ['pluck',0.28,'C5 E5 G5 E5 C6 . G5 . A5 F5 C5 F5 A5 . C6 . G5 E5 C5 E5 G5 . B5 . C6 . G5 . E5 . C5 .'],
   ['bass',0.34,'C3 . C3 . G2 . G2 . F2 . F2 . F2 . A2 . G2 . G2 . G2 . B2 . C3 . G2 . C3 . . .'],
   ['kick',0.3,'x . . . x . . . x . . . x . . . x . . . x . . . x . . . x . x .'],
   ['shaker',0.4,'. . x . . . x . . . x . . . x . . . x . . . x . . . x . . . x .']]},
  /* the lullaby (original tune) */
  lullaby:{bpm:72,div:2,parts:[
   ['bell',0.26,'C5 - E5 - G5 - E5 - F5 - A5 - G5 - - - E5 - D5 - C5 - D5 - E5 - - - - - - -'],
   ['pad',0.18,'C4 - - - - - - - F3 - - - - - - - A3 - - - - - - - G3 - - - - - - -']]},
  finale:{bpm:108,div:2,parts:[
   ['flute',0.24,'C5 . E5 . G5 . C6 . B5 . G5 . A5 . . . F5 . A5 . C6 . E6 . D6 . C6 . B5 . . .'],
   ['pluck',0.16,'C4 E4 G4 E4 C4 E4 G4 E4 G3 B3 D4 B3 A3 C4 E4 C4 F3 A3 C4 A3 F3 A3 C4 A3 G3 B3 D4 B3 G3 B3 D4 B3'],
   ['bass',0.32,'C3 . . . G2 . . . A2 . . . A2 . . . F2 . . . F2 . . . G2 . . . G2 . . .'],
   ['shaker',0.35,'x . x . x . x . x . x . x . x . x . x . x . x . x . x . x . x .']]}};
 for(const k in T)T[k].parts=T[k].parts.map(([i,v,s])=>({i,v,tok:s.trim().split(/\s+/)}));
 function play(name){init();if(!ac)return;if(cur&&cur.name===name)return;stop();const tr=T[name];if(!tr)return;
  const sd=60/tr.bpm/tr.div,len=Math.max(...tr.parts.map(p=>p.tok.length));let step=0,next=ac.currentTime+0.08;tStart=next;cur={name,sd,len,t0:next};
  const g=ac.createGain();g.gain.setValueAtTime(0.0001,next);g.gain.exponentialRampToValueAtTime(1,next+0.7);g.connect(mus);cur.g=g;
  timer=setInterval(()=>{if(!ac)return;bus=g;while(next<ac.currentTime+0.25){for(const p of tr.parts){const tk=p.tok[step%p.tok.length];if(tk==='.'||tk==='-')continue;
     let l=1;while(p.tok[(step+l)%p.tok.length]==='-'&&l<16)l++;const f=tk==='x'?1:hz(tk);if(f)INST[p.i](f,next,l*sd,p.v)}
    step++;next+=sd}},60)}
 function stop(){if(timer)clearInterval(timer);timer=null;if(cur&&cur.g&&ac){const g=cur.g,t=ac.currentTime;try{g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(Math.max(0.0001,g.gain.value),t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.6);setTimeout(()=>{try{g.disconnect()}catch(e){}},1500)}catch(e){}}cur=null}
 function time(){return ac?ac.currentTime:0}
 function info(){return cur}
 function note(n,len=0.5,inst='bell',vol=0.4){init();if(!ac||!on)return;const f=hz(n);if(inst==='bell'){voice('sine',f,ac.currentTime,len,vol,sfx,{d:0.3,s:0.35,r:0.5});voice('sine',f*2.01,ac.currentTime,0.2,vol*0.2,sfx,{d:0.15,s:0.1,r:0.3})}}
 const FX={
  tap:()=>voice('sine',880,ac.currentTime,0.05,0.25,sfx,{d:0.04,s:0.2,r:0.05}),
  good:()=>{const t=ac.currentTime;['C6','E6','G6'].forEach((n,i)=>voice('sine',hz(n),t+i*0.06,0.1,0.25,sfx,{d:0.08,s:0.3,r:0.15}))},
  star:()=>{const t=ac.currentTime;['G5','C6','E6','G6','C7'].forEach((n,i)=>voice('triangle',hz(n),t+i*0.07,0.12,0.22,sfx,{d:0.1,s:0.3,r:0.2}))},
  bad:()=>voice('triangle',160,ac.currentTime,0.18,0.3,sfx,{slide:110,d:0.1,s:0.4,r:0.12}),
  jump:()=>voice('sine',330,ac.currentTime,0.16,0.22,sfx,{slide:720,d:0.1,s:0.4,r:0.08}),
  collect:()=>{const t=ac.currentTime;voice('sine',hz('E6'),t,0.08,0.22,sfx,{d:0.05,s:0.3,r:0.1});voice('sine',hz('B6'),t+0.06,0.1,0.2,sfx,{d:0.06,s:0.3,r:0.15})},
  splash:()=>noise(ac.currentTime,0.45,0.5,sfx,0),
  squeak:()=>voice('sine',1500,ac.currentTime,0.08,0.18,sfx,{slide:2200,d:0.05,s:0.3,r:0.05}),
  chomp:()=>voice('square',120,ac.currentTime,0.08,0.12,sfx,{slide:70,d:0.05,s:0.3,r:0.05,lp:800}),
  page:()=>noise(ac.currentTime,0.12,0.18,sfx,2500),
  whoosh:()=>noise(ac.currentTime,0.3,0.3,sfx,1200),
  sparkle:()=>{const t=ac.currentTime;['E7','B6','G#7'].forEach((n,i)=>voice('sine',hz(n),t+i*0.05,0.06,0.12,sfx,{d:0.05,s:0.2,r:0.2}))},
  fanfare:()=>{const t=ac.currentTime;[['C5',0],['E5',0.12],['G5',0.24],['C6',0.36]].forEach(([n,d])=>{voice('triangle',hz(n),t+d,0.22,0.2,sfx,{d:0.1,s:0.5,r:0.3});voice('sine',hz(n)/2,t+d,0.22,0.12,sfx,{d:0.1,s:0.5,r:0.3})});voice('triangle',hz('C6'),t+0.5,0.8,0.2,sfx,{d:0.2,s:0.6,r:0.6});voice('triangle',hz('E6'),t+0.5,0.8,0.14,sfx,{d:0.2,s:0.6,r:0.6})},
  swish:()=>noise(ac.currentTime,0.18,0.16,sfx,3200),
  stir:()=>voice('sine',520,ac.currentTime,0.12,0.12,sfx,{slide:620,d:0.08,s:0.3,r:0.08})};
 function fx(n){init();if(!ac||!on||!FX[n])return;try{FX[n]()}catch(e){}}
 return{track:n=>T[n],unlock,play,stop,fx,note,setOn,isOn:()=>on,time,info,hz}})();
