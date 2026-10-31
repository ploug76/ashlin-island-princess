/* Game flow: loading -> title -> chapter story -> how to play -> mini-game -> result -> story -> next chapter. */
let storyQ=null;
function setMode(m){G.mode=m;document.body.dataset.mode=m}
function goTitle(){setMode('title');G.game=null;G.paused=false;hud(false);$('pause').hidden=true;GFX.clearParticles();show('title');Sound.play('island');setTimeout(()=>$('bPlay').focus({preventScroll:true}),50)}
const CH_BG=['beach','jungle','lagoon','ocean_top','palace','ballroom','courtyard','sea_sunset','greenhouse','wedding','moon'];
function chapterList(){const L=$('chList');L.innerHTML='';CHAPTERS.forEach((c,i)=>{const b=document.createElement('button');const st=G.save.stars[i]||0;
  b.style.backgroundImage='url(art/'+CH_BG[i]+'.webp?v='+GAMEV+')';
  b.innerHTML='<em>'+(i+1)+'</em><b>'+(G.save.done[i]?'\u2605'.repeat(st)+'\u2606'.repeat(3-st):'')+'</b><span>'+c.title+'</span>';b.onclick=()=>startChapter(i);L.appendChild(b)})}
function startChapter(i){G.ch=i;const c=CHAPTERS[i];G.game=null;hud(false);GFX.clearParticles();Sound.play(c.music||'story');story(c.intro,()=>howto())}
function story(lines,then){setMode('story');show('story');storyQ={lines,i:0,then,shown:0};G.storyKey=lines[0][0];render()}
/* speaker portraits come from the same painted cast; Ashlin's is cut from her own rig */
const PORTRAIT={Antonio:'antonio',Frazer:'frazer','King Peter':'king','Queen Danielle':'danielle','Queen Ariana':'ariana',Luciana:'luciana','Queen Marissa':'marissa',Sagi:'sagi',Tika:'tika',Azul:'azul_stand',Tiny:'tiny',Tallulah:'tallulah',Rita:'rita',Sofia:'sofia',Gina:'gina'};
const pc=document.createElement('canvas');pc.width=pc.height=180;
function ashPortrait(v){const ch=G.ash[v];if(!ch)return'';const R=ch.R,h=R.head,x=pc.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,180,180);
 const k=180/(h[2]*3.0);x.setTransform(k,0,0,k,90-h[0]*k,98-h[1]*k);AshRig.draw(x,ch,{});return pc.toDataURL()}
function render(){const q=storyQ,l=q.lines[q.i];G.storyKey=l[0];const who=l[1]===N?'':l[1];$('spk').textContent=who;q.full=l[2];q.shown=0;$('txt').textContent='';
 const im=$('portrait');let src='';if(who==='Ashlin')src=ashPortrait(CHAPTERS[G.ch].v||'adult');else if(PORTRAIT[who])src='art/'+PORTRAIT[who]+'.webp?v='+GAMEV;
 if(src){im.src=src;im.hidden=false}else im.hidden=true;
 $('bNext').innerHTML=(q.i<q.lines.length-1?'Next':'Continue')+' &#9654;';Sound.fx('page')}
function typeStep(dt){const q=storyQ;if(!q||q.shown>=q.full.length)return;q.shown=Math.min(q.full.length,q.shown+dt*55);$('txt').textContent=q.full.slice(0,Math.floor(q.shown))}
function nextLine(){const q=storyQ;if(!q)return;if(q.shown<q.full.length){q.shown=q.full.length;$('txt').textContent=q.full;return}
 if(q.i<q.lines.length-1){q.i++;render()}else{storyQ=null;q.then()}}
