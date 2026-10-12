// Game state: reset, enemy spawning, HUD update
// ---- state ----
let st='title',p,en,kills,spawnT,time=0,fx=[];
function reset(){
  genMap();p={x:10*T,y:30*T,ch:SEL,spd:CHS[SEL].spd,mhp:CHS[SEL].hp,dash:0,dtot:0,del:0,dcd:0,ti:0,thr:0,upH:0,upR:0,upD:0,ks:0,kst:0,kt:null,scy:true,swh:null,bm:null,spa:0,rmax:30,ft:-1,sup:0,sp:0,sq:0,hp:CHS[SEL].hp,fx:0,fy:1,face:1,atk:0,cd:0,hurt:0,swing:0,bx:0,by:-1,rage:0,rk:0};
  en=[];kills=0;spawnT=0;fx=[];flow=null;flowKey=-1;nextBoss=50;camX=null;bossIdx=0;bossDown=0;pj=[];sh=[];nearShop=false;nearCafe=false;upbE.style.display='none';sbE.style.display='none';feE.style.display='none';coins=0;coinUI();upd();
}
function spawn(){
  buildFlow();
  for(let t=0;t<80;t++){
    const x=((1+Math.random()*(MW-2)|0)+.5)*T,y=((1+Math.random()*(MH-2)|0)+.5)*T;
    if(solid(x,y)||safeAt(x,y)||!conn[y/T|0][x/T|0]||Math.hypot(x-p.x,y-p.y)<130||Math.hypot(x-p.x,y-p.y)>280)continue;
    const ty2=(bossIdx>=2&&Math.random()<.25)?2:(bossDown>0&&Math.random()<.45)?1:0;en.push({x,y,hp:ty2===2?5:ty2?4:2,hurt:0,cd:0,kx:0,ky:0,face:1,ty:ty2});return;
  }
}
function upd(){
  document.getElementById('hp').style.width=Math.max(0,p.hp)/p.mhp*100+'%';
  document.getElementById('kl').textContent='KILLS '+kills;
}

