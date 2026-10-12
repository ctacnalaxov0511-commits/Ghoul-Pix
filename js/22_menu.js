// Main menu, scrolling city, character select, documentation
// ---- Main menu: scrolling pixel city, character screen ----
const menuEl=document.getElementById('menu'),mcv=document.getElementById('mcv'),mx=mcv.getContext('2d');
let MW2=130,MH2=280,mps=3,mgy=0,msc=1,mSky,mLay=[],mStreet;
const lcg=s=>()=>(s=(s*1664525+1013904223)>>>0)/4294967296;
function mk(w,hh){const c=document.createElement('canvas');c.width=w;c.height=hh;return[c,c.getContext('2d')]}
function mkLayer(PW,seed,o){
  const [c,x]=mk(PW,MH2),rnd=lcg(seed);let bx=0;
  while(bx<PW){
    let bw=o.w0+(rnd()*o.w1|0);if(bx+bw>PW-6)bw=PW-bx;
    const bh=Math.round((o.h0+rnd()*o.h1)*msc),by=mgy-bh;
    x.fillStyle=o.body;x.fillRect(bx,by,bw,bh);
    if(o.brick){x.fillStyle=o.mortar;for(let y=by+3;y<mgy;y+=4)x.fillRect(bx,y,bw,1)}
    x.fillStyle=o.top;x.fillRect(bx,by,bw,1);
    x.fillStyle=o.shade;x.fillRect(bx+bw-1,by+1,1,bh);
    for(let wy=by+5;wy<mgy-6;wy+=6)for(let wx=bx+2;wx<bx+bw-3;wx+=4){x.fillStyle=rnd()<o.lit?o.litc:o.win;x.fillRect(wx,wy,2,3)}
    if(rnd()<.45){x.fillStyle=o.shade;x.fillRect(bx+(bw>>1),by-7,1,7);x.fillStyle='#ff3c64';x.fillRect(bx+(bw>>1),by-8,1,1)}
    if(o.neon&&rnd()<.4&&bw>=16){x.fillStyle='#14101c';x.fillRect(bx+bw-8,by+10,6,22);x.fillStyle='#ff3c64';x.fillRect(bx+bw-7,by+11,4,20);x.fillStyle='#ffb0c0';x.fillRect(bx+bw-6,by+13,2,16)}
    bx+=bw+(rnd()*o.gap|0);
  }
  return c;
}
function buildCity(){
  mgy=Math.round(MH2*.78);msc=Math.max(.55,MH2/280);
  let [c,x]=mk(MW2,MH2);mSky=c;
  const B=['#0a0818','#0e0a20','#140c2a','#1c0e32','#2a1038','#3c1240','#52163f','#6a1c3e','#82243e','#9a2c40'];
  for(let i=0;i<10;i++){x.fillStyle=B[i];x.fillRect(0,Math.floor(mgy*i/10),MW2,Math.ceil(mgy/10)+1)}
  x.fillStyle='#0a0818';x.fillRect(0,mgy,MW2,MH2-mgy);
  const rnd=lcg(7);
  for(let i=0;i<55;i++){x.fillStyle=rnd()<.3?'#ffffff':'#8a90c8';x.fillRect(rnd()*MW2|0,rnd()*mgy*.55|0,1,1)}
  const cx=MW2*.7,cy=mgy*.3,r=Math.max(10,MW2*.1|0);
  for(let yy=-r-9;yy<=r+9;yy++)for(let xx=-r-9;xx<=r+9;xx++){
    const d=Math.hypot(xx,yy);
    if(d<=r){const dt=(xx*-.6+yy*-.8)/r;let col=dt>.5?'#ff8a98':dt>0?'#ff5a70':dt>-.5?'#d4203e':'#8a1030';if(Math.sin(xx*.9)*Math.cos(yy*1.3)>.82)col='#a01834';x.fillStyle=col;x.fillRect(cx+xx|0,cy+yy|0,1,1)}
    else if(d<r+7&&(xx+yy)%2===0){x.fillStyle='rgba(224,32,60,.2)';x.fillRect(cx+xx|0,cy+yy|0,1,1)}
  }
  mLay=[
    mkLayer(288,11,{w0:14,w1:16,h0:50,h1:70,gap:6,body:'#2a2244',top:'#3c3160',shade:'#201a38',win:'#34295a',litc:'#8a5a7a',lit:.08}),
    mkLayer(288,23,{w0:16,w1:18,h0:40,h1:60,gap:8,body:'#382a58',top:'#54437c',shade:'#2a2044',win:'#241c3c',litc:'#f2c75c',lit:.22}),
    mkLayer(288,37,{w0:20,w1:20,h0:56,h1:80,gap:10,body:'#4a2f3a',top:'#7a4e5c',shade:'#2e1a24',win:'#14101c',litc:'#f2c75c',lit:.3,brick:1,mortar:'#3a2430',neon:1})];
  [c,x]=mk(192,MH2);mStreet=c;
  x.fillStyle='#3a3558';x.fillRect(0,mgy,192,4);x.fillStyle='#5a5480';x.fillRect(0,mgy,192,1);
  x.fillStyle='#1e1b30';x.fillRect(0,mgy+4,192,MH2-mgy-4);x.fillStyle='#2a2640';x.fillRect(0,mgy+4,192,1);
  x.fillStyle='#6a6490';const ly=mgy+4+((MH2-mgy-4)*.62|0);for(let i=0;i<192;i+=48)x.fillRect(i+8,ly,28,2);
  const ph=Math.round(56*msc+20),lx=60,lyy=mgy-ph+4;
  for(let yy=-26;yy<=26;yy++)for(let xx=-26;xx<=26;xx++){const d=Math.hypot(xx,yy);if((xx+yy)%2===0&&d<24){x.fillStyle=d<11?'rgba(255,220,140,.16)':'rgba(255,220,140,.08)';x.fillRect(lx+9+xx,lyy+yy,1,1)}}
  x.fillStyle='#0e0c18';x.fillRect(lx,mgy-ph,2,ph);x.fillRect(lx,mgy-ph,9,2);
  x.fillStyle='#ffe9a0';x.fillRect(lx+6,mgy-ph+2,6,2);x.fillStyle='#fff8d0';x.fillRect(lx+7,mgy-ph+2,3,1);
}
function mfit(){
  mps=innerWidth>innerHeight*1.05?Math.min(4,Math.max(2,Math.round(innerHeight/110))):Math.min(4,Math.max(2,Math.round(innerWidth/130)));
  MW2=Math.ceil(innerWidth/mps);MH2=Math.ceil(innerHeight/mps);
  mcv.width=MW2;mcv.height=MH2;mcv.style.width=MW2*mps+'px';mcv.style.height=MH2*mps+'px';
  buildCity();
}
function mtile(c,off){const w=c.width;for(let x=-(Math.floor(off)%w);x<MW2;x+=w)mx.drawImage(c,x,0)}
function mdraw(t){
  mx.drawImage(mSky,0,0);
  mtile(mLay[0],t*4);mtile(mLay[1],t*10);mtile(mLay[2],t*24);mtile(mStreet,t*44);
  if(ready){
    const fx0=Math.round(MW2*.32),fy=mgy+Math.round((MH2-mgy)*.3);
    mx.fillStyle='rgba(8,6,16,.4)';mx.fillRect(fx0-6,fy,12,1);mx.fillRect(fx0-4,fy+1,8,1);mx.fillRect(fx0-4,fy-1,8,1);
    mx.drawImage(IMG,(2+Math.floor(t*11)%6)*FW,charSY(CHS[SEL].row,0),FW,FH,fx0-12,fy-34,FW,FH);
  }
}
function pv(id,t,row){
  const c=document.getElementById(id);if(!c||c.offsetParent===null||!ready)return;
  const x=c.getContext('2d'),ci=row===0?0:row===2?1:2,ph=(t+ci*1.1)%6;
  const cols=[['#ff2a4a','#ff8a98','#ffd0c8'],['#ff6a7e','#ffd0c8','#8ab0ff'],['#ffffff','#ffb0cc','#ff6a7e']][ci];
  x.clearRect(0,0,24,36);
  for(let i=0;i<7;i++){const yy=35-((t*16+i*6)%34),a=Math.min(1,yy/10);x.globalAlpha=a*.8;x.fillStyle=cols[i%3];x.fillRect(Math.round(12+Math.sin(t*2+i*1.7)*9),Math.round(yy),1,i%2?2:1)}
  x.globalAlpha=1;
  let d=2,f=Math.sin(t*3)>.2?1:0,r=row;
  if(ph>=2.2&&ph<4.4){d=(2+Math.floor((ph-2.2)/.275))%8;f=2+Math.floor(t*11)%6}
  else if(ph>=4.4&&ph<5){
    f=8;if(ci===2)r=5;
    const k=(ph-4.4)/.6;x.fillStyle=cols[0];
    for(let i=0;i<10;i++){const a=i*.628,rr=3+k*14;x.globalAlpha=1-k;x.fillRect(Math.round(12+Math.cos(a)*rr),Math.round(20+Math.sin(a)*rr*.8),2,2)}
    x.globalAlpha=1;
  }
  x.drawImage(IMG,f*FW,charSY(r,d),FW,FH,0,0,FW,FH);
}
function mloop(ts){
  requestAnimationFrame(mloop);
  if(st!=='menu')return;
  const t=ts/1000;mdraw(t);pv('pv0',t,0);pv('pv2',t,2);pv('pv3',t,4);pvDoc('pvd0',t,0);pvDoc('pvd1',t,1);pvDoc('pvd2',t,2);pvDoc('pvd3',t,3);pvDoc('pvd4',t,4);pvDoc('pvdd',t,DOCS[docIdx].kind);pv('pv1',t,CHS[viewIdx].row);
}
let mnT=0;
mnE.addEventListener('pointerdown',e=>e.stopPropagation());
mnE.addEventListener('click',()=>{
  sfx.click();
  if(mnT>performance.now()){mnT=0;mnE.textContent='МЕНЮ';reset();showMenu();return}
  mnT=performance.now()+2500;mnE.textContent='ТОЧНО?';
  setTimeout(()=>{mnE.textContent='МЕНЮ';mnT=0},2500);
});
const DOCS=[
 {name:'СЛЕДОВАТЕЛЬ CCG',tag:'КЛАСС 3 · ОБЫЧНЫЙ ВРАГ',kind:0,
  game:[['Здоровье','2'],['Убить','2 удара (у Тоуки 3)'],['Скорость','24 пкс/с'],['Урон','1 ударом кейса, раз в 0,9 с'],['Атака','замах 0,44 с, удар на 24 пкс перед собой; можно отбежать или уйти рывком'],['Награда','2 монеты, +10% к супер-шкале'],['Появление','с начала игры, в зоне врагов'],['Поведение','бежит к тебе в обход зданий; в безопасную зону не заходит и замирает, пока ты внутри']],
  anime:'CCG, Комиссия по борьбе с гулями, охотится на гулей. Сами гули зовут её следователей «голубями». Младшие следователи 3 ранга обычно не получают квинке, а стреляют специальными Q-пулями. Кейс в руке врага отсылает к кейсам, в которых следователи носят оружие.'},
 {name:'СЛЕДОВАТЕЛЬ CCG',tag:'КЛАСС 2 · УСИЛЕННЫЙ ВРАГ',kind:1,
  game:[['Здоровье','4 (на 2 больше, чем у класса 3)'],['Убить','4 удара (у Тоуки 6)'],['Скорость','19,2 пкс/с (0,8 от обычного)'],['Урон','1,2 ударом меча'],['Атака','замах 0,5 с, удар на 32 пкс перед собой; можно отбежать или уйти рывком'],['Касание','урона не наносит'],['Награда','4 монеты, +10% к супер-шкале'],['Появление','после победы над первым боссом, шанс 45% для каждого нового врага']],
  anime:'Следователи 2 ранга получают первый квинке, оружие из кагуне побеждённого гуля. Часто это серийный меч вроде «Цунаги»: длинный клинок без гарды. Форма у них тёмная: у следователя Миуры, например, чёрное пальто с серой подкладкой.'},
 {name:'ЖНЕЦ (REAPER)',tag:'БОСС',kind:2,
  game:[['Здоровье','36, каждому следующему боссу +8'],['Появление','на 50 убитых, затем на 250, 450 и т.д. (каждый раз сильнее)'],['Взмах косы','красный сектор 0,75 с, урон 2'],['Рывок','красная линия 0,7 с, урон 3; после него оглушён 0,9 с'],['Клинки','веер из 5 (7 при здоровье ниже 50%), по 1 урону'],['Призыв','3 следователя на 50% и 25% здоровья'],['Прочее','касание 1 урон; ниже 50% здоровья ходит быстрее'],['Урон по нему','удар 1, бешенство Канэки и Джузо 3, супер Канэки 3 за удар, кристалл Тоуки 1'],['Награда','20 монет, +4 убийства, +4 здоровья']],
  anime:'Это оригинальный босс игры, в аниме его нет. Прозвище «Жнец» там носит Кисё Арима: легендарный следователь особого класса, за 18 лет службы он не проиграл ни одного боя. Его оружие: квинке IXA и Наруками.'},
 {name:'ПАЛАЧ (EXECUTIONER)',tag:'БОСС',kind:3,
  game:[['Здоровье','54: в 1,5 раза больше, чем у Жнеца (каждому следующему +25%)'],['Скорость','48 пкс/с: в 1,6 раза быстрее Жнеца'],['Появление','на 150 убитых, затем на 350, 550 и т.д.'],['Взмах меча','красный сектор 0,5 с, урон 4'],['Растягивание меча','красная линия 0,6 с, затем клинок вытягивается на 170 пкс, урон 4'],['Рёв','на 50% здоровья призывает 3 следователей класса 2, на 25% впадает в ярость и ускоряется'],['Касание','2 урона'],['Урон по нему','как по Жнецу'],['Награда','20 монет, +4 убийства, +4 здоровья']],
  anime:'Это оригинальный босс игры, в аниме его нет. Меч из кагуне отсылает к квинке: так в аниме называют оружие следователей CCG, которое делают из какухо, органа кагуне, побеждённого гуля. Оно излучает сигналы, заставляющие орган выпускать кагуне.'},
 {name:'СЛЕДОВАТЕЛЬ CCG',tag:'КЛАСС 1 · СИЛЬНЫЙ ВРАГ',kind:4,
  game:[['Здоровье','5'],['Убить','5 ударов (у Тоуки 8)'],['Скорость','21,1 пкс/с (на 10% быстрее класса 2)'],['Урон','1,56 (на 30% больше, чем у класса 2)'],['Взмах меча','замах 0,5 с, удар на 32 пкс перед собой'],['Спецатака','красная метка, затем меч растягивается ещё на 2 тайла (32 пкс): бьёт на расстоянии до ~52 пкс по прямой'],['Награда','6 монет, +10% к супер-шкале'],['Появление','после победы над вторым боссом, шанс 25% для каждого нового врага']],
  anime:'В CCG следователи делятся на ранги от 3 до 1, выше идут особые классы. Чем выше ранг, тем опытнее боец и сильнее его квинке. Меч, который вытягивается на расстоянии, отсылает к тому, что квинке повторяют формы кагуне гулей.'}];