function skipStory(){const q=storyQ;if(!q)return;storyQ=null;Sound.fx('swish');q.then()}
const HT_IMG={find:'chest',walk:'mango',crocs:'croc',voyage:'ship',ball:'flower',rats:'rat',dolphins:'dolphin',antidote:'bowl',cake:'cake',lullaby:'conch'};
function howto(){const c=CHAPTERS[G.ch];setMode('howto');GFX.clearParticles();G.game=GAMES[c.game.type](c.game.cfg);show('howto');$('htNum').textContent='Chapter '+(G.ch+1)+' of '+CHAPTERS.length;$('htTitle').textContent=c.title;
 $('htImg').src='art/'+(HT_IMG[c.game.type]||'star')+'.webp?v='+GAMEV;$('htText').textContent=c.game.how;
 $('htKeys').textContent=CHAPTERS[G.ch].game.type==='walk'?'Keys: arrows to walk, Shift to run, Space to jump, X for action. Gamepad: stick, A jump, X action.':G.land?'Touch, mouse, keyboard (arrows / Space) or a gamepad all work.':'Touch, keyboard or a gamepad all work.';setTimeout(()=>$('bStart').focus({preventScroll:true}),50)}
function play(){const c=CHAPTERS[G.ch];setMode('play');show('none');hud(true);$('hudCh').textContent=(G.ch+1)+'. '+c.title;G.paused=false;if(c.game.music)Sound.play(c.game.music);else Sound.stop()}
function finish(skipped){const g=G.game,c=CHAPTERS[G.ch];setMode('result');G.resT=performance.now();hud(false);const st=skipped?0:clamp(g.stars(),1,3);
 G.save.done[G.ch]=1;G.save.stars[G.ch]=Math.max(G.save.stars[G.ch]||0,st);saveGame();
 $('rsTitle').textContent=skipped?'Skipped':['','Nice try!','Well done!','Amazing!'][st];
 const S=$('rsStars');S.className=skipped?'none':'';[...S.children].forEach((e,i)=>e.classList.toggle('on',i<st));void S.offsetWidth;if(!skipped)S.className='go';
 $('rsText').textContent=skipped?'You can come back and play it any time from Chapters.':['','You did it! Play again for more stars.','Great job, Princess!','Perfect! A true island princess!'][st];
 $('bRetry').hidden=false;show('result');
 if(!skipped){Sound.fx('fanfare');for(let i=0;i<3;i++)setTimeout(()=>GFX.burst(G.W*(0.2+0.3*i),G.H*0.3,{n:30,colors:['#ff8fb8','#ffd23f','#7fd3ff','#9be59b','#fff'],shape:'confetti',speed:320,g:240,life:2}),i*180)}
 Sound.play(c.music||'story');setTimeout(()=>$('bContinue').focus({preventScroll:true}),50)}
/* the result card ignores taps for a moment so a fast last tap in the game can't skip it */
const resGuard=()=>performance.now()-(G.resT||0)<800;
function afterResult(){if(resGuard())return;const c=CHAPTERS[G.ch];GFX.clearParticles();Sound.play(G.ch===CHAPTERS.length-1?'finale':(c.music||'story'));
 story(c.outro,()=>{if(G.ch<CHAPTERS.length-1)startChapter(G.ch+1);else{goTitle();toast('The End! Thank you for playing.',2500)}})}
