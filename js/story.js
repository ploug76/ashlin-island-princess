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
   ['antonio','Azul','Ash, look! A stranger in the lagoon... and the crocodiles have seen him!'],
   ['antonio','Ashlin','I can talk to them. Leave it to me!']],
  outro:[['antonio','Antonio','You saved me! And you can talk to animals? Amazing.'],
   ['antonio','Antonio','Come with me to Apollonia. Maybe you can find out where you came from.'],
   ['antonio','Ashlin','I will come... if my friends can come too.'],['antonio','Tika','Hmph. I do not like him.']]},
 {title:'A Brand New Shore',v:'adult',music:'voyage',game:{type:'voyage',music:'voyage',how:'Sail to Apollonia! Drag left and right to steer the ship. Catch the stars and miss the rocks.'},
  intro:[['voyage',N,'Ash, Sagi, Azul and Tika sailed away with Antonio on his ship.'],
   ['voyage','Ashlin','A whole world out there! I have never seen anything past my island.']],
  outro:[['voyage',N,'Along the way, Ash and Antonio began to fall in love.'],
   ['palace',N,'At last the ship reached Apollonia, with its shining towers.']]},
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
/* ---------- story pictures (drawn in the free area above / left of the story box) ---------- */
function tableau(key,r,t){const s=G.s,W=G.W,H=G.H,A=Art,gy=r.y+r.h*0.92,hh=Math.min(r.h*0.62,r.w*0.40),cxm=r.x+r.w/2,ash=(v,x,f)=>drawAsh(v,{},x,gy,v==='child'?hh*0.72:hh,f);
 const bg=k=>{if(k==='island')A.islandBg(W,H,t,s,gy);else if(k==='hall')A.palaceHall(W,H,t,s,0,gy);else if(k==='ball')A.ballroom(W,H,t,s);else if(k==='garden')A.garden(W,H,t,s)};
 const P=(who,x,h,o={})=>A.person(x,gy,h||hh,t,{...A.CAST[who],...o});
 switch(key){
  case'storm':{A.sky(W,H,['#1c2440','#3a4466','#55607f']);for(let i=0;i<40;i++){const x=(i*73%100)/100*W,y=((i*37%100)/100*H+t*300*s)%H;A.ln([[x,y],[x-6*s,y+18*s]],'rgba(200,220,255,.5)',2*s)}
   if(Math.sin(t*0.9)>0.97){cx.fillStyle='rgba(255,255,255,.18)';cx.fillRect(0,0,W,H)}A.sea(W,r.y+r.h*0.62,H,t*2.2,'#2a4a7a','#14264a',s);cx.save();cx.translate(cxm,r.y+r.h*0.66);cx.rotate(Math.sin(t*1.1)*0.08);A.shipSide(0,0,Math.min(r.w*0.6,320*s),t,s,'#7b3fb5');cx.restore();break}
  case'beach':case'chest':{A.islandBg(W,H,t,s,gy);A.palm(r.x+r.w*0.12,gy,hh*1.2,0.2,t);for(let i=0;i<4;i++){cx.save();cx.translate(r.x+r.w*(0.3+i*0.18),gy-6*s);cx.rotate(i*0.5-0.7);A.rr(-28*s,-6*s,56*s,12*s,4*s,'#a87a4a',A.LINE,1.5*s);cx.restore()}
   ash('child',cxm,false);A.sagi(cxm-hh*0.6,gy,hh*0.32,{},t,{});A.azul(cxm+hh*0.62,gy,hh*0.42,t,{flip:true});
   if(key==='chest'){const x=cxm+hh*0.25,y=gy-hh*0.08;A.rr(x-30*s,y-18*s,60*s,36*s,6*s,'#9a5a2a',A.LINE,2*s);A.rr(x-30*s,y-22*s,60*s,12*s,6*s,'#b06a32',A.LINE,2*s);A.rr(x-18*s,y-3*s,36*s,14*s,2*s,'#ffd23f',A.LINE,1.5*s);cx.font='800 '+Math.round(11*s)+'px sans-serif';cx.fillStyle='#2a2238';cx.textAlign='center';cx.fillText('A-S-H',x,y+5*s)}break}
  case'grow':{bg('island');A.palm(r.x+r.w*0.85,gy,hh*1.3,-0.2,t);ash('child',cxm-hh*0.1,false);A.tika(cxm+hh*0.55,gy,hh*0.42,{},t,{flip:true});A.sagi(cxm-hh*0.6,gy,hh*0.3,{},t,{});A.azul(cxm+hh*0.1,gy-hh*0.85,hh*0.34,t,{fly:true});break}
  case'tenyears':{bg('island');A.palm(r.x+r.w*0.12,gy,hh*1.3,0.2,t);ash('adult',cxm,false);A.tika(cxm+hh*0.55,gy,hh*0.4,{},t,{flip:true});A.sagi(cxm-hh*0.5,gy,hh*0.25,{},t,{});A.azul(cxm-hh*0.85,gy,hh*0.4,t,{fan:true});break}
  case'antonio':{bg('island');A.shipSide(r.x+r.w*0.82,gy-hh*0.5,Math.min(r.w*0.4,200*s),t,s);ash('adult',cxm-hh*0.35,false);P('antonio',cxm+hh*0.3,hh*1.02,{flip:true});A.tika(cxm-hh*0.9,gy,hh*0.36,{},t,{});A.sagi(cxm-hh*1.25,gy,hh*0.22,{},t,{});break}
  case'voyage':{A.sky(W,H,['#7fd3ff','#ffe9c4']);A.sun(r.x+r.w*0.8,r.y+r.h*0.2,24*s);A.sea(W,r.y+r.h*0.6,H,t,'#5fd6e6','#1f86b8',s);cx.save();cx.translate(cxm,r.y+r.h*0.78);cx.rotate(Math.sin(t*0.9)*0.04);A.shipSide(0,0,Math.min(r.w*0.75,360*s),t,s);
   const hm=Math.min(r.w*0.75,360*s)*0.35*0.95;drawAsh('adult',{},-hm*0.6,-Math.min(r.w*0.75,360*s)*0.35*0.32,hm,false);A.person(-hm*0.15,-Math.min(r.w*0.75,360*s)*0.35*0.32,hm*1.02,t,{...A.CAST.antonio,flip:true});cx.restore();A.dolphin(r.x+r.w*0.15,r.y+r.h*0.9,22*s,t,{});break}
  case'palace':{bg('hall');P('king',cxm-hh*0.1,hh*1.08);P('danielle',cxm+hh*0.38,hh*1.0,{flip:true});ash('adult',cxm-hh*0.75,false);P('antonio',cxm-hh*0.45,hh*1.02);break}
  case'ariana':{bg('hall');P('ariana',cxm+hh*0.2,hh*1.05,{flip:true});P('luciana',cxm+hh*0.62,hh*0.98,{flip:true});P('antonio',cxm-hh*0.3,hh*1.02);ash('adult',cxm-hh*0.72,false);break}
  case'sisters':{bg('hall');ash('adult',cxm-hh*0.6,false);P('rita',cxm-hh*0.05,hh*0.85,{flip:true});P('sofia',cxm+hh*0.35,hh*0.8,{flip:true});P('gina',cxm+hh*0.72,hh*0.78,{flip:true});A.tallulah(cxm+hh*0.2,gy-hh*0.82,hh*0.28,t,{});break}
  case'sad':{A.sky(W,H,['#1c2450','#3a3a7a']);for(let i=0;i<25;i++)A.sparkle((i*37%100)/100*W,(i*53%60)/100*r.h,3*s,'#fff',0.6);A.circ(r.x+r.w*0.8,r.y+r.h*0.2,22*s,'#fff6d6');cx.fillStyle='#3a2a5a';cx.fillRect(0,gy,W,H);
   ash('adult',cxm,false);A.sagi(cxm-hh*0.5,gy,hh*0.26,{},t,{});A.tika(cxm+hh*0.55,gy,hh*0.38,{},t,{flip:true});A.azul(cxm-hh*0.9,gy,hh*0.36,t,{});break}
  case'ball':{bg('ball');cx.save();cx.translate(cxm,gy);cx.rotate(Math.sin(t*1.6)*0.04);drawAsh('adult',{},-hh*0.2,0,hh,false);A.person(hh*0.22,0,hh*1.02,t,{...A.CAST.antonio,flip:true});cx.restore();A.tallulah(r.x+r.w*0.12,gy,hh*0.3,t,{});A.azul(r.x+r.w*0.88,gy,hh*0.4,t,{fan:true,flip:true});break}
  case'carriage':{bg('hall');const x=cxm+hh*0.25;A.rr(x-hh*0.4,gy-hh*0.6,hh*0.8,hh*0.45,hh*0.1,'#7b3fb5',A.LINE,2*s);A.circ(x-hh*0.25,gy-hh*0.12,hh*0.12,'#5a3a1a',A.LINE,2*s);A.circ(x+hh*0.25,gy-hh*0.12,hh*0.12,'#5a3a1a',A.LINE,2*s);
   A.ln([[x+hh*0.3,gy-hh*0.6],[x+hh*0.3,gy-hh*1.0]],'#5a3a1a',3*s);A.banner(x+hh*0.3,gy-hh*1.0,hh*0.32,'paladia',s);A.sagi(cxm-hh*0.55,gy,hh*0.3,{},t,{});break}
  case'note':{bg('hall');A.tika(cxm-hh*0.1,gy,hh*0.5,{},t,{trunkUp:true});A.rr(cxm+hh*0.15,gy-hh*0.85,hh*0.3,hh*0.22,4*s,'#fffcf0',A.LINE,2*s);A.ln([[cxm+hh*0.2,gy-hh*0.78],[cxm+hh*0.4,gy-hh*0.78]],'#888',2*s);A.ln([[cxm+hh*0.2,gy-hh*0.72],[cxm+hh*0.38,gy-hh*0.72]],'#888',2*s);P('antonio',cxm+hh*0.7,hh*1.02,{flip:true});break}
  case'rats':{A.sky(W,H,['#2a1d3e','#4a2a5e']);cx.fillStyle='#3a2a3a';cx.fillRect(0,gy,W,H);P('ariana',cxm,hh*1.05);A.rat(cxm-hh*0.55,gy,hh*0.16,{},t,{herb:true});A.rat(cxm+hh*0.5,gy,hh*0.16,{},t,{herb:true,flip:true});break}
  case'sleep':{bg('hall');A.azul(cxm-hh*0.4,gy,hh*0.45,t,{sleep:true});zzz(cxm-hh*0.3,gy-hh*0.5,s,t);A.tallulah(cxm+hh*0.4,gy,hh*0.36,t,{sleep:true,flip:true});zzz(cxm+hh*0.45,gy-hh*0.4,s,t);break}
  case'prison':{bg('hall');ash('adult',cxm-hh*0.1,false);A.sagi(cxm-hh*0.55,gy,hh*0.26,{},t,{});A.tika(cxm+hh*0.45,gy,hh*0.38,{},t,{flip:true});for(let i=-4;i<=4;i++)A.rr(cxm+i*hh*0.22-4*s,gy-hh*1.15,8*s,hh*1.15,3*s,'#5a5a6a',A.LINE,1.5*s);A.rr(cxm-hh,gy-hh*1.18,hh*2,10*s,3*s,'#5a5a6a');P('king',r.x+r.w*0.9,hh*1.0,{flip:true});break}
  case'shipaway':{A.sky(W,H,['#7fa8d0','#d0dceb']);A.sea(W,r.y+r.h*0.65,H,t,'#4a9ac0','#1f5f98',s);cx.save();cx.translate(cxm,r.y+r.h*0.8);A.shipSide(0,0,Math.min(r.w*0.7,340*s),t,s);const hm=Math.min(r.w*0.7,340*s)*0.33;
   drawAsh('adult',{},-hm*0.4,-hm*0.36,hm,false);A.person(hm*0.35,-hm*0.36,hm,t,{...A.CAST.sailor,flip:true});cx.restore();break}
  case'splash':{A.sky(W,H,['#7fa8d0','#d0dceb']);A.sea(W,r.y+r.h*0.45,H,t,'#4a9ac0','#1f5f98',s);ash('adult',cxm,false);for(let i=0;i<8;i++)A.circ(cxm+(i-3.5)*hh*0.12,gy-hh*0.1+Math.sin(t*3+i)*4*s,hh*0.08,'rgba(255,255,255,.8)');A.dolphin(cxm+hh*0.8,gy-hh*0.1,hh*0.2,t,{flip:true});break}
  case'dolphins':{A.sky(W,H,['#7fd3ff','#ffe9c4']);A.sea(W,r.y+r.h*0.5,H,t,'#5fd6e6','#1f86b8',s);A.dolphin(cxm,gy-hh*0.1,hh*0.28,t,{});drawAsh('adult',{},cxm,gy-hh*0.25,hh*0.75,false);A.dolphin(cxm-hh*0.9,gy,hh*0.24,t,{});A.tika(cxm-hh*0.9,gy-hh*0.12,hh*0.3,{},t,{});A.dolphin(cxm+hh*0.9,gy,hh*0.22,t,{});A.sagi(cxm+hh*0.9,gy-hh*0.1,hh*0.18,{},t,{});break}
  case'bird':{bg('island');ash('adult',cxm-hh*0.2,false);A.bird(cxm+hh*0.35,gy-hh*0.9+Math.sin(t*2)*6*s,hh*0.14,t,{flip:true});A.tika(cxm+hh*0.7,gy,hh*0.38,{},t,{flip:true});break}
  case'greenhouse':{A.greenhouse(W,H,t,s);ash('adult',cxm-hh*0.2,false);A.rr(cxm+hh*0.2,gy-hh*0.5,hh*0.16,hh*0.24,8*s,'#b9f5ff',A.LINE,2*s);A.sparkle(cxm+hh*0.28,gy-hh*0.6,10*s,'#fff');A.sagi(cxm+hh*0.62,gy,hh*0.26,{},t,{flip:true});break}
  case'wedding':{bg('garden');P('king',cxm-hh*0.75,hh*0.98);P('luciana',cxm-hh*0.3,hh*0.92);P('antonio',cxm+hh*0.05,hh*0.98,{flip:true});ash('adult',cxm+hh*0.45,true);A.tika(cxm+hh*0.95,gy,hh*0.36,{},t,{flip:true,trunkUp:true});A.tallulah(r.x+r.w*0.08,gy,hh*0.28,t,{});break}
  case'pigsty':{A.sky(W,H,['#9fd8ff','#e2f6ff']);cx.fillStyle='#8a6a3a';cx.fillRect(0,gy-hh*0.1,W,H);A.ell(cxm,gy,hh*0.9,hh*0.18,'#6a4a22');P('ariana',cxm,hh*0.9,{frown:1});A.ell(cxm,gy+2*s,hh*0.6,hh*0.12,'#6a4a22');
   for(const [dx,f] of[[-0.8,0],[0.75,1]]){const x=cxm+dx*hh,y=gy-hh*0.12;cx.save();cx.translate(x,y);if(f)cx.scale(-1,1);A.ell(0,0,hh*0.2,hh*0.12,'#f7b6c8',A.LINE,2*s);A.circ(hh*0.18,-hh*0.04,hh*0.08,'#f7b6c8',A.LINE,2*s);A.ell(hh*0.25,-hh*0.03,hh*0.03,hh*0.025,'#e7799a');cx.restore()}
   for(let i=0;i<5;i++)A.rr(r.x+r.w*(0.05+i*0.22),gy-hh*0.45,8*s,hh*0.45,2*s,'#9a6a3a');A.rr(0,gy-hh*0.38,W,8*s,2*s,'#9a6a3a');break}
  case'reveal':{bg('garden');P('marissa',cxm-hh*0.3,hh*1.0);ash('adult',cxm+hh*0.3,true);A.heart(cxm,gy-hh*1.15,12*s);break}
  case'finale':{A.sky(W,H,['#ff9ec7','#ffd7a8','#fff1c9']);A.sun(r.x+r.w*0.5,r.y+r.h*0.5,40*s,'#fff3b0');A.sea(W,r.y+r.h*0.62,H,t,'#ffb4a0','#7b5fc8',s);cx.save();cx.translate(cxm,r.y+r.h*0.82);cx.rotate(Math.sin(t*0.9)*0.03);
   const w=Math.min(r.w*0.8,380*s),hm=w*0.3;A.shipSide(0,0,w,t,s,'#7b3fb5');drawAsh('adult',{},-hm*0.5,-w*0.35*0.32,hm,false);A.person(-hm*0.05,-w*0.35*0.32,hm*1.02,t,{...A.CAST.antonio,flip:true});A.tika(hm*0.6,-w*0.35*0.32,hm*0.36,{},t,{flip:true});A.sagi(hm*0.95,-w*0.35*0.32,hm*0.2,{},t,{flip:true});cx.restore();
   A.azul(r.x+r.w*0.2,r.y+r.h*0.3,hh*0.3,t,{fly:true});A.tallulah(cxm+w*0.2,r.y+r.h*0.82-w*0.35*2.1,hh*0.18,t,{});for(let i=0;i<8;i++)A.heart(r.x+r.w*((i*0.13+t*0.02)%1),r.y+r.h*(0.1+0.05*(i%3)),7*s,'rgba(255,93,143,.7)');break}
  default:A.islandBg(W,H,t,s,gy)}}
