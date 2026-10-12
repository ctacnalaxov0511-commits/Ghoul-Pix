// Super attacks: Touka crystals, Juuzou scythe and boomerang
const supE=document.getElementById('sup');
let supReq=false,tipIdx=0,lastHitT=0,sh=[];
supE.addEventListener('pointerdown',e=>{supReq=true;e.stopPropagation()});
function startSuper(){
  if(CHS[p.ch].ksuper){if(!(p.ks>0)&&!(p.atk>0)&&!pS&&!(p.dash>0))startKSuper();return}
  if(CHS[p.ch].scythe){if(p.scy&&!(p.atk>0))throwScythe();return}
  let best=null,bd=150;
  for(const e of en){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;best=e}}
  if(best){const d=bd||1;p.fx=(best.x-p.x)/d;p.fy=(best.y-p.y)/d}
  p.sp=2.4;p.sup=0;p.sq=.25;p.atk=0;sfx.sup();
}
function fireShard(){
  const NTs=p.rage>0?CHS[p.ch].tr:CHS[p.ch].tn;
  tipIdx=(tipIdx+1)%NTs;
  const sd=tipIdx-(NTs-1)/2,px=-p.fy,py=p.fx,a=Math.atan2(p.fy,p.fx)+(Math.random()-.5)*.14;
  if(sh.length<220)sh.push({x:p.x+p.fx*16+px*sd*6,y:p.y+p.fy*16+py*sd*6,vx:Math.cos(a)*230,vy:Math.sin(a)*230,t:.75*rf()});
  if(tipIdx%2===0)sfx.crystal();
}
function updSH(dt){
  for(const s of sh){
    s.x+=s.vx*dt;s.y+=s.vy*dt;s.t-=dt;
    if(solid(s.x,s.y)){s.t=0;continue}
    for(const e of en){
      if(e.hp<=0||Math.hypot(e.x-s.x,e.y-s.y)>=(e.boss?14:9))continue;
      s.t=0;
      if(!pS){e.hp-=(1+p.upD)*fm();e.hurt=.12;if(!e.boss){e.kx+=s.vx*.1;e.ky+=s.vy*.1}if(time-lastHitT>.06){sfx.hit();lastHitT=time}}
      burst(s.x,s.y-8,3,['#ff6a7e','#ffd0c8'],70,.2,0);fx.push({x:s.x,y:s.y-8,t:.2});break;
    }
  }
  sh=sh.filter(s=>s.t>0);
}
function drawSH(){
  const cols=[KF[4],KF[3],KF[2],KF[1],KF[1]];
  for(const s of sh){
    const l=Math.hypot(s.vx,s.vy),ux=s.vx/l,uy=s.vy/l,x=s.x,y=s.y-12;
    ctx.fillStyle=KF[0];ctx.fillRect(Math.round(x)-1,Math.round(y)-1,4,4);
    for(let i=0;i<5;i++){ctx.fillStyle=cols[i];const n=i<2?2:1;ctx.fillRect(Math.round(x-ux*i*1.6),Math.round(y-uy*i*1.6),n,n)}
  }
}
// super pose: wings arch over the shoulders and point forward in front of the face, shaking while they fire
function superK(part){
  const el=2.4-p.sp,tm=el<.25?el/.25:el>2.25?Math.max(0,1-(el-2.25)/.15):1;
  if(tm<=.03)return;
  const NTs=p.rage>0?CHS[p.ch].tr:CHS[p.ch].tn,f=[p.fx,p.fy],px=-p.fy,py=p.fx,A=part==='b'?.35:0,B=part==='a'?.35:1;
  for(let i=0;i<NTs;i++){
    const sd=i-(NTs-1)/2,O=[p.x-p.fx*3+px*sd*2.4,p.y-13-p.fy*3+py*sd*2.4];
    const T=[p.x+f[0]*16+px*sd*6,p.y+f[1]*16+py*sd*6-12],sw=Math.sin(time*18+i*1.7)*1.2;
    const P1=[O[0]-f[0]*14+px*sd*9,O[1]-f[1]*8-14],P2=[T[0]-f[0]*10+px*sd*3+sw,T[1]-f[1]*6-9+sw];
    tendX(t=>bez(O,P1,P2,T,t),tm,Math.round((Math.hypot(T[0]-O[0],T[1]-O[1])+30)*tm/2)+4,A,B);
    if(el>.25&&el<2.25&&tm>.9&&((time*30|0)+i)%2===0){ctx.fillStyle=KF[4];ctx.fillRect(Math.round(T[0])-1,Math.round(T[1]),3,1);ctx.fillRect(Math.round(T[0]),Math.round(T[1])-1,1,3)}
  }
}
const SWJ=.3,SCY=new Image();SCY.src='assets/scythe.png';
function prow(){const c=CHS[p.ch];if(curX>=0){if(c.scythe)return(p.scy&&!(p.atk>0)&&!(p.rage>0))?12:13;return 10+(p.rage>0?1:0)}if(c.ksuper&&p.ks>0&&p.kst<1.5)return p.rage>0?9:7;if(c.ksuper&&p.rage>0)return 8;if(c.scythe)return(p.scy&&!(p.atk>0)&&!(p.rage>0))?4:5;return c.row+(c.eyes&&p.rage>0?1:0)}
function hitE(e,dmg,kb){
  sfx.hit();sparkAt(e);e.hp-=dmg;e.hurt=.15;
  const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy)||1,k=e.boss?12:kb;e.kx=dx/d*k;e.ky=dy/d*k;
  fx.push({x:e.x,y:e.y-6,t:.25});
}
const angD=(a,b)=>{const d=a-b;return Math.atan2(Math.sin(d),Math.cos(d))};
function throwScythe(){
  p.sup=0;p.scy=false;p.thr=.3;sfx.slash();
  let best=null,bd=1e9;
  for(const e of en){if(e.hp<=0)continue;const q=Math.hypot(e.x-p.x,e.y-p.y);if(q<bd){bd=q;best=e}}
  let tx=p.fx,ty=p.fy;if(best&&bd<400){tx=best.x-p.x;ty=best.y-p.y}
  const d=Math.hypot(tx,ty)||1;p.fx=tx/d;p.fy=ty/d;
  p.bm={x:p.x,y:p.y,sx:p.x,sy:p.y,dx:tx/d,dy:ty/d,ph:0,a:0};
  for(const e of en)e.sbh=0;
}
function scytheTick(dt){
  if(p.thr>0)p.thr-=dt;
  // normal swing: a wide arc in front, every enemy the blade passes through is hit once
  if(p.atk>0&&p.swh){
    const u=Math.min(1,Math.max(0,1-p.atk/SWJ)),a=Math.atan2(p.fy,p.fx)-1.5+3*u;p.sa=a;
    if(!pS)for(const e of en){
      if(p.swh.has(e)||e.hp<=0)continue;
      const dx=e.x-p.x,dy=e.y-p.y;
      if(Math.hypot(dx,dy)>(e.boss?58:52)*rf())continue;
      if(Math.abs(angD(Math.atan2(dy,dx),a))<.5){p.swh.add(e);hitE(e,dmgOf(e),140)}
    }
  }
  // rage: continuous 360 spin
  if(p.rage>0){
    p.spa=(p.spa||0)+12.5*dt;
    if(!pS&&p.scy)for(const e of en){
      if(e.hp<=0||(e.sph||0)>time)continue;
      const dx=e.x-p.x,dy=e.y-p.y;
      if(Math.hypot(dx,dy)>(e.boss?62:56)*rf())continue;
      if(Math.abs(angD(Math.atan2(dy,dx),p.spa))<.6){e.sph=time+.35;hitE(e,dmgOf(e),140)}
    }
  }
  // boomerang: 5 tiles out, then homes onto the player's current position
  const b=p.bm;
  if(b){
    b.a+=dt*10;
    if(b.ph===0){
      const nx=b.x+b.dx*230*dt,ny=b.y+b.dy*230*dt;
      if(solid(nx,ny)||Math.hypot(nx-b.sx,ny-b.sy)>=200*rf())b.ph=1;else{b.x=nx;b.y=ny}
    }else{
      const tx=p.x-b.x,ty=p.y-b.y,d=Math.hypot(tx,ty)||1;
      if(d<10){p.bm=null;p.scy=true;sfx.crystal();return}
      b.x+=tx/d*270*dt;b.y+=ty/d*270*dt;
    }
    if(!pS)for(const e of en){
      if(e.hp<=0||(e.sbh||0)>time)continue;
      if(Math.hypot(e.x-b.x,e.y-b.y)<(e.boss?22:18)){e.sbh=time+.5;hitE(e,(1+p.upD)*fm(),90)}
    }
  }
}
function drawScy(){
  if(!CHS[p.ch].scythe||!SCY.complete)return;
  let a=null;
  if(p.atk>0&&p.swh)a=p.sa;else if(p.rage>0&&p.scy)a=p.spa||0;
  if(a===null)return;
  const cx=Math.round(p.x),cy=Math.round(p.y-12),n=p.rage>0?10:8;
  for(let k=1;k<=n;k++){
    ctx.fillStyle='rgba(255,208,216,'+(.55-k*.05)+')';
    for(const r of[34,44,54])ctx.fillRect(Math.round(cx+Math.cos(a-k*.14)*r),Math.round(cy+Math.sin(a-k*.14)*r),2,2);
  }
  ctx.imageSmoothingEnabled=false;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(a);ctx.drawImage(SCY,-4,-20);ctx.restore();
}
function drawBM(){
  const b=p&&p.bm;if(!b||!SCY.complete)return;
  ctx.fillStyle='rgba(8,6,16,.4)';ctx.fillRect(Math.round(b.x)-5,Math.round(b.y),10,2);
  ctx.imageSmoothingEnabled=false;
  ctx.save();ctx.translate(Math.round(b.x),Math.round(b.y-10));ctx.rotate(b.a);ctx.drawImage(SCY,-32,-20);ctx.restore();
}
