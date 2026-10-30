/* The story, chapter by chapter, following the film "Barbie as the Island Princess" (2007), with Ashlin as the heroine.
   Plot checked against the Wikipedia plot summary (Oct 30 2026). Lines are retold in our own words. */
const N='Narrator';
const CHAPTERS=[
 {title:'Washed Ashore',v:'child',music:'story',game:{type:'find',music:'island',how:'After the storm, help Sagi and Azul find six clues on the beach. Tap each one.'},
  intro:[['storm',N,'Long ago, a great storm tossed a royal ship on the South Seas.'],
   ['storm',N,'Waves crashed, and a little girl was swept away...'],
   ['beach',N,'In the morning, a red panda named Sagi and a peacock named Azul found her washed up on their island.'],
   ['beach','Sagi','Poor little thing! Azul, help me look through the wreckage. There may be a clue to who she is.']],
  outro:[['chest','Azul','The chest has a broken nameplate. It only says A-S-H.'],
   ['chest','Sagi','Then we shall call her Ash. Welcome home, little one.'],
   ['grow',N,'She remembered nothing of her past... except a lullaby she heard as a baby.']]},
 {title:'Here on My Island',v:'child',music:'island',game:{type:'walk',music:'island',how:'Run with your friends to the waterfall picnic and grab the mangoes. Hold where you want to go (far = run). Tap to jump the logs.',
   cfg:{v:'child',bg:'island',len:26,icon:'\u{1F96D}',
    items:[{x:3,h:0.35},{x:4.6,h:0.9},{x:6.5,h:0.35},{x:8.3,h:1.0},{x:10.5,h:0.35},{x:12.8,h:0.9},{x:15,h:0.35},{x:17.4,h:1.0},{x:20,h:0.35},{x:23,h:0.9}],
    obst:[{x:5.5,w:0.5,h:0.22,kind:'log'},{x:9.4,w:0.45,h:0.28,kind:'rock'},{x:13.8,w:0.5,h:0.22,kind:'log'},{x:18.6,w:0.5,h:0.3,kind:'rock'},{x:21.6,w:0.5,h:0.22,kind:'log'}]}},
  intro:[['grow',N,'Ash grew up playing with Sagi, Azul and Tika, a baby elephant.'],
   ['grow',N,'She learned to talk with every animal on the island.'],
   ['grow','Tika','Ash! Race you to the waterfall! Last one there has to share their mangoes!']],
  outro:[['grow','Sagi','What a happy picnic. You have grown so fast, little Ash.'],
   ['tenyears',N,'Ten years went by. Ash grew into a kind and brave young woman.']]},
 {title:'The Prince and the Crocodiles',v:'adult',music:'story',game:{type:'crocs',music:'danger',how:'Crocodiles are swimming at the stranger! Tap each crocodile to talk it calm. Calm 10 to save him.'},
  intro:[['tenyears',N,'One day, Prince Antonio of Apollonia was exploring the South Seas and landed on her island.'],
   ['antonio','Antonio','What a beautiful island! I wonder who lives here...'],
   ['antonio','Frazer','Careful, Your Highness. That lagoon looks rather... toothy.'],
   ['antonio','Azul','Ash, look! A stranger in the lagoon... and the crocodiles have seen him!'],
   ['antonio','Ashlin','I can talk to them. Leave it to me!']],
  outro:[['antonio','Antonio','You saved me! And you can talk to animals? Amazing.'],
   ['antonio','Antonio','Come with me to Apollonia. Maybe you can find out where you came from.'],
   ['antonio','Ashlin','I will come... if my friends can come too.'],['antonio','Tika','Hmph. I do not like him.']]},
 {title:'A Brand New Shore',v:'adult',music:'voyage',game:{type:'voyage',music:'voyage',how:'Sail to Apollonia! Drag left and right to steer the ship. Catch the stars and miss the rocks.'},
  intro:[['voyage',N,'Ash, Sagi, Azul and Tika sailed away with Antonio on his ship.'],
   ['voyage','Ashlin','A whole world out there! I have never seen anything past my island.']],
  outro:[['voyage',N,'Along the way, Ash and Antonio began to fall in love.'],
   ['kingdom',N,'At last the ship reached Apollonia, with its shining towers.']]},
 {title:'Welcome to Apollonia',v:'adult',music:'palace',game:{type:'walk',music:'palace',how:'Walk through the palace to the ballroom. Say hello to the princesses and Tallulah, and pick up the flowers. Jump over the rats!',
   cfg:{v:'adult',bg:'palace',len:30,icon:'\u273F',ariana:16.5,
    items:[{x:3.5,h:0.35},{x:6,h:0.9},{x:9.2,h:0.35},{x:12,h:1.0},{x:15,h:0.35},{x:19.5,h:0.9},{x:23,h:0.35},{x:26.5,h:1.0}],
    friends:[{x:5,who:'rita',line:'Hi! I am Rita!'},{x:10.5,who:'sofia',line:'I am Sofia!'},{x:14,who:'gina',line:'And I am Gina!'},{x:21.5,who:'tallulah',line:'Ooh, new friend!'}],
    obst:[{x:8,w:0.5,h:0.3,kind:'cart'},{x:18,w:0.5,h:0.3,kind:'cart'},{x:25,w:0.5,h:0.3,kind:'cart'}],
    movers:[{x0:12.6,r:0.8},{x0:20,r:0.7},{x0:27.8,r:0.8}]}},
  intro:[['palace',N,'King Peter and Queen Danielle were shocked when Antonio came home with Ash.'],
   ['palace','King Peter','Antonio! While you were away, I arranged for you to marry a princess. You must settle down.'],
   ['ariana',N,'Princess Luciana and her mother, Queen Ariana, came to the palace to meet Antonio.'],
   ['ariana',N,'No one knew that Ariana had come back for revenge on King Peter.'],
   ['ariana','Queen Ariana','That island girl could ruin my plans. I will make sure she never fits in.'],
   ['sisters',N,"But Antonio's sisters, Rita, Sofia and Gina, and the queen's monkey Tallulah wanted to be friends."]],
  outro:[['sad',N,'Ariana kept spoiling things for Ash. Ash felt like she would never fit in.'],
   ['sad','Ashlin','Maybe I should just go back to my island.'],
   ['sad','Sagi','Nonsense! Chin up. Tonight is the royal ball, and we will help you get ready.']]},
 {title:'At the Ball',v:'adult',music:'waltz',game:{type:'ball',music:null,how:'Dance with Antonio! Tap the hearts when they land on the circles. Keys: Left, Down, Right.'},
  intro:[['ball',N,'At the engagement ball, everyone was amazed by how lovely and graceful Ash was.'],
   ['ball','Antonio','May I have this dance?']],
  outro:[['ball','Antonio','Ash, I love you. Will you marry me?'],
   ['ball','Ashlin','I cannot. Your father would never allow it.'],
   ['carriage',N,'Later, Sagi saw a carriage with a flag just like the banner that washed ashore with Ash.'],
   ['carriage','Sagi','Excuse me, good horse. Whose flag is that?'],['carriage',N,'The horse said it was the flag of the kingdom of Paladia.']]},
 {title:'The Sleeping Herb',v:'adult',music:'danger',game:{type:'rats',music:'danger',how:"Ariana's rats are carrying the sleeping herb to the animals' food! Tap the rats to shoo them away."},
  intro:[['note',N,'Antonio argued with his father and gave up his place as king to his sister Rita.'],
   ['note',N,'He left Ash a note saying he would run away with her. But Tika hid the note, afraid of losing Ash.'],
   ['rats','Queen Ariana','My rats, spread the sleeping herb. Every animal in Apollonia will fall into a deep sleep!']],
  outro:[['sleep',N,'Even so, many animals ate the herb, and Tallulah and Azul fell into a deep, deep sleep.'],
   ['prison','King Peter','Your animals brought this sickness here! Guards, lock them up!'],
   ['prison',N,'Antonio made a deal: Ash and her friends would go free if he married Luciana.'],
   ['shipaway',N,'Ash was sent away on a ship. Tika said sorry for hiding the note, and Ash forgave her.'],
   ['shipaway',N,"Then a sailor working for Ariana pushed them all into the sea!"],
   ['splash','Ashlin','The water... I remember! My name is not just Ash. My name is ASHLIN!']]},
 {title:'Ride the Dolphins',v:'adult',music:'voyage',game:{type:'dolphins',music:'voyage',how:'A pod of dolphins carries you back to Apollonia! Swipe up or down to change lanes. Catch the shells, miss the rocks.'},
  intro:[['dolphins',N,'A pod of friendly dolphins came to help, and carried them back toward Apollonia.']],
  outro:[['bird','Tiny','Tweet! Ashlin! Queen Ariana put the sleeping herb in the wedding cake!'],
   ['bird','Ashlin','She wants to hurt the King and Antonio. We have to stop her!']]},
 {title:'The Antidote',v:'adult',music:'garden',game:{type:'antidote',music:'garden',how:'Make the cure for the sleeping herb. Add the plants in the order on the card (tap or drag them to the bowl), then stir in circles.'},
  intro:[['greenhouse','Ashlin','I know the plants that cure the sleeping herb. To the royal greenhouse!']],
  outro:[['greenhouse',N,'Ash made the antidote, but palace guards stopped her before she could leave.'],
   ['wedding',N,'Tika burst into the wedding and brought Antonio to rescue Ash.'],
   ['wedding',N,'Sagi raced the cure to Tallulah. She opened her eyes and woke up!']]},
 {title:'The Wedding Cake',v:'adult',music:'danger',game:{type:'cake',music:'danger',how:"The wedding cake has the sleeping herb in it! Tap each slice before a guest takes a bite, and Tika will whisk it away."},
  intro:[['wedding','Ashlin','Stop! Nobody eat the cake!']],
  outro:[['wedding','Ashlin','Queen Ariana put the sleeping herb in the cake!'],['wedding','King Peter','Nonsense! Why would a queen do such a thing?'],
   ['wedding','Luciana','It is true. Mother told me not to eat the cake. She said it was "bad luck."'],
   ['pigsty',N,'Ariana tried to escape in her carriage... and landed right in a pigsty! Splat!'],
   ['wedding','Antonio','Ashlin, will you marry me?'],['wedding','Ashlin','Yes!'],['wedding','King Peter','Welcome to the family, my dear.']]},
 {title:'The Lost Princess',v:'adult',music:'lullaby',game:{type:'lullaby',music:null,how:'Queen Marissa hums the lullaby. Listen, then tap the shells in the same order to sing it with her.'},
  intro:[['reveal','Ashlin','My full name is Ashlin.'],
   ['reveal','Queen Marissa','Ashlin? My daughter, Princess Ashlin of Paladia, was lost in a shipwreck many years ago...'],
   ['reveal','Queen Marissa','There was a lullaby I sang to her every night.']],
  outro:[['reveal','Ashlin','I know that song... Mother! It is you!'],
   ['reveal','Queen Marissa','My Ashlin! You are home at last.'],
   ['finale',N,'Princess Ashlin and Prince Antonio were married.'],
   ['finale',N,'Then they sailed off on a new adventure, with Tika, Sagi, Azul and Tallulah right beside them.'],
   ['finale',N,'The End.']]}];
