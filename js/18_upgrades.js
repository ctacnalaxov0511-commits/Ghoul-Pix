// Anteiku coffee shop upgrades (health, range, damage)
const upEl=document.getElementById('up'),upbE=document.getElementById('upbtn');
let nearCafe=false;
const rf=()=>1+.1*(p.upR||0);
const ICO=['assets/icon_health.png','assets/icon_range.png','assets/icon_damage.png'];
// ---- upgrades sold in the Anteiku coffee shop (per run): hp +20%, range +10%, damage +1; up to 3 levels each ----
const UPS=[
 {name:'ЗДОРОВЬЕ',desc:'максимальное здоровье +20%',kills:20,cost:30,f:'upH'},
 {name:'ДАЛЬНОСТЬ',desc:'дальность атаки, растягивания кагуне и косы +10%',kills:50,cost:100,f:'upR'},
 {name:'УРОН',desc:'урон +1',kills:30,cost:50,f:'upD'}];
document.getElementById('upg').innerHTML=UPS.map((u,i)=>'<div class="upc"><img src="'+ICO[i]+'"><div class="tx"><b>'+u.name+'</b><br>'+u.desc+'<br><span id="upl'+i+'"></span> <span class="ef" id="upe'+i+'"></span><br><span class="pr">'+u.cost+' монет · от '+u.kills+' убийств</span><br><button class="buy" id="upb'+i+'" style="margin-top:5px">КУПИТЬ</button></div></div>').join('');
UPS.forEach((u,i)=>document.getElementById('upb'+i).addEventListener('click',()=>buyUp(i)));
function upUI(){
  document.getElementById('upbal').textContent=coins;document.getElementById('upk').textContent=kills;
  UPS.forEach((u,i)=>{
    const lv=p[u.f]||0,max=lv>=3,nk=kills<u.kills,nc=coins<u.cost,b=document.getElementById('upb'+i);
    document.getElementById('upl'+i).innerHTML=[0,1,2].map(j=>'<i class="pp'+(j<lv?' on':'')+'"></i>').join('');
    b.disabled=max||nk||nc;b.textContent=max?'МАКС':nk?'НУЖНО '+u.kills+' УБИЙСТВ':nc?'НЕ ХВАТАЕТ МОНЕТ':'КУПИТЬ';
    document.getElementById('upe'+i).textContent=i===0?'макс. '+p.mhp+(max?'':' → '+Math.round(CHS[p.ch].hp*(1+.2*(lv+1))*10)/10):i===1?'+'+lv*10+'%'+(max?'':' → +'+(lv+1)*10+'%'):'+'+lv+(max?'':' → +'+(lv+1));
  });
}
function buyUp(i){
  const u=UPS[i],lv=p[u.f]||0;
  if(lv>=3||kills<u.kills||coins<u.cost)return;
  coins-=u.cost;p[u.f]=lv+1;
  if(i===0){const nm=Math.round(CHS[p.ch].hp*(1+.2*(lv+1))*10)/10;p.hp+=nm-p.mhp;p.mhp=nm;upd()}
  sfx.buy();coinUI();upUI();
}
upbE.addEventListener('click',()=>{if(st!=='play')return;sfx.click();st='shop';mnE.style.display='none';upbE.style.display='none';upUI();upEl.style.display='flex'});
document.getElementById('upx').addEventListener('click',()=>{sfx.click();st='play';upEl.style.display='none';dashReq=false;nearCafe=false});
