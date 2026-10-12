// Main update tick
function update(dt){
  zoneTick(dt);
  time+=dt;
  let mx=jx,my=jy;
  if(key.a||key.arrowleft)mx-=1;if(key.d||key.arrowright)mx+=1;
  if(key.w||key.arrowup)my-=1;if(key.s||key.arrowdown)my+=1;
  const m=Math.hypot(mx,my);if(m>1){mx/=m;my/=m}
  const sp=(p.atk>0?p.spd*.54:p.spd)*(p.rage>0?1.5:1)*fm();
  if(p.dash>0){p.dash-=dt;ghT-=dt;if(ghT<=0){ghT=.035;ghosts.push({x:p.x,y:p.y,c:prow(),d:dirOf(p.fx,p.fy),f:curX>=0?curX:4,t:.25})}const v=(260+(p.rage>0?90:0))*(.35+.65*Math.max(0,p.dash)/p.dtot);tryMove(p,p.fx*v*dt,p.fy*v*dt);if(Math.random()<.5)fx.push({x:p.x+(Math.random()-.5)*8,y:p.y,t:.22})}else if(!(p.sp>0||p.ks>0))tryMove(p,mx*sp*dt,my*sp*dt);
  if(m>.1){if(p.atk<=0&&!(p.dash>0)&&!(p.sp>0)&&!(p.ks>0)){p.fx=mx/m;p.fy=my/m}p.face=mx>0.1?1:mx<-0.1?-1:p.face}
  p.walk=m>.1;p.anim=(p.anim||0)+(p.walk?dt:0);
  p.cd-=dt;p.hurt-=dt;
  if(p.rage>0){p.rage-=dt;if(p.rage<=0){p.rage=0;p.rk=0}}
  {const k=Math.min(1,dt*8);p.bx+=(-p.fx-p.bx)*k;p.by+=(-p.fy-p.by)*k}
  if(CHS[p.ch].scythe)scytheTick(dt);
  if(p.ks>0)ksTick(dt);
  if(supReq){supReq=false;if(CHS[p.ch].sup&&p.sup>=100&&!(p.sp>0)&&!(p.dash>0))startSuper()}
  if(p.sp>0){
    p.sp-=dt;const el=2.4-p.sp;
    if(el>=.25&&el<=2.25){p.sq-=dt;while(p.sq<=0){p.sq+=.06;fireShard();addShake(.06,1.2)}}
  }
  if(CHS[p.ch].sup){supE.style.display='block';supE.style.setProperty('--p',p.sup);supE.classList.toggle('rdy',p.sup>=100&&!(p.sp>0))}else supE.style.display='none';
  p.dcd-=dt;if(p.dtot&&p.del<p.dtot+.12)p.del+=dt;
  if(dashReq){dashReq=false;if(p.dcd<=0&&!(p.dash>0)&&!(p.sp>0)&&!(p.ks>0))startDash()}
  db.style.opacity=p.dcd>0?.45:1;
  {const bs=en.find(e=>e.boss);bwE.style.display=bs?'block':'none';if(bs)bfE.style.width=Math.max(0,bs.hp/bs.max*100)+'%'}
  rbar();
  if(atkHeld&&p.cd<=0&&p.atk<=0&&!(p.dash>0)&&!(p.sp>0)&&!(p.ks>0)&&!(CHS[p.ch].scythe&&(!p.scy||p.rage>0)))attack();
  if(p.atk>0){
    p.atk-=dt;
    const el=p.tot-p.atk;
    for(const s of p.st){
      if(!s.snd&&el>=s.d){s.snd=1;sfx.slash()}
      while(s.hc<s.nh&&el>=s.d+SWING*.3+s.hc*.13){
        s.hc++;const e=s.e;
        if(e&&e.hp>0&&!pS){
          const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy)||1;
          sfx.hit();sparkAt(e);e.hp-=dmgOf(e);e.hurt=.15;const kb=e.boss?12:(s.hc>1?50:140);e.kx=dx/d*kb;e.ky=dy/d*kb;
          fx.push({x:e.x,y:e.y-6,t:.25});
        }
      }
    }
  }
  if(!pS&&!en.some(e=>e.boss)&&kills>=nextBoss)spawnBoss();
  updPJ(dt);updSH(dt);updDust(dt);
  spawnT-=dt;
  if(spawnT<=0&&!pS&&en.length<Math.round((p.rage>0?9:5+Math.min(6,kills/4|0))*(bossIdx>=3?2:bossIdx>=2?1.5:1))&&!(en.length>4&&en.some(e=>e.boss))){spawn();spawnT=(p.rage>0?1:2.2)/(bossIdx>=3?2:bossIdx>=2?1.5:1)}
  for(const e of en)if(inWall(e))unstick(e);
  for(const e of en){
    if(e.held)continue;
    if(e.boss){bossAI(e,dt);continue}
    const dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;
    e.hurt-=dt;e.cd-=dt;
    if(Math.abs(dx)>1)e.face=dx>0?1:-1;
    e.dir=dirOf(dx,dy);
    buildFlow();
    let ux=dx/d,uy=dy/d;
    if(d>12&&!los(e.x,e.y,p.x,p.y)){
      const ex=e.x/T|0,ey=e.y/T|0,cur=flow[ey*MW+ex];
      if(cur>0){
        let bn=cur,bx=-1,by=-1;
        for(const [ox,oy] of D8){
          const nx=ex+ox,ny=ey+oy;
          if(nx<0||ny<0||nx>=MW||ny>=MH||grid[ny][nx])continue;
          if(ox&&oy&&(grid[ey][nx]||grid[ny][ex]))continue;
          const v=flow[ny*MW+nx];
          if(v>=0&&v<bn){bn=v;bx=nx;by=ny}
        }
        if(bx>=0){const tx=(bx+.5)*T-e.x,ty=(by+.5)*T-e.y,td=Math.hypot(tx,ty)||1;ux=tx/td;uy=ty/td}
      }
    }
    let sx=0,sy=0;
    for(const o of en){if(o===e)continue;const ox=e.x-o.x,oy=e.y-o.y,od=Math.hypot(ox,oy);if(od<9&&od>0){sx+=ox/od*(9-od);sy+=oy/od*(9-od)}}
    e.idle=pS;if(pS||e.sw!=null){ux=0;uy=0}
    const ox0=e.x,oy0=e.y,es=e.ty===2?21.12:e.ty?19.2:24;
    tryMove(e,(ux*es+sx*4+e.kx)*dt,(uy*es+sy*4+e.ky)*dt);
    if(!pS&&d>20){
      if(Math.hypot(e.x-ox0,e.y-oy0)<24*dt*.3){
        e.stk=(e.stk||0)+dt;
        if(e.stk>.3){e.kx+=(((e.x/T|0)+.5)*T-e.x)*3;e.ky+=(((e.y/T|0)+.5)*T-e.y)*3;e.stk=0}
      }else e.stk=0;
    }
    if(e.sw!=null)e.dir=e.sd;else if(!pS)e.dir=dirOf(ux,uy);
    e.kx*=.85;e.ky*=.85;
    if(e.ty===2)sword2Tick(e,dt,d,dx,dy);else if(e.ty)swordTick(e,dt,d,dx,dy);
    if(!e.ty)caseTick(e,dt,d,dx,dy);
  }
  const before=en.length;
  en=en.filter(e=>{if(e.hp<=0){if(e.boss)bossDead(e);else sfx.kill(combo);kills++;onKill(e);if(CHS[p.ch].sup&&!(p.sp>0)&&!(p.ks>0))p.sup=Math.min(100,p.sup+10);addCoins(e.boss?20:e.ty===2?6:e.ty?4:2);sfx.coin();if(!(p.rage>0)&&++p.rk>=15)startRage();fx.push({x:e.x,y:e.y-4,t:.4,big:1});return false}return true});
  if(en.length!==before)upd();
  fx=fx.filter(f=>(f.t-=dt)>0);
  if(p.hp<=0){
    st='over';upd();sfx.over();mnE.style.display='none';pbE.style.display='none';upbE.style.display='none';
    ov.innerHTML='<h1>YOU DIED</h1><p>Убито голубей: '+kills+'</p><b>TAP TO RETRY</b><button id="tomenu" class="mbtn sm">МЕНЮ</button>';ov.style.display='flex';
  }
}

