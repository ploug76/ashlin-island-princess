/* Game flow: title -> chapter story -> how to play -> mini-game -> result -> story -> next chapter. */
let storyQ=null;
function setMode(m){G.mode=m;document.body.dataset.mode=m}
function goTitle(){setMode('title');G.game=null;G.paused=false;hud(false);$('pause').hidden=true;show('title');Sound.play('island');setTimeout(()=>$('bPlay').focus({preventScroll:true}),50)}
function chapterList(){const L=$('chList');L.innerHTML='';CHAPTERS.forEach((c,i)=>{const b=document.createElement('button');const st=G.save.stars[i]||0;
  b.innerHTML='<span>'+(i+1)+'. '+c.title+'</span><b>'+(st?'\u2605'.repeat(st)+'\u2606'.repeat(3-st):'')+'</b>';b.onclick=()=>startChapter(i);L.appendChild(b)})}
function startChapter(i){G.ch=i;const c=CHAPTERS[i];G.game=null;hud(false);Sound.play(c.music||'story');story(c.intro,()=>howto())}
function story(lines,then){setMode('story');show('story');storyQ={lines,i:0,then};G.storyKey=lines[0][0];render()}
function render(){const q=storyQ,l=q.lines[q.i];G.storyKey=l[0];$('spk').textContent=l[1]===N?'':l[1];$('txt').textContent=l[2];$('bNext').textContent=q.i<q.lines.length-1?'Next':'Continue';Sound.fx('page')}
function nextLine(){const q=storyQ;if(!q)return;if(q.i<q.lines.length-1){q.i++;render()}else{storyQ=null;q.then()}}
function skipStory(){const q=storyQ;if(!q)return;storyQ=null;q.then()}
function howto(){const c=CHAPTERS[G.ch];setMode('howto');G.game=GAMES[c.game.type](c.game.cfg);show('howto');$('htTitle').textContent='Chapter '+(G.ch+1)+': '+c.title;$('htText').textContent=c.game.how;setTimeout(()=>$('bStart').focus({preventScroll:true}),50)}
function play(){const c=CHAPTERS[G.ch];setMode('play');show('none');hud(true);$('hudCh').textContent=(G.ch+1)+'. '+c.title;G.paused=false;if(c.game.music)Sound.play(c.game.music);else Sound.stop()}
function finish(skipped){const g=G.game,c=CHAPTERS[G.ch];setMode('result');hud(false);const st=skipped?0:clamp(g.stars(),1,3);
 G.save.done[G.ch]=1;G.save.stars[G.ch]=Math.max(G.save.stars[G.ch]||0,st);saveGame();
 $('rsTitle').textContent=skipped?'Skipped':['','Nice try!','Well done!','Amazing!'][st];$('rsStars').textContent=skipped?'':'\u2605'.repeat(st)+'\u2606'.repeat(3-st);
 $('rsText').textContent=skipped?'You can come back and play it any time from Chapters.':['','You did it!','Great job, Princess!','Perfect! A true island princess!'][st];show('result');if(!skipped)Sound.fx('star');Sound.play(c.music||'story');setTimeout(()=>$('bContinue').focus({preventScroll:true}),50)}
function afterResult(){const c=CHAPTERS[G.ch];if(c.music==='waltz'||c.music==='lullaby'){}Sound.play(G.ch===CHAPTERS.length-1?'finale':(c.music||'story'));
 story(c.outro,()=>{if(G.ch<CHAPTERS.length-1)startChapter(G.ch+1);else{goTitle();toast('The End! Thank you for playing.',2500)}})}
/* ---------- buttons ---------- */
const click=(id,f)=>$(id).addEventListener('click',e=>{Sound.unlock();f(e)});
click('bPlay',()=>{let i=CHAPTERS.findIndex((c,k)=>!G.save.done[k]);if(i<0)i=0;startChapter(i)});
click('bChapters',()=>{chapterList();setMode('chapters');show('chapters');setTimeout(()=>$('chList').firstChild.focus({preventScroll:true}),50)});
click('bChBack',goTitle);click('bNext',nextLine);click('bSkip',skipStory);click('bStart',play);click('bContinue',afterResult);
click('bPause',togglePause);click('bResume',togglePause);click('bSkipGame',()=>{togglePause();finish(true)});click('bPChapters',()=>{G.paused=false;$('pause').hidden=true;chapterList();setMode('chapters');hud(false);show('chapters')});
function sndLabel(){const t='Sound: '+(Sound.isOn()?'On':'Off');$('bSound').textContent=t;$('bPSound').textContent=t}
click('bSound',()=>{Sound.setOn(!Sound.isOn());sndLabel()});click('bPSound',()=>{Sound.setOn(!Sound.isOn());sndLabel()});
$('storyBox').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON'){Sound.unlock();nextLine()}});
/* ---------- title picture: characters only in the free area between the title and the buttons ---------- */
function drawTitle(t){const s=G.s,r=stageRect(),gy=r.y+r.h*0.96,hh=Math.min(r.h*0.8,r.w*0.62),c=r.x+r.w/2;Art.islandBg(G.W,G.H,t,s,G.land?G.H*0.92:gy);
 Art.palm(G.W*0.08,G.land?G.H*0.92:gy,Math.min(G.H*0.45,hh*1.4),0.25,t);if(!G.land)Art.palm(G.W*0.94,gy,hh*1.2,-0.25,t);
 const items=[];const box=(x,y,w,h)=>items.push({x,y,w,h});
 drawAsh('adult',{},c,gy,hh,false);box(c-hh*0.2,gy-hh,hh*0.4,hh);
 Art.tika(c+hh*0.5,gy,hh*0.36,{},t,{flip:true});box(c+hh*0.3,gy-hh*0.36,hh*0.45,hh*0.36);
 Art.sagi(c-hh*0.42,gy,hh*0.22,{},t,{});box(c-hh*0.62,gy-hh*0.24,hh*0.38,hh*0.24);
 Art.azul(c-hh*0.62,gy-hh*0.6+Math.sin(t*1.4)*4*s,hh*0.28,t,{fly:true});box(c-hh*0.82,gy-hh*0.82,hh*0.36,hh*0.3);
 G.titleChars=items}
/* ---------- main loop ---------- */
let last=performance.now();
function frame(now){const dt=Math.min(0.05,(now-last)/1000);last=now;G.t+=dt;pollPad(dt);
 cx.setTransform(G.dpr,0,0,G.dpr,0,0);
 try{
 if(G.mode==='play'&&G.game&&!G.paused){cursorUpdate(dt);G.game.update(dt);if(G.game.done){finish(false)}}
 if((G.mode==='play'||G.mode==='howto'||G.mode==='result')&&G.game){G.game.draw();drawCursor()}
 else if(G.mode==='story')tableau(G.storyKey,stageRect(),G.t);
 else drawTitle(G.t);
 if(window.__aipTrace)window.__aipTrace(G);
 }catch(e){console.error(e);G.err=(G.err||0)+1}
 requestAnimationFrame(frame)}
(async()=>{G.ash.child=await AshRig.load('child');G.ash.adult=await AshRig.load('adult');sndLabel();goTitle();requestAnimationFrame(frame)})();
window.__aip={G,CHAPTERS,start:startChapter,play,next:nextLine,skip:skipStory,finish,goTitle};
