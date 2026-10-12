// Particles, dust, cracks and Kaneki super (impale and slam)
// ---- Kaneki super: impale up to 4 enemies, lift them and slam them into the floor twice ----
const eo=u=>1-Math.pow(1-u,3);
function dustAt(x,y,n){
  for(let i=0;i<n;i++){const a=Math.random()*6.283,s=25+Math.random()*55;dust.push({x:x+Math.cos(a)*3,y:y+Math.sin(a)*1.5,vx:Math.cos(a)*s,vy:Math.sin(a)*s*.4-18-Math.random()*30,t:.5+Math.random()*.4,s:2+(Math.random()*2|0)})}
  for(let i=0;i<12;i++){const a=i*.5236;dust.push({x:x+Math.cos(a)*4,y:y+Math.sin(a)*2,vx:Math.cos(a)*70,vy:Math.sin(a)*28,t:.3,s:2})}
}
function crack(x,y,n){for(let i=0;i<5+n;i++)cracks.push({x,y,a:Math.random()*6.283,l:8+Math.random()*8,t:1.6})}
function updDust(dt){
  for(const d of dust){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=(d.g===undefined?90:d.g)*dt;d.vx*=.97;d.t-=dt}
  dust=dust.filter(d=>d.t>0);cracks=cracks.filter(c=>(c.t-=dt)>0);
  ghosts=ghosts.filter(g=>(g.t-=dt)>0);ftx=ftx.filter(f=>{if(f.fol){f.oy-=7*dt;f.x=p.x;f.y=p.y+f.oy}else f.y-=18*dt;return(f.t-=dt)>0});
  if(shake>0)shake-=dt;else shakeA=0;
}
function drawDust(){
  dust.forEach((d,i)=>{ctx.globalAlpha=Math.min(1,d.t/.35);ctx.fillStyle=d.c||(i%3?'#9a94b8':'#cfcae6');ctx.fillRect(Math.round(d.x),Math.round(d.y),d.s,d.s)});
  ctx.globalAlpha=1;
}
function drawCracks(){
  for(const c of cracks){
    ctx.globalAlpha=Math.min(1,c.t/.6);ctx.fillStyle='#14101c';
    for(let s=2;s<c.l;s++)ctx.fillRect(Math.round(c.x+Math.cos(c.a)*s+((s*7)%3-1)*.5),Math.round(c.y+Math.sin(c.a)*s*.55),1,1);
  }
  ctx.globalAlpha=1;
}
function drawLifted(o){
  const g=Math.max(0,1-o.z/40),x=Math.round(o.x),y=Math.round(o.y),w=Math.max(2,Math.round(6*g));
  ctx.fillStyle='rgba(8,6,16,.4)';ctx.fillRect(x-w,y,w*2,1);ctx.fillRect(x-w+2,y+1,w*2-4,1);
  shOff=true;const oy=o.y;o.y-=o.z;
  if(o.boss)drawBoss(o);else if(o.ty===2)drawE3(o);else if(o.ty)drawE2(o);else drawSpr(1,o.dir||0,2+((time*14|0)%6),o.x,o.y,o.hurt>0);
  o.y=oy;shOff=false;
}
function startKSuper(){
  const ds=e=>Math.hypot(e.x-p.x,e.y-p.y);
  const list=en.filter(e=>e.hp>0&&!e.held&&ds(e)<120*rf()).sort((a,b)=>ds(a)-ds(b)).slice(0,4);
  if(!list.length){sfx.click();return}
  const d=ds(list[0])||1;p.fx=(list[0].x-p.x)/d;p.fy=(list[0].y-p.y)/d;
  p.ks=1.7;p.kst=0;p.sup=0;p.atk=0;
  p.kt=list.map(e=>{e.held=true;e.z=0;e.sw=null;return{e}});
  sfx.sup();
}
function slamE(e,n){
  if(e.hp>0){e.hp-=((e.boss?3:1)+p.upD)*fm();e.hurt=.2}
  sfx.slam();addShake(n===1?.2:.32,n===1?3.5:5);hs=.07;
  dustAt(e.x,e.y,n===1?14:22);crack(e.x,e.y,n);
  fx.push({x:e.x,y:e.y-4,t:.3,big:1});
}
function ksTick(dt){
  p.kst+=dt;p.ks-=dt;const el=p.kst;
  for(const t of p.kt){
    const e=t.e,sc=e.boss?.4:1;let z=0;
    if(el>=.30&&el<.62)z=26*sc*eo((el-.30)/.32);
    else if(el>=.62&&el<.76)z=26*sc*(1-Math.pow((el-.62)/.14,3));
    else if(el>=.90&&el<1.15)z=22*sc*eo((el-.90)/.25);
    else if(el>=1.15&&el<1.28)z=22*sc*(1-Math.pow((el-1.15)/.13,3));
    e.z=z;e.dir=dirOf(p.x-e.x,p.y-e.y);
    if(!t.rel){
      e.held=true;
      if(z>0&&((time*30)|0)%4===0)e.hurt=Math.max(e.hurt,.05);
      if(el>=.30&&!t.s0){t.s0=1;sfx.hit();fx.push({x:e.x,y:e.y-12,t:.3,big:1})}
      if(el>=.76&&!t.h1){t.h1=1;slamE(e,1)}
      if(el>=1.28&&!t.h2){t.h2=1;slamE(e,2)}
      if(el>=1.30){t.rel=1;e.held=false;e.z=0;const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy)||1;e.kx=dx/d*120;e.ky=dy/d*120;e.cd=.9}
    }
  }
  if(p.ks<=0){for(const t of p.kt){t.e.held=false;t.e.z=0}p.ks=0;p.kt=null}
}
// one tendril per impaled enemy; the tip passes through the body and follows it up and down
function ksK(part){
  if(!p.kt)return;
  const el=p.kst,n=p.kt.length,f=[p.fx,p.fy],px=-p.fy,py=p.fx,A=part==='b'?.35:0,B=part==='a'?.35:1;
  const tm=el<.30?el/.30:el<1.30?1:Math.max(0,1-(el-1.30)/.38);
  if(tm<=.02)return;
  p.kt.forEach((t,i)=>{
    const e=t.e,sd=(i-(n-1)/2)*1.3,O=[p.x-p.fx*3+px*sd*1.6,p.y-9-p.fy*3+py*sd*1.6];
    const cyE=e.y-(e.z||0)-14,dx=e.x-O[0],dy=cyE-O[1],L=Math.hypot(dx,dy)||1;
    const w=(el>.3&&el<1.3)?Math.sin(time*25+i)*1.2:0,T=[e.x+dx/L*5+w,cyE+dy/L*5];
    tendX(atkPath(sd,O,T,f),tm,Math.max(8,Math.round((Math.hypot(T[0]-O[0],T[1]-O[1])+26)*tm/2)),A,B);
  });
}
