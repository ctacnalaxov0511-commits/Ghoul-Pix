// Safe zone logic, unstuck, coins, flesh/coffee shop items
function zoneTick(dt){
  mnE.style.display='block';
  if(p.walk&&!(p.dash>0)&&!(p.sp>0)&&!(p.ks>0)){stepT-=dt;if(stepT<=0){stepT=.2;burst(p.x-p.fx*3,p.y,2,['#6a6490','#8a84a8'],18,.35,20)}}
  if(p.rage>0&&Math.random()<dt*40)burst(p.x+(Math.random()-.5)*10,p.y-4,1,['#ff2a4a','#ff8a98','#ffd0c8'],12,.7,-40);
  if(comboT>0){comboT-=dt;if(comboT<=0)combo=0}
  
  pS=safeAt(p.x,p.y);
  if(p.flesh){
    if(p.ft<0&&!pS)p.ft=20;
    if(p.ft>0){p.ft-=dt;if(p.ft<=0){p.flesh=false;p.ft=-1;feE.style.display='none';coinUI()}}
    if(p.flesh){const nm=p.fk==='c'?'КОФЕ':'ПЛОТЬ';fetE.textContent=p.ft>0?nm+' ×1.5: '+Math.ceil(p.ft)+'с':nm+': ЖДЁТ ВЫХОДА'}
  }
  if(pS!==pSl){pSl=pS;znE.textContent=pS?'БЕЗОПАСНАЯ ЗОНА':'ОПАСНАЯ ЗОНА';znE.style.color=pS?'#3cffa0':'#ff6a7e'}
  if(pS&&p.hp<p.mhp){p.rg=(p.rg||0)+dt;if(p.rg>2){p.rg=0;p.hp++;upd()}}
  const sx0=SHOP.x*T,sy0=SHOP.y*T,ddx=Math.max(sx0-p.x,0,p.x-(sx0+48)),ddy=Math.max(sy0-p.y,0,p.y-(sy0+48)),nr=Math.hypot(ddx,ddy)<=12;
  if(nr!==nearShop){nearShop=nr;sbE.style.display=nr?'block':'none'}
  const qx=PT.x*T,qy=PT.y*T,np=Math.hypot(Math.max(qx-p.x,0,p.x-(qx+32)),Math.max(qy-p.y,0,p.y-(qy+48)))<=12;
  if(np!==nearPortal){nearPortal=np;pbE.style.display=np?'block':'none'}
  const kx0=CF.x*T,ky0=CF.y*T,nc2=Math.hypot(Math.max(kx0-p.x,0,p.x-(kx0+64)),Math.max(ky0-p.y,0,p.y-(ky0+48)))<=12;
  if(nc2!==nearCafe){nearCafe=nc2;upbE.style.display=nc2?'block':'none'}
}
const free=(x,y)=>!(solid(x-5,y-4)||solid(x+5,y-4)||solid(x-5,y+4)||solid(x+5,y+4)||safeAt(x-5,y-4)||safeAt(x+5,y-4)||safeAt(x-5,y+4)||safeAt(x+5,y+4));
const inWall=o=>solid(o.x-4,o.y-3)||solid(o.x+4,o.y-3)||solid(o.x-4,o.y+3)||solid(o.x+4,o.y+3);
// if an enemy ends up overlapping a building, move it to the nearest free tile centre
function unstick(o){
  const tx=o.x/T|0,ty=o.y/T|0;let best=null,bd=1e9;
  for(let r=0;r<=4&&!best;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
    const nx=tx+dx,ny=ty+dy;
    if(nx<0||ny<0||nx>=MW||ny>=MH||grid[ny][nx]>0||zn[ny][nx])continue;
    const cx=(nx+.5)*T,cy=(ny+.5)*T,d=Math.hypot(cx-o.x,cy-o.y);
    if(d<bd){bd=d;best=[cx,cy]}
  }
  if(best){o.x=best[0];o.y=best[1]}
}
let coins=0;try{localStorage.removeItem('ghoulCoins')}catch(_){}
const cvE=document.getElementById('cv2'),balE=document.getElementById('bal'),buyE=document.getElementById('buyflesh'),buyC=document.getElementById('buycoffee'),cdE=document.getElementById('cdesc'),fdE=document.getElementById('fdesc'),feE=document.getElementById('fe'),fetE=document.getElementById('fet');
const feImg=feE.querySelector('img'),FLESH_SRC=feImg.src,COFFEE_SRC='assets/coffee.png';
const setFeIcon=()=>{feImg.src=p.fk==='c'?COFFEE_SRC:FLESH_SRC};
function coinUI(){
  cvE.textContent=coins;balE.textContent=coins;
  if(!p)return;
  const c=CHS[p.ch],has=!!p.flesh;
  buyE.disabled=!!c.human||has||coins<10;buyE.textContent=c.human?'ТОЛЬКО ГУЛЯМ':has?'КУПЛЕНО':'КУПИТЬ';
  fdE.innerHTML=c.human?'только для гулей':'урон ×1.5<br>скорость ×1.5<br>20 секунд после выхода из безопасной зоны';
  cdE.innerHTML=c.human?'урон ×1.5<br>скорость ×1.5<br>20 секунд после выхода из безопасной зоны':'здоровье +20%<br>мгновенно';
  const full=!c.human&&p.hp>=p.mhp;
  buyC.disabled=coins<10||(c.human?has:full);
  buyC.textContent=c.human?(has?'КУПЛЕНО':'КУПИТЬ'):(full?'ЗДОРОВЬЕ ПОЛНОЕ':'КУПИТЬ');
}
buyC.addEventListener('click',()=>{
  const c=CHS[p.ch];if(coins<10)return;
  if(c.human){if(p.flesh)return;coins-=10;p.flesh=true;p.ft=-1;p.fk='c';setFeIcon();feE.style.display='block'}
  else{if(p.hp>=p.mhp)return;coins-=10;p.hp=Math.min(p.mhp,p.hp+p.mhp*.2);upd()}
  sfx.buy();coinUI();
});
function addCoins(n){coins+=n;coinUI()}
buyE.addEventListener('click',()=>{
  if(coins>=10&&!p.flesh&&!CHS[p.ch].human){coins-=10;p.flesh=true;p.ft=-1;p.fk='f';setFeIcon();sfx.buy();feE.style.display='block';coinUI()}
});
