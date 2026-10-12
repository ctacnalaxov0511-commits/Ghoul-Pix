// Boss 2 (EXECUTIONER): AI, telegraphs, stretched blade
let bossIdx=0;const bossAt=i=>i===0?50:150+100*(i-1),bnmE=document.getElementById('bnm'),STR=170;
// EXECUTIONER (boss 2): kagune-sword; slash (cone), blade stretch (long thrust), roar (summon at 50%, rage at 25%). Hits 2x harder, 1.5x hp, 1.6x speed vs REAPER
function boss2AI(e,dt,dx,dy,d){
  const half=e.hp<=e.max/2,q4=e.hp<=e.max/4,v=48*(e.rage?1.2:1)*(half?1.1:1);
  e.hurt-=0;e.d=dirOf(dx,dy);e.f=0;
  if(e.st==='chase'){
    const [ux,uy]=stepDir(e,dx,dy,d);
    tryMove(e,ux*v*dt,uy*v*dt);e.d=dirOf(ux,uy);e.f=2+((time*9|0)%6);
    if(e.t<=0){
      const r=Math.random();
      if(half&&!e.s1){e.s1=1;e.st='roar';e.t=.9;e.sm=1;sfx.boss();addShake(.4,3);flashA=.3;flashC='224,32,60'}
      else if(q4&&!e.s2){e.s2=1;e.st='roar';e.t=.9;e.sm=0;sfx.boss();addShake(.4,3);flashA=.3;flashC='224,32,60'}
      else if(d<58&&r<.7){e.st='slash';e.t=.5;e.ax=dx/d;e.ay=dy/d;sfx.tele()}
      else if(d<200&&r<.75){e.st='stretch';e.t=.6;e.ax=dx/d;e.ay=dy/d;sfx.tele()}
      else e.t=.5;
    }
  }else if(e.st==='slash'){
    e.d=dirOf(e.ax,e.ay);e.f=8;
    if(e.t<=0){
      sfx.slash();addShake(.25,4);
      if(d<62&&(dx*e.ax+dy*e.ay)/d>.35)hurtP(4);
      for(let i=0;i<9;i++){const a=Math.atan2(e.ay,e.ax)+(i-4)*.3;fx.push({x:e.x+Math.cos(a)*40,y:e.y+Math.sin(a)*40-6,t:.3,big:1})}
      e.st='slash2';e.t=.2;
    }
  }else if(e.st==='slash2'){e.d=dirOf(e.ax,e.ay);e.f=10;if(e.t<=0){e.st='rec';e.t=.5}}
  else if(e.st==='stretch'){
    if(e.t>.25){e.ax=dx/d;e.ay=dy/d}
    e.d=dirOf(e.ax,e.ay);e.f=12;
    if(e.t<=0){sfx.dash();e.st='stretch2';e.t=.3;e.hit=0}
  }else if(e.st==='stretch2'){
    e.d=dirOf(e.ax,e.ay);e.f=13;
    if(!e.hit){e.hit=1;addShake(.3,4);const px=p.x-e.x,py=p.y-e.y,al=px*e.ax+py*e.ay,pr=Math.abs(-px*e.ay+py*e.ax);if(al>0&&al<STR&&pr<12)hurtP(4)}
    if(e.t<=0){e.st='rec';e.t=.8}
  }else if(e.st==='roar'){
    e.f=e.t>.45?14:15;
    if(e.t<=0){
      if(e.sm){for(let i=0;i<3;i++){const a=i*2.1+Math.random(),x=e.x+Math.cos(a)*30,y=e.y+Math.sin(a)*30;if(free(x,y)){en.push({x,y,hp:4,hurt:0,cd:0,kx:0,ky:0,face:1,ty:1});fx.push({x,y:y-6,t:.4,big:1})}}}
      else e.rage=true;
      e.st='rec';e.t=.5;
    }
  }else{e.f=0;if(e.t<=0){e.st='chase';e.t=.7+Math.random()*.6}}
  tryMove(e,e.kx*dt,e.ky*dt);e.kx*=.85;e.ky*=.85;
  if(d<14&&e.cd<=0&&e.st==='chase'){e.cd=1;hurtP(2)}
}
function bossTele2(e){
  const ex=Math.round(e.x),ey=Math.round(e.y);
  if(e.st==='slash'){
    const pr=1-Math.max(0,e.t)/.5,a0=Math.atan2(e.ay,e.ax);
    ctx.fillStyle='rgba(224,32,60,'+(.18+.3*pr)+')';
    for(let yy=-62;yy<=62;yy+=2)for(let xx=-62;xx<=62;xx+=2){
      const r2=xx*xx+yy*yy;if(r2>3844||r2<16)continue;
      let da=Math.atan2(yy,xx)-a0;da=Math.atan2(Math.sin(da),Math.cos(da));
      if(Math.abs(da)<1.2)ctx.fillRect(ex+xx,ey+yy,2,2);
    }
  }else if(e.st==='stretch'){
    const pr=1-Math.max(0,e.t)/.6;
    ctx.fillStyle='rgba(224,32,60,'+(.12+.35*pr)+')';
    for(let s=14;s<=STR;s+=4)for(const w of[-4,0,4])ctx.fillRect(Math.round(ex+e.ax*s-e.ay*w)-2,Math.round(ey+e.ay*s+e.ax*w)-2,4,4);
  }
}
// the stretched kagune-sword: crystal blade from the boss's hand across the arena
function drawBladeExt(){
  for(const e of en){
    if(e.bt!==1||e.st!=='stretch2')continue;
    const u=.3-e.t,L=STR*(u<.1?u/.1:e.t<.08?e.t/.08:1),H=[e.x+e.ax*10,e.y-16],T=[H[0]+e.ax*L,H[1]+e.ay*L];
    tendF(t=>[H[0]+(T[0]-H[0])*t,H[1]+(T[1]-H[1])*t],1,Math.round(L)+10,0,1);
  }
}
