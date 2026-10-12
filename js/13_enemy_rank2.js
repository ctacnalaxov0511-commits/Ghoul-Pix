// Enemy rank 2: sword attack and drawing
let bossDown=0;
// CCG rank 2: slower (x0.8) and hits 1.2x harder with a quinque sword; the swing animation lives in the sprite frames
function swordTick(e,dt,d,dx,dy){
  if(e.sw!=null){
    e.sw+=dt;
    if(!e.swh&&e.sw>=.24){
      e.swh=1;sfx.slash();
      const a=e.sd*Math.PI/4,pd=Math.hypot(p.x-e.x,p.y-e.y);
      if(pd<32&&((p.x-e.x)*Math.cos(a)+(p.y-e.y)*Math.sin(a))/(pd||1)>.3&&!pS&&!(p.dash>0)&&!(p.ks>0)){p.hp-=1.2;p.hurt=.2;sfx.hurt();hurtFx();upd()}
    }
    if(e.sw>=.5){e.sw=null;e.cd=.9}
  }else if(d<26&&e.cd<=0&&!pS){e.sw=0;e.swh=0;e.sd=dirOf(dx,dy);sfx.tele()}
}
function drawE2(o){
  const x=Math.round(o.x),y=Math.round(o.y),d=o.dir||0;let f;
  if(o.sw!=null){const t=o.sw;f=8+(t<.12?0:t<.24?1:t<.36?2:3)}
  else f=o.idle?(Math.sin(time*3+o.x)>.2?1:0):2+((time*6.4+o.x*.1|0)%6);
  if(!shOff){ctx.fillStyle='rgba(8,6,16,.4)';ctx.fillRect(x-4,y-1,8,1);ctx.fillRect(x-6,y,12,1);ctx.fillRect(x-4,y+1,8,1);}
  ctx.drawImage(o.hurt>0?FLASH:IMG,(f%8)*FW,E2_Y+(d*2+(f>=8?1:0))*FH,FW,FH,x-12,y-34,FW,FH);
}
let shOff=false,shake=0,dust=[],cracks=[];