let docIdx=0;
function showDoc(i){
  docIdx=i;const d=DOCS[i];
  document.getElementById('ddn').textContent=d.name;document.getElementById('ddt').textContent=d.tag;
  document.getElementById('ddg').innerHTML='<div class="abil" style="border:0;margin:0;padding:0"><b>В ИГРЕ</b></div>'+d.game.map(([k,v])=>'<div class="kv"><span>'+k+'</span><span>'+v+'</span></div>').join('');
  document.getElementById('dda').innerHTML='<b>В АНИМЕ</b><br>'+d.anime;
  const c=document.getElementById('pvdd'),big=d.kind===2||d.kind===3;
  c.width=big?40:24;c.height=big?56:36;c.style.width=big?'80px':'72px';c.style.height=big?'112px':'108px';
  show('m-doc');
}
function pvDoc(id,t,kind){
  const c=document.getElementById(id);if(!c||c.offsetParent===null||!ready||!readyB||!readyB2)return;
  const x=c.getContext('2d'),fr=Math.sin(t*3)>.2?1:0;x.clearRect(0,0,c.width,c.height);
  if(kind===0)x.drawImage(IMG,fr*FW,charSY(1,2),FW,FH,0,0,FW,FH);
  else if(kind===1)x.drawImage(IMG,fr*FW,E2_Y+4*FH,FW,FH,0,0,FW,FH);
  else if(kind===4)x.drawImage(IMG,fr*FW,E3_Y+4*FH,FW,FH,0,0,FW,FH);
  else if(kind===2)x.drawImage(IMGB,fr*BW,2*BH,BW,BH,0,0,BW,BH);
  else x.drawImage(IMGB2,fr*BW,4*BH,BW,BH,0,0,BW,BH);
}
const SCR=['m-main','m-chars','m-detail','m-exit','m-docs','m-doc'];
function show(id){for(const s of SCR)document.getElementById(s).style.display=s===id?'flex':'none'}
function showMenu(){st='menu';cmbE.textContent='';pbE.style.display='none';nearPortal=false;supE.style.display='none';mnE.style.display='none';shopEl.style.display='none';upEl.style.display='none';upbE.style.display='none';nearCafe=false;bnE.style.display='none';menuEl.style.display='block';show('m-main');mfit()}
addEventListener('resize',()=>{if(st==='menu')mfit()});
function showDetail(i){
  viewIdx=i;const c=CHS[i];
  document.getElementById('dn').textContent=c.name;document.getElementById('dr').innerHTML=c.role;
  document.getElementById('stats').innerHTML=c.stats.map(([n,v,r],ri)=>'<div class="st" style="--r:'+ri+'"><i>'+n+'</i><u>'+Array.from({length:r},(_,k)=>'<s class="on" style="--i:'+k+'"></s>').join('')+'<s></s>'.repeat(10-r)+'</u><em>'+v+'</em></div>').join('');
  document.getElementById('abil').innerHTML=c.abil;
  refreshPick();show('m-detail');
}
function refreshPick(){
  document.getElementById('pickbtn').textContent=viewIdx===SEL?'ВЫБРАН':'ВЫБРАТЬ';
  CHS.forEach((_,i)=>document.getElementById('card'+i).classList.toggle('sel',i===SEL));
}
refreshPick();
menuEl.addEventListener('click',e=>{
  const a=e.target.closest('[data-a]');if(!a)return;
  const k=a.dataset.a;if(k==='locked')return;
  sfx.click();
  if(k==='play'){menuEl.style.display='none';reset();st='play'}
  else if(k==='chars')show('m-chars');
  else if(/^char\d$/.test(k))showDetail(+k[4]);
  else if(k==='pick'){SEL=viewIdx;refreshPick();const cd=document.getElementById('card'+SEL);cd.classList.remove('pop');void cd.offsetWidth;cd.classList.add('pop');setTimeout(()=>cd.classList.remove('pop'),600)}
  else if(k==='docs')show('m-docs');
  else if(/^doc\d$/.test(k))showDoc(+k[3]);
  else if(k==='exit'){show('m-exit');try{window.close()}catch(_){}}
  else show('m-main');
});
reset();requestAnimationFrame(loop);showMenu();requestAnimationFrame(mloop);
