// Rendering: kagune drawing, world render and main loop
// ---- render ----
const KC=['#2a0510','#6a0c24','#c4183a','#ff4d6a'];
// draw one tendril: fn(t)->[x,y]; only the first tmax of the curve (growth), samples sa..sb (0..1) of that part
function tend(fn,tmax,N,sa,sb){
  const a=Math.round(sa*N),b=Math.round(sb*N);
  for(let pass=0;pass<3;pass++)for(let j=a;j<=b;j++){
    const s=j/N,q=fn(s*tmax),X=Math.round(q[0]),Y=Math.round(q[1]),r=Math.max(0,Math.round(2.6*(1-s*.82)));
    if(pass===0){ctx.fillStyle=KC[0];ctx.fillRect(X-r-1,Y-r-1,2*r+3,2*r+3)}
    else if(pass===1){ctx.fillStyle=j%4<2?KC[2]:KC[1];ctx.fillRect(X-r,Y-r,2*r+1,2*r+1)}
    else if(j%4<2){ctx.fillStyle=KC[3];ctx.fillRect(X-r,Y-r,Math.max(1,r),1)}
  }
}
function bez(A,B,C,D,t){const u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;return[a*A[0]+b*B[0]+c*C[0]+d*D[0],a*A[1]+b*B[1]+c*C[1]+d*D[1]]}
// path from the back (O): swings backward and up, arcs over the shoulder, then strikes the target T
function atkPath(sd,O,T,f){
  const px=-f[1],py=f[0],bx=-f[0],by=-f[1],ab=Math.abs(sd);
  const P1=[O[0]+bx*(10+3*ab)+px*sd*7,O[1]+by*(10+3*ab)+py*sd*7-7];
  const P2=[O[0]+(T[0]-O[0])*.5+px*sd*5,O[1]+(T[1]-O[1])*.5+py*sd*5-13-2*ab];
  const P3=[T[0]+px*sd*3,T[1]+py*sd*3];
  return t=>bez(O,P1,P2,P3,t);
}
function tendX(fn,tmax,N,sa,sb){CHS[p.ch].wing?tendF(fn,tmax,N*2,sa,sb):tend(fn,tmax,N,sa,sb)}
// Ukaku: crystalline feather-blade (thin base, widest at ~1/3, razor tip), faceted light/dark sides, shard spikes
const KF=['#3a0a1e','#8a1230','#e8243e','#ff6a6a','#ffd0c8'];
function tendF(fn,tmax,N,sa,sb){
  const a=Math.round(sa*N),b=Math.round(sb*N),sh=Math.max(3,Math.round(N/7));
  for(let pass=0;pass<3;pass++)for(let j=a;j<=b;j++){
    const s=j/N,q=fn(s*tmax),q2=fn(Math.min(tmax,s*tmax+.02)),tx=q2[0]-q[0],ty=q2[1]-q[1],tl=Math.hypot(tx,ty)||1,nx=-ty/tl,ny=tx/tl;
    const rr=Math.max(.5,3.6*Math.sin(Math.PI*Math.pow(Math.min(1,s),.7))),wm=Math.ceil(rr)+1;
    for(let w=-wm;w<=wm;w++){
      const aw=Math.abs(w);let col=null;
      if(pass===0){if(aw<=rr+1)col=KF[0]}
      else if(pass===1){if(aw<=rr)col=w<-rr*.35?KF[3]:w>rr*.35?KF[1]:KF[2]}
      else if(aw<=rr&&w===Math.round(-rr*.55)&&j%3)col=KF[4];
      if(col){ctx.fillStyle=col;ctx.fillRect(Math.round(q[0]+nx*w),Math.round(q[1]+ny*w),1,1)}
    }
    if(pass===2&&j%sh===0&&s>.15&&s<.85){
      const sg=(j/sh)%2?1:-1,ox=q[0]+nx*sg*(rr+1.5),oy=q[1]+ny*sg*(rr+1.5);
      ctx.fillStyle=KF[0];ctx.fillRect(Math.round(ox+tx/tl*2)-1,Math.round(oy+ty/tl*2)-1,3,3);
      ctx.fillStyle=KF[3];ctx.fillRect(Math.round(ox+tx/tl),Math.round(oy+ty/tl),1,1);ctx.fillStyle=KF[2];ctx.fillRect(Math.round(ox+tx/tl*2),Math.round(oy+ty/tl*2),1,1);
    }
  }
}
const envT=(u,dur,a,b)=>Math.max(0,Math.min(1,u/a,(dur-u)/b));
// extra hits on one enemy: the tendril pulls back and jabs again
function stDip(s,u){
  let f=1;const h0=SWING*.3;
  for(let i=1;i<s.nh;i++){const w=u-(h0+(i-1)*.13);if(w>0&&w<.13)f=Math.min(f,1-.5*Math.sin(Math.PI*w/.13))}
  return f;
}
// normal attack: each strike is its own tendril that grows from the back to its enemy, one after another
function kagune(part){
  const el=p.tot-p.atk,n=p.st.length,f=[p.fx,p.fy],px=-p.fy,py=p.fx,A=part==='b'?.35:0,B=part==='a'?.35:1;
  for(const s of p.st){
    const u=el-s.d,dur=SWING+(s.nh-1)*.13;if(u<0||u>dur)continue;
    const e=envT(u,dur,.09,.08)*stDip(s,u);if(e<=.03)continue;
    const sd=(s.i-(n-1)/2)*1.3,O=[p.x-p.fx*3+px*sd*1.6,p.y-13-p.fy*3+py*sd*1.6],T=s.e?[s.e.x,s.e.y-8]:s.t;
    tendX(atkPath(sd,O,T,f),e,Math.max(6,Math.round((Math.hypot(T[0]-O[0],T[1]-O[1])+24)*e/2)),A,B);
  }
}
// dash: tendrils plant on the ground behind and push the body forward
function dashK(){
  if(!p.dtot||p.del>=p.dtot+.12)return;
  const el=p.del,tm=el<p.dtot?Math.min(1,el/.06):1-(el-p.dtot)/.12;
  if(tm<=.02)return;
  const prog=Math.min(1,el/p.dtot),px=-p.fy,py=p.fx,arch=14*(1-prog)+3;
  p.dp.forEach((q,i)=>{
    const sd=i-(p.dp.length-1)/2,O=[p.x-p.fx*3+px*sd*2.6,p.y-14-p.fy*3+py*sd*2.6+Math.abs(sd)*1.5],ar=arch*(1+.15*Math.abs(sd));
    const P1=[O[0]+(q.x-O[0])*.33,O[1]+(q.y-O[1])*.33-ar],P2=[O[0]+(q.x-O[0])*.67,O[1]+(q.y-O[1])*.67-ar*.5];
    tendX(t=>bez(O,P1,P2,[q.x,q.y],t),tm,Math.round((Math.hypot(q.x-O[0],q.y-O[1])+16)*tm/2)+4,0,1);
  });
}
function render(){
  if(camX===null){camX=p.x;camY=p.y}
  const ttx=p.x+(p.walk||p.dash>0?p.fx*20:0),tty=p.y+(p.walk||p.dash>0?p.fy*20:0);camX+=(ttx-camX)*.1;camY+=(tty-camY)*.1;
  const sa=shake>0?shakeA:0,sk=sa?Math.round((Math.random()*2-1)*sa):0,sk2=sa?Math.round((Math.random()*2-1)*sa):0,
  cx=Math.round(Math.max(0,Math.min(MW*T-W,camX-W/2)))+sk,cy=Math.round(Math.max(0,Math.min(MH*T-H,camY-H/2+12)))+sk2;
  ctx.setTransform(1,0,0,1,-cx,-cy);
  ctx.fillStyle='#0c0a12';ctx.fillRect(cx,cy,W,H);
  for(let y=cy/T|0;y<=(cy+H)/T;y++)for(let x=cx/T|0;x<=(cx+W)/T;x++){
    if(x>=MW||y>=MH)continue;
    const h=(x*73+y*37)%97;
    drawTile(x,y,h);
  }
  drawShop();drawCracks();drawGhosts();
  for(const e of en)if(e.boss)bossTele(e);
  const list=[p,...en].sort((a,b)=>a.y-b.y);
  for(const o of list){
    if(o===p){
      const kf=kFrame(),dv=!CHS[p.ch].scythe&&p.dtot>0&&p.del<p.dtot+.12,rg=p.rage>0&&!dv&&!(p.sp>0)&&!CHS[p.ch].scythe&&!(p.ks>0),fr=rg&&p.by>.3,av=p.atk>0&&!(p.rage>0)&&!dv,fv=p.fy>.3,df=dv&&p.fy<-.3,su=p.sp>0,sa=su&&p.fy<-.3;if(dv&&!df)dashK();if(rg&&!fr)rageK();if(av&&fv)kagune('a');if(p.ks>0&&fv)ksK('a');if(su){if(fv)superK('a');else if(sa)superK('all')}if(CHS[p.ch].scythe&&p.rage>0&&p.scy)drawScy();drawSpr(prow(),kf.d,kf.f,p.x,p.y,p.hurt>0);if(fr)rageK();if(df)dashK();if(su){if(fv)superK('b');else if(!sa)superK('all')}if(!(p.rage>0&&p.scy))drawScy();
      if(av)kagune(fv?'b':'all');
    }else if(o.z)drawLifted(o);else if(o.boss)drawBoss(o);else if(o.ty===2)drawE3(o);else if(o.ty)drawE2(o);else if(o.sw!=null)drawGA(o);else drawSpr(1,o.dir||0,o.idle?(Math.sin(time*3+o.x)>.2?1:0):2+((time*8+o.x*.1|0)%6),o.x,o.y,o.hurt>0);
  }
  if(p.ks>0)ksK(p.fy>.3?'b':'all');
  drawBladeExt();drawDust();drawFtx();drawPJ();drawSH();drawBM();
  for(const f of fx){
    const s=f.big?4:2,a=f.t*8;ctx.fillStyle=f.big?'#e0203c':'#fff';
    for(let i=0;i<6;i++){const an=i*1.05;ctx.fillRect(Math.round(f.x+Math.cos(an)*(4-a)*s/2),Math.round(f.y+Math.sin(an)*(4-a)*s/2),2,2)}
  }
}
let last=performance.now();
function loop(n){
  const dt=Math.min(.05,(n-last)/1000);last=n;
  if(st==='play'){let d2=dt;if(slow>0){slow-=dt;d2=dt*.35}if(hs>0)hs-=dt;else update(d2)}else if(st==='dim')dimTick(dt);
  if(p&&ready&&readyB&&readyB2&&st!=='menu'){if(st==='dim')renderDim();else{render();if(p.rage>0)vig();drawFlash(dt)}}
  requestAnimationFrame(loop);
}