/* ---------- cinematic story cards: painted background (slow push-in), cast that eases in, ambient motion, letterbox ----------
   cast entries: [who, x (0..1 across the free area), height (x adult height), face, lift]. who 'ash' / 'ashc' = Ashlin's rig. */
const SCENES={
 storm:{bg:'storm',amb:['rain'],cast:[]},
 beach:{bg:'beach',amb:['birds','sparkle'],cast:[['sagi',0.25,0.34,'r'],['ashc',0.5,0.8,'r'],['azul_stand',0.76,0.6,'l']]},
 chest:{bg:'beach',amb:['sparkle'],cast:[['sagi',0.18,0.34,'r'],['ashc',0.4,0.8,'r'],['chest',0.62,0.3],['azul_stand',0.84,0.6,'l']]},
 grow:{bg:'jungle',amb:['rays','leaves','motes'],cast:[['sagi',0.2,0.3,'r'],['ashc',0.42,0.8,'r'],['tika',0.7,0.5,'l'],['azul_fly',0.5,0.4,'r',0.75]]},
 tenyears:{bg:'lagoon',amb:['sparkle','birds'],cast:[['azul_stand',0.14,0.6,'r'],['sagi',0.32,0.3,'r'],['ash',0.52,1,'r'],['tika',0.78,0.5,'l']]},
 antonio:{bg:'lagoon',amb:['sparkle'],cast:[['tika',0.12,0.45,'r'],['ash',0.34,1,'r'],['antonio',0.64,1.05,'l'],['frazer',0.86,0.92,'l']]},
 voyage:{bg:'sea_sunset',deck:1,amb:['birds'],cast:[['sagi',0.14,0.3,'r'],['ash',0.36,1,'r'],['antonio',0.58,1.05,'l'],['tika',0.82,0.46,'l']]},
 kingdom:{bg:'kingdom',amb:['birds','sparkle'],cast:[]},
 palace:{bg:'palace',amb:['motes'],cast:[['ash',0.16,1,'r'],['antonio',0.36,1.05,'r'],['king',0.64,1.08,'l'],['danielle',0.85,1.0,'l']]},
 ariana:{bg:'palace',amb:['motes'],tint:'rgba(60,20,80,.18)',cast:[['luciana',0.36,0.98,'r'],['ariana',0.66,1.1,'l']]},
 sisters:{bg:'palace',amb:['motes'],cast:[['ash',0.14,1,'r'],['rita',0.36,0.92],['sofia',0.56,0.92],['gina',0.76,0.94],['tallulah',0.92,0.4,'l']]},
 sad:{bg:'palace',amb:['motes'],tint:'rgba(30,30,80,.28)',cast:[['ash',0.4,1,'l'],['sagi',0.6,0.3,'l'],['tika',0.8,0.48,'l'],['azul_stand',0.18,0.6,'r']]},
 ball:{bg:'ballroom',amb:['sparkle','petals'],cast:[['ash',0.42,1,'r'],['antonio',0.6,1.05,'l']]},
 carriage:{bg:'courtyard',amb:['birds'],cast:[['sagi',0.3,0.34,'r'],['banner',0.62,0.75]]},
 note:{bg:'palace',amb:['motes'],cast:[['antonio',0.3,1.05,'r'],['tika',0.66,0.5,'l']],prop:'note'},
 rats:{bg:'courtyard',amb:[],tint:'rgba(60,20,80,.25)',cast:[['rat',0.2,0.2,'r'],['rat',0.34,0.2,'r'],['rat',0.48,0.2,'r'],['ariana',0.76,1.1,'l']]},
 sleep:{bg:'courtyard',amb:['zzz'],tint:'rgba(30,30,90,.25)',cast:[['azul_stand',0.36,0.6,'r',0,0.5],['tallulah',0.62,0.4,'l',0,-0.4]]},
 prison:{bg:'prison',amb:['motes'],cast:[['azul_stand',0.14,0.6,'r'],['sagi',0.3,0.3,'r'],['ash',0.48,1,'r'],['tika',0.66,0.48,'r'],['king',0.88,1.08,'l']]},
 shipaway:{bg:'sea_sunset',deck:1,tint:'rgba(40,20,80,.2)',amb:['birds'],cast:[['sagi',0.2,0.3,'r'],['ash',0.45,1,'r'],['tika',0.7,0.48,'l']]},
 splash:{bg:'sea_sunset',amb:['bubbles'],tint:'rgba(40,120,200,.35)',cast:[['ash',0.5,1,'r',0.1]],fx:'splash'},
 dolphins:{bg:'sea_sunset',amb:['sparkle'],cast:[['dolphin',0.25,0.5,'r',0.15],['dolphin',0.75,0.45,'l',0.25],['ash',0.5,0.9,'r']]},
 bird:{bg:'kingdom',amb:['birds'],cast:[['ash',0.32,1,'r'],['tiny',0.6,0.25,'l',0.7]]},
 greenhouse:{bg:'greenhouse',amb:['rays','motes'],cast:[['ash',0.35,1,'r'],['lily',0.6,0.2],['mint',0.7,0.18],['root',0.8,0.18]]},
 wedding:{bg:'wedding',amb:['petals','sparkle'],cast:[['tika',0.08,0.48,'r'],['ash',0.26,1,'r'],['antonio',0.44,1.05,'l'],['luciana',0.62,0.98,'l'],['king',0.8,1.08,'l'],['danielle',0.95,1.0,'l']]},
 pigsty:{bg:'courtyard',amb:[],cast:[['ariana',0.5,1.1,'l',0,0.5]],fx:'mud'},
 reveal:{bg:'moon',amb:['stars','fireflies'],cast:[['marissa',0.4,1.02,'r'],['ash',0.62,1,'l']]},
 finale:{bg:'title',amb:['sparkle','petals','birds'],cast:[['tallulah',0.1,0.38,'r'],['sagi',0.24,0.3,'r'],['ash',0.42,1,'r'],['antonio',0.6,1.05,'l'],['tika',0.82,0.48,'l'],['azul_fly',0.3,0.4,'r',0.8]],fx:'confetti'}};