/* ---------- buttons ---------- */
const click=(id,f)=>$(id).addEventListener('click',e=>{Sound.unlock();Sound.fx('tap');f(e)});
click('bPlay',()=>{let i=CHAPTERS.findIndex((c,k)=>!G.save.done[k]);if(i<0)i=0;startChapter(i)});
click('bChapters',()=>{chapterList();setMode('chapters');show('chapters');setTimeout(()=>$('chList').firstChild.focus({preventScroll:true}),50)});
click('bChBack',goTitle);click('bNext',nextLine);click('bSkip',skipStory);click('bStart',play);click('bContinue',afterResult);click('bRetry',()=>{if(!resGuard())howto()});
click('bPause',togglePause);click('bResume',togglePause);click('bSkipGame',()=>{togglePause();finish(true)});click('bRestart',()=>{G.paused=false;$('pause').hidden=true;howto()});
click('bPChapters',()=>{G.paused=false;$('pause').hidden=true;chapterList();setMode('chapters');hud(false);show('chapters')});
function sndLabel(){const t='Sound: '+(Sound.isOn()?'On':'Off');$('bSound').textContent=t;$('bPSound').textContent=t}
click('bSound',()=>{Sound.setOn(!Sound.isOn());sndLabel()});click('bPSound',()=>{Sound.setOn(!Sound.isOn());sndLabel()});
$('storyBox').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON'){Sound.unlock();nextLine()}});
/* ---------- title picture: painted island, cast placed only in the free area between/beside the title and the buttons ---------- */
function drawTitle(t){const s=G.s,r=stageRect();GFX.bg('title',{zoom:1.06+0.02*Math.sin(t*0.1),px:Math.sin(t*0.12)*10*s,fy:0.6});GFX.amb('rays',t);GFX.amb('sparkle',t,{n:16});GFX.amb('petals',t);
 const gy=r.y+r.h*0.97,hh=Math.min(r.h*0.86,r.w*(G.land?0.72:0.6)),c=r.x+r.w*(G.land?0.5:0.5);const items=[];const box=(x,y,w,h)=>items.push({x,y,w,h});
 GFX.glowDot(c,gy-hh*0.5,hh*0.7,'rgba(255,240,200,.35)');
 drawAsh('adult',{},c,gy,hh,false);box(c-hh*0.2,gy-hh,hh*0.4,hh);
 const tx=c+hh*0.48,th=hh*0.42;GFX.actor('tika',tx,gy,th,t,{face:'l'});box(tx-th*0.4,gy-th,th*0.8,th);
 const sx=c-hh*0.44,sh=hh*0.26;GFX.actor('sagi',sx,gy,sh,t,{face:'r',ph:1});box(sx-sh*0.6,gy-sh,sh*1.2,sh);
 const ax=c-hh*0.5+Math.sin(t*0.7)*hh*0.08,ay=gy-hh*0.72+Math.sin(t*1.6)*6*s,ah=hh*0.3;GFX.spr('azul_fly',ax,ay,ah,{face:'r',center:1});box(ax-ah*0.6,ay-ah*0.5,ah*1.2,ah);
 GFX.amb('motes',t);GFX.vignette(0.25);GFX.drawParticles();G.titleChars=items}
function drawLoading(){cx.fillStyle='#1c1236';cx.fillRect(0,0,G.W,G.H)}
/* ---------- main loop ---------- */
let last=performance.now();
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;G.t+=dt;pollPad(dt);
 cx.setTransform(G.dpr,0,0,G.dpr,0,0);
 try{
 GFX.stepParticles(dt);
 if(G.mode==='loading'){drawLoading()}
 else{
 cx.save();GFX.shakeApply(dt);
 if(G.mode==='play'&&G.game&&!G.paused){cursorUpdate(dt);G.game.update(dt);if(G.game.done){finish(false)}}
 if((G.mode==='play'||G.mode==='howto'||G.mode==='result')&&G.game){G.game.draw();if(G.mode==='result')GFX.drawParticles();drawCursor()}
 else if(G.mode==='story'){typeStep(dt);tableau(G.storyKey,stageRect(),G.t)}
 else drawTitle(G.t);
 cx.restore()}
 padShow();if(window.__aipTrace)window.__aipTrace(G);
 }catch(e){console.error(e);G.err=(G.err||0)+1}
 requestAnimationFrame(frame)}
setMode('loading');requestAnimationFrame(frame);
(async()=>{await Promise.all([GFX.load(p=>{$('ldFill').style.width=Math.round(p*100)+'%'}),document.fonts&&document.fonts.load('20px Lilita').catch(()=>{})]);
 G.ash.child=await AshRig.load('child');G.ash.adult=await AshRig.load('adult');sndLabel();$('loading').hidden=true;goTitle()})();
window.__aip={G,CHAPTERS,start:startChapter,play,next:nextLine,skip:skipStory,finish,goTitle};
