// Mirror dimension: portal, chair, sitting, rendering
// ---- Mirror dimension (Kaneki's room from the opening): endless mirror floor under a blue sky, a single chair ----
const PT={x:6,y:26},CF={x:18,y:24},EX=-120,EY=10,DC=[[10,.10,60,6],[80,.24,44,9],[140,.08,70,5],[200,.30,52,8],[40,.34,36,7]];
let dim=null,nearPortal=false;
function enterDim(){
  st='dim';dim={x:-92,y:34,fade:1,sit:0,st:0,ap:false};p.walk=false;
  pbE.textContent='ВЕРНУТЬСЯ';pbE.style.display='none';sbE.style.display='none';upbE.style.display='none';nearCafe=false;nearShop=false;nearPortal=false;supE.style.display='none';
  banner('ЗЕРКАЛЬНОЕ ИЗМЕРЕНИЕ');
}
function exitDim(){st='play';cmbE.textContent='';pbE.textContent='ВОЙТИ';pbE.style.display='none';nearPortal=false;dashReq=false;atkHeld=false}
pbE.addEventListener('click',()=>{
  if(st==='play'){if(p.ks>0||p.sp>0||p.dash>0)return;sfx.click();sfx.portal();enterDim()}
  else if(st==='dim'){sfx.click();sfx.portal();exitDim()}
});
function dimTick(dt){
  time+=dt;dim.fade=Math.max(0,dim.fade-dt*1.2);
  const edge=atkHeld&&!dim.ap;dim.ap=atkHeld;
  let mx=jx,my=jy;
  if(key.a||key.arrowleft)mx-=1;if(key.d||key.arrowright)mx+=1;if(key.w||key.arrowup)my-=1;if(key.s||key.arrowdown)my+=1;
  const m=Math.hypot(mx,my);if(m>1){mx/=m;my/=m}
  const kan=!!CHS[p.ch].ksuper,near=Math.hypot(dim.x,dim.y)<34;
  if(dim.sit===0){
    if(kan&&near&&edge){dim.sit=1;dim.st=0;p.fx=0;p.fy=1}
    else{
      dim.x+=mx*p.spd*1.1*dt;dim.y+=my*p.spd*1.1*dt;
      const RY=Math.min(70,H*.28-6),ex=dim.x/230,ey=(dim.y-20)/RY,e=Math.hypot(ex,ey);
      if(e>1){dim.x/=e;dim.y=20+(dim.y-20)/e}
      const cd=Math.hypot(dim.x,dim.y);if(cd<14&&cd>0){dim.x=dim.x/cd*14;dim.y=dim.y/cd*14}
      if(m>.1){p.fx=mx/m;p.fy=my/m}
      p.walk=m>.1;p.anim=(p.anim||0)+(p.walk?dt:0);
    }
  }else if(dim.sit===1){
    dim.st+=dt;p.walk=true;p.anim=(p.anim||0)+dt;
    const k=Math.min(1,dt*10);dim.x+=(0-dim.x)*k;dim.y+=(18-dim.y)*k;
    if(dim.st>=.3){dim.sit=2;dim.st=0;dim.x=0;dim.y=18}
  }else if(dim.sit===2){dim.st+=dt;if(dim.st>=.25){dim.sit=3;dim.st=0}}
  else if(dim.sit===3){dim.st+=dt;if(edge||m>.3){dim.sit=4;dim.st=0}}
  else{dim.st+=dt;if(dim.st>=.25){dim.sit=0;dim.x=0;dim.y=18;p.walk=false}}
  cmbE.style.opacity=1;
  cmbE.textContent=(kan&&dim.sit===0&&near)?'АТАКА — СЕСТЬ':dim.sit===3?'АТАКА — ВСТАТЬ':'';
  const ne=Math.hypot(dim.x-EX,dim.y-EY)<=40&&dim.sit===0;
  if(ne!==nearPortal){nearPortal=ne;pbE.style.display=ne?'block':'none'}
}
function cloud(x,y,w,rev,al){
  const rows=[[.45,'#ffffff'],[.8,'#f4faff'],[1,'#dcecff'],[.7,'#b8d4f4']];
  ctx.globalAlpha=al;
  rows.forEach(([f,c],i)=>{const rw=Math.round(w*f);ctx.fillStyle=c;ctx.fillRect(Math.round(x+(w-rw)/2),rev?y-i*3:y+i*3,rw,3)});
  ctx.globalAlpha=1;
}
function renderDim(){
  ctx.setTransform(1,0,0,1,0,0);
  const t=time,hz=Math.round(H*.40),cyS=Math.round(H*.68);
  const B=['#14398f','#1c4fb0','#2a6ad0','#3c82e0','#58a0f0','#84c0f8','#b8dcff','#e8f4ff'];
  for(let y=0;y<hz;y++){ctx.fillStyle=B[Math.min(7,(y/hz*8)|0)];ctx.fillRect(0,y,W,1)}
  for(const c of DC)cloud((c[0]+t*c[3])%(W+120)-60,Math.round(hz*c[1]),c[2],false,1);
  for(let y=hz;y<H;y++){
    const dd=y-hz,u=Math.max(0,(hz-dd*.9)/hz),rp=Math.sin(dd*.35+t*1.5)*.04;
    ctx.fillStyle=B[Math.min(7,Math.max(0,((u+rp)*8)|0))];ctx.fillRect(0,y,W,1);
  }
  for(const c of DC)cloud((c[0]+t*c[3])%(W+120)-60,2*hz-Math.round(hz*c[1])-14,c[2],true,.5);
  ctx.fillStyle='rgba(8,20,60,.3)';ctx.fillRect(0,hz,W,H-hz);
  ctx.fillStyle='rgba(255,255,255,.55)';ctx.fillRect(0,hz-1,W,2);
  for(let i=0;i<34;i++){
    const x=Math.round((i*47+t*(6+i%3*5))%W),y=hz+3+((i*29)%Math.max(4,H-hz-4)),w=4+(i%5)*3;
    ctx.fillStyle='rgba(255,255,255,'+(.10+.08*(i%3))+')';ctx.fillRect(x,y,w,1);
  }
  for(let i=0;i<30;i++){
    const x=Math.round((i*61+t*(4+i%4*3))%W),y=Math.round(H-((i*37+t*(8+i%5*4))%H));
    ctx.fillStyle='rgba(255,255,255,'+(.25+.35*((i%4)/3))+')';ctx.fillRect(x,y,1,1);
  }
  const sx=wx=>Math.round(W/2+wx-dim.x),sy=wy=>Math.round(cyS+wy-dim.y);
  const objs=[{y:0,k:0},{y:EY,k:1},{y:dim.sit>=2?1:dim.y,k:2}].sort((a,b)=>a.y-b.y);
  for(const o of objs){
    if(o.k===0){const x=sx(0),y=sy(0);reflect(IMG,128,PORTAL_Y,24,30,x-12,y+1,.4,1.2);ctx.drawImage(IMG,128,PORTAL_Y,24,32,x-12,y-30,24,32)}
    else if(o.k===1){const x=sx(EX),y=sy(EY),fr=((t*5)|0)%4;reflect(IMG,fr*32,PORTAL_Y,32,46,x-16,y+1,.4,1.2);ctx.drawImage(IMG,fr*32,PORTAL_Y,32,48,x-16,y-46,32,48)}
    else if(dim.sit>=2){
      const t=dim.st,bY=sy(18),sY=sy(0)-5;let fi,py;
      if(dim.sit===2){fi=0;py=bY+(sY-bY)*Math.min(1,t/.25)}
      else if(dim.sit===3){fi=Math.sin(time*1.3)>.6?2:1;py=sY}
      else{fi=0;py=sY+(bY-sY)*Math.min(1,t/.25)}
      const x=sx(0);reflect(IMG,fi*FW,SIT_Y,FW,34,x-12,sy(0)+1,.38,1.2);
      ctx.drawImage(IMG,fi*FW,SIT_Y,FW,FH,x-12,Math.round(py)-34,FW,FH);
    }
    else{const x=sx(dim.x),y=sy(dim.y),kf=kFrame(),c=prow();reflect(IMG,kf.f*FW,charSY(c,kf.d),FW,34,x-12,y+1,.38,1.2);shOff=true;drawSpr(c,kf.d,kf.f,x,y,false);shOff=false}
  }
  if(dim.fade>0){ctx.fillStyle='rgba(255,255,255,'+dim.fade+')';ctx.fillRect(0,0,W,H)}
}