let sceneKey=null,sceneT0=0;
function tableau(key,r,t){const sc=SCENES[key]||SCENES.beach,s=G.s;if(key!==sceneKey){sceneKey=key;sceneT0=t;if(sc.fx==='splash')setTimeout(()=>GFX.burst(r.x+r.w/2,r.y+r.h*0.7,{n:40,colors:['#fff','#bff4ff'],shape:'drop',speed:380,up:250,life:1.2}),50);
  if(sc.fx==='mud')setTimeout(()=>{GFX.burst(r.x+r.w/2,r.y+r.h*0.75,{n:40,colors:['#7a4a22','#9a6a3a','#5a3a1a'],shape:'drop',speed:360,up:260,life:1.2});GFX.shake(12);Sound.fx('splash')},300);
  if(sc.fx==='confetti')setTimeout(()=>GFX.burst(r.x+r.w/2,r.y+r.h*0.2,{n:60,colors:['#ff8fb8','#ffd23f','#7fd3ff','#9be59b','#fff'],shape:'confetti',speed:340,g:200,life:2.2}),100)}
 const st=t-sceneT0,z=1.1-0.06*GFX.E.out(Math.min(1,st/7));GFX.bg(sc.bg,{zoom:z,px:Math.sin(t*0.15)*8*s,fy:0.55});if(sc.tint)GFX.tint(sc.tint);
 for(const a of sc.amb)GFX.amb(a,t,a==='zzz'?{x:r.x+r.w*0.4,y:r.y+r.h*0.4}:a==='sparkle'?{n:14}:{});
 const gy=r.y+r.h*(sc.gy||0.95),hh=Math.min(r.h*0.7,r.w*(G.land?0.4:0.56));
 if(sc.deck){const dy=gy-hh*0.02;const dg=cx.createLinearGradient(0,dy,0,G.H);dg.addColorStop(0,'#9a6a3e');dg.addColorStop(1,'#5a3a1e');cx.fillStyle=dg;cx.fillRect(0,dy,G.W,G.H-dy);
  cx.strokeStyle='rgba(50,25,10,.5)';cx.lineWidth=2*s;for(let i=1;i<5;i++){const y=dy+(G.H-dy)*i/5;cx.beginPath();cx.moveTo(0,y);cx.lineTo(G.W,y);cx.stroke()}
  cx.fillStyle='#7a4a24';cx.fillRect(0,dy-hh*0.42,G.W,7*s);for(let x=10*s;x<G.W;x+=40*s)cx.fillRect(x,dy-hh*0.42,6*s,hh*0.42)}
 const items=[];sc.cast.forEach((c,i)=>{const[who,u,hr,face,lift,rot]=c,p=Math.max(0,Math.min(1,(st-0.15-i*0.12)/0.55)),e=GFX.E.out(p);if(p<=0)return;
  const x=r.x+r.w*u+(1-e)*(u<0.5?-40:40)*s,h=hh*hr,y=gy-(lift||0)*hh-(1-e)*10*s;cx.save();cx.globalAlpha=e;
  if(who==='ash'||who==='ashc')drawAsh(who==='ash'?'adult':'child',{},x,y,who==='ashc'?h*0.82:h,face==='l');
  else if(who==='azul_fly'||who==='tiny')GFX.spr(who,x,y+Math.sin(t*2+i)*6*s,h,{face,center:1});
  else if(who==='dolphin')GFX.spr(who,x,y+Math.sin(t*2+i)*8*s,h,{face,center:1,rot:Math.sin(t*1.5+i)*0.2});
  else if(['chest','banner','lily','mint','root'].includes(who)){GFX.spr(who,x,y,h);if(who==='chest'){GFX.txt('A-S-H',x,y-h*0.55,Math.max(12,h*0.16),'#ffe9a0')}}
  else GFX.actor(who,x,y,h,t,{face,rot:rot||0,ph:i});
  cx.restore();items.push(who)});
 if(sc.prop==='note'){const p=Math.min(1,st/1.5),x=r.x+r.w*lerp(0.36,0.6,p),y=gy-hh*0.6;cx.save();cx.translate(x,y);cx.rotate(-0.2+p*0.4);cx.fillStyle='#fffbea';GFX.rr(-18*s,-12*s,36*s,24*s,3*s);cx.fill();cx.strokeStyle='#c9a86a';cx.lineWidth=1.5*s;cx.stroke();cx.fillStyle='#d23a5a';GFX.heart(0,0,5*s);cx.restore()}
 /* letterbox + vignette for a filmic feel */
 GFX.vignette(0.3);const lb=Math.min(G.H*0.035,26*s);cx.fillStyle='rgba(8,4,16,.9)';cx.fillRect(0,0,G.W,lb);if(G.land)cx.fillRect(0,G.H-lb,G.W,lb);
 GFX.drawParticles()}
