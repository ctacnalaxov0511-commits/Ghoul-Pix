// Boss 1 (REAPER): sprite loading, spawning, AI, projectiles, telegraphs
const BW=40,BH=56,IMGB=new Image();let readyB=false,FLASHB=null;
IMGB.onload=()=>{
  FLASHB=document.createElement('canvas');FLASHB.width=IMGB.width;FLASHB.height=IMGB.height;
  const x=FLASHB.getContext('2d');x.drawImage(IMGB,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,FLASHB.width,FLASHB.height);
  readyB=true;
};
IMGB.src='assets/boss_reaper.png';
const IMGB2=new Image();let readyB2=false,FLASHB2=null;
IMGB2.onload=()=>{
  FLASHB2=document.createElement('canvas');FLASHB2.width=IMGB2.width;FLASHB2.height=IMGB2.height;
  const x=FLASHB2.getContext('2d');x.drawImage(IMGB2,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,FLASHB2.width,FLASHB2.height);
  readyB2=true;
};
IMGB2.src='assets/boss_executioner.png';
function drawBoss(e){
  const x=Math.round(e.x),y=Math.round(e.y);
  if(!shOff){ctx.fillStyle='rgba(8,6,16,.4)';ctx.fillRect(x-7,y-1,14,1);ctx.fillRect(x-10,y,20,1);ctx.fillRect(x-7,y+1,14,1);}
  if(e.bt===1)ctx.drawImage(e.hurt>0&&FLASHB2?FLASHB2:IMGB2,(e.f%8)*BW,(e.d*2+(e.f>=8?1:0))*BH,BW,BH,x-20,y-53,BW,BH);
  else ctx.drawImage(e.hurt>0&&FLASHB?FLASHB:IMGB,e.f*BW,e.d*BH,BW,BH,x-20,y-53,BW,BH);
}
let pj=[],nextBoss=50;
const bnE=document.getElementById('bn'),bwE=document.getElementById('bw'),bfE=document.getElementById('bf');
function banner(t){bnE.textContent=t;bnE.style.display='block';clearTimeout(banner.t);banner.t=setTimeout(()=>{bnE.style.display='none'},2200)}
function hurtP(n){if(p.dash>0||pS||p.ks>0)return;p.hp-=n;p.hurt=.2;sfx.hurt();hurtFx();upd()}
function spawnBoss(){
  buildFlow();
  for(let t=0;t<150;t++){
    const x=((2+Math.random()*(MW-4)|0)+.5)*T,y=((2+Math.random()*(MH-4)|0)+.5)*T,d=Math.hypot(x-p.x,y-p.y);
    if(solid(x,y)||safeAt(x,y)||!conn[y/T|0][x/T|0]||d<120||d>260)continue;
    const bt=bossIdx%2,hp=Math.round((bt?54:36)*(1+.25*Math.floor(bossIdx/2)));
    en.push({boss:1,bt,x,y,hp,max:hp,hurt:0,cd:0,kx:0,ky:0,st:'chase',t:1.2,d:0,f:0,face:1});
    bnmE.textContent=bt?'EXECUTIONER':'REAPER';banner('BOSS: '+(bt?'EXECUTIONER':'REAPER'));sfx.boss();addShake(.5,4);flashA=.45;flashC='160,10,30';return;
  }
}
function bossDead(e){
  bossDown++;banner((e&&e.bt?'EXECUTIONER':'REAPER')+' DEFEATED');sfx.bossdead();bossIdx++;nextBoss=bossAt(bossIdx);p.hp=Math.min(p.mhp,p.hp+4);pj=[];kills+=4;
  for(let i=0;i<14;i++)fx.push({x:p.x+Math.cos(i)*14,y:p.y-8+Math.sin(i)*14,t:.5,big:1});
}
function stepDir(e,dx,dy,d){
  let ux=dx/d,uy=dy/d;
  if(d>12&&!los(e.x,e.y,p.x,p.y)){
    const ex=e.x/T|0,ey=e.y/T|0,cur=flow[ey*MW+ex];
    if(cur>0){
      let bn=cur,bx=-1,by=-1;
      for(const [ox,oy] of D8){
        const nx=ex+ox,ny=ey+oy;
        if(nx<0||ny<0||nx>=MW||ny>=MH||grid[ny][nx])continue;
        if(ox&&oy&&(grid[ey][nx]||grid[ny][ex]))continue;
        const v=flow[ny*MW+nx];if(v>=0&&v<bn){bn=v;bx=nx;by=ny}
      }
      if(bx>=0){const tx=(bx+.5)*T-e.x,ty=(by+.5)*T-e.y,td=Math.hypot(tx,ty)||1;ux=tx/td;uy=ty/td}
    }
  }
  return[ux,uy];
}
// REAPER: sweep (telegraphed cone), charge (telegraphed line, then stunned), blade volley, summons grunts at 50% / 25% hp
function bossAI(e,dt){
  const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;
  e.hurt-=dt;e.cd-=dt;e.t-=dt;
  if(pS){e.st='chase';e.ps='chase';e.t=1;e.f=0;e.d=dirOf(dx,dy);tryMove(e,e.kx*dt,e.ky*dt);e.kx*=.85;e.ky*=.85;return}
  if(e.bt===1){boss2AI(e,dt,dx,dy,d);return}
  if(e.ps!==e.st){const o=e.ps;e.ps=e.st;bossSnd(o,e.st)}
  const half=e.hp<=e.max/2,q4=e.hp<=e.max/4;
  e.d=dirOf(dx,dy);e.f=0;
  if(e.st==='chase'){
    const [ux,uy]=stepDir(e,dx,dy,d),v=half?36:30;
    tryMove(e,ux*v*dt,uy*v*dt);e.d=dirOf(ux,uy);e.f=2+((time*6|0)%6);
    if(e.t<=0){
      const r=Math.random();
      if(half&&!e.s1){e.s1=1;e.st='summon';e.t=.9}
      else if(q4&&!e.s2){e.s2=1;e.st='summon';e.t=.9}
      else if(d<52&&r<.7){e.st='sweep';e.t=.75;e.ax=dx/d;e.ay=dy/d}
      else if(d>80&&r<.45){e.st='charge';e.t=.7;e.ax=dx/d;e.ay=dy/d;e.hit=0}
      else{e.st='volley';e.t=.55}
    }
  }else if(e.st==='sweep'){
    e.f=8;e.d=dirOf(e.ax,e.ay);
    if(e.t<=0){
      addShake(.22,3.5);if(d<50&&(dx*e.ax+dy*e.ay)/d>.5)hurtP(2);
      for(let i=0;i<8;i++){const a=Math.atan2(e.ay,e.ax)+(i-3.5)*.3;fx.push({x:e.x+Math.cos(a)*34,y:e.y+Math.sin(a)*34-6,t:.3,big:1})}
      e.st='rec';e.t=.55;
    }
  }else if(e.st==='charge'){
    e.f=8;e.d=dirOf(e.ax,e.ay);
    if(e.t<=0){e.st='dash';e.t=.5}
  }else if(e.st==='dash'){
    const ox=e.x,oy=e.y;
    tryMove(e,e.ax*190*dt,e.ay*190*dt);
    e.d=dirOf(e.ax,e.ay);e.f=2+((time*14|0)%6);
    if(!e.hit&&d<13){e.hit=1;hurtP(3)}
    if(Math.random()<.5)fx.push({x:e.x,y:e.y,t:.22});
    if(e.t<=0||Math.hypot(e.x-ox,e.y-oy)<190*dt*.3){e.st='stun';e.t=.9;addShake(.3,4.5)}
  }else if(e.st==='stun'){
    e.f=1;if(e.t<=0){e.st='chase';e.t=1+Math.random()*.7}
  }else if(e.st==='volley'){
    e.f=8;
    if(e.t<=0){
      const n=half?7:5,base=Math.atan2(dy,dx);
      for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*.28;pj.push({x:e.x,y:e.y-14,vx:Math.cos(a)*95,vy:Math.sin(a)*95,t:3})}
      e.st='rec';e.t=.6;
    }
  }else if(e.st==='summon'){
    e.f=8;
    if(e.t<=0){
      for(let i=0;i<3;i++){const a=i*2.1+Math.random(),x=e.x+Math.cos(a)*26,y=e.y+Math.sin(a)*26;if(free(x,y)){en.push({x,y,hp:2,hurt:0,cd:0,kx:0,ky:0,face:1});fx.push({x,y:y-6,t:.4,big:1})}}
      e.st='rec';e.t=.5;
    }
  }else{
    if(e.t<=0){e.st='chase';e.t=.9+Math.random()*.8}
  }
  tryMove(e,e.kx*dt,e.ky*dt);e.kx*=.85;e.ky*=.85;
  if(d<13&&e.cd<=0&&e.st!=='dash'&&e.st!=='stun'){e.cd=1;hurtP(1)}
}
function updPJ(dt){
  for(const q of pj){
    q.x+=q.vx*dt;q.y+=q.vy*dt;q.t-=dt;
    if(solid(q.x,q.y))q.t=0;
    else if(Math.hypot(q.x-p.x,q.y-(p.y-8))<7){hurtP(1);q.t=0}
  }
  pj=pj.filter(q=>q.t>0);
}
function drawPJ(){
  for(const q of pj){
    const x=Math.round(q.x),y=Math.round(q.y);
    ctx.fillStyle='#2a0510';ctx.fillRect(x-3,y-1,7,3);ctx.fillRect(x-1,y-3,3,7);
    ctx.fillStyle='#ff4d6a';ctx.fillRect(x-2,y,5,1);ctx.fillRect(x,y-2,1,5);
    ctx.fillStyle='#fff';ctx.fillRect(x,y,1,1);
  }
}
function bossTele(e){
  if(e.bt===1){bossTele2(e);return}
  if(e.st!=='sweep'&&e.st!=='charge')return;
  const pr=1-Math.max(0,e.t)/(e.st==='sweep'?.75:.7),ex=Math.round(e.x),ey=Math.round(e.y);
  ctx.fillStyle='rgba(224,32,60,'+(.18+.3*pr)+')';
  if(e.st==='sweep'){
    const a0=Math.atan2(e.ay,e.ax);
    for(let yy=-50;yy<=50;yy+=2)for(let xx=-50;xx<=50;xx+=2){
      if(xx*xx+yy*yy>2500||xx*xx+yy*yy<16)continue;
      let da=Math.atan2(yy,xx)-a0;da=Math.atan2(Math.sin(da),Math.cos(da));
      if(Math.abs(da)<1.05)ctx.fillRect(ex+xx,ey+yy,2,2);
    }
  }else{
    for(let s=8;s<=150;s+=6)for(const w of[-3,3])ctx.fillRect(Math.round(ex+e.ax*s-e.ay*w)-3,Math.round(ey+e.ay*s+e.ax*w)-3,6,6);
  }
}
