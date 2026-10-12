// Enemy rank 3 (case attack) and rank 1 (stretching sword)
// CCG rank 3: swings the silver case (windup 0.44 s, hit at 0.2 s, 1 damage); animation frames are part of the sprite
function caseTick(e,dt,d,dx,dy){
  if(e.sw!=null){
    e.sw+=dt;
    if(!e.swh&&e.sw>=.2){
      e.swh=1;sfx.slash();
      const a=e.sd*Math.PI/4,pd=Math.hypot(p.x-e.x,p.y-e.y);
      if(pd<24&&((p.x-e.x)*Math.cos(a)+(p.y-e.y)*Math.sin(a))/(pd||1)>.2&&!pS&&!(p.dash>0)&&!(p.ks>0)){p.hp-=1;p.hurt=.2;sfx.hurt();hurtFx();upd()}
    }
    if(e.sw>=.44){e.sw=null;e.cd=.9}
  }else if(d<20&&e.cd<=0&&!pS){e.sw=0;e.swh=0;e.sd=dirOf(dx,dy)}
}
function drawGA(o){
  const x=Math.round(o.x),y=Math.round(o.y),t=o.sw,f=t<.1?0:t<.2?1:t<.32?2:3;
  if(!shOff){ctx.fillStyle='rgba(8,6,16,.4)';ctx.fillRect(x-4,y-1,8,1);ctx.fillRect(x-6,y,12,1);ctx.fillRect(x-4,y+1,8,1)}
  ctx.drawImage(o.hurt>0?FLASH:IMG,f*FW,GA_Y+(o.dir||0)*FH,FW,FH,x-12,y-34,FW,FH);
}
// CCG rank 1: sword hits 1.56 (+30% vs rank 2); special attack stretches the blade 2 tiles (32 px) beyond its length
function sword2Tick(e,dt,d,dx,dy){
  if(e.sw!=null){
    e.sw+=dt;
    if(e.sk==='t'){
      if(!e.swh&&e.sw>=.35){
        e.swh=1;sfx.dash();
        const px=p.x-e.x,py=p.y-e.y,al=px*e.ax+py*e.ay,pr=Math.abs(-px*e.ay+py*e.ax);
        if(al>0&&al<56&&pr<11&&!pS&&!(p.dash>0)&&!(p.ks>0)){p.hp-=1.56;p.hurt=.2;sfx.hurt();hurtFx();upd()}
      }
      if(e.sw>=.7){e.sw=null;e.cd=1}
    }else{
      if(!e.swh&&e.sw>=.24){
        e.swh=1;sfx.slash();
        const a=e.sd*Math.PI/4,pd=Math.hypot(p.x-e.x,p.y-e.y);
        if(pd<32&&((p.x-e.x)*Math.cos(a)+(p.y-e.y)*Math.sin(a))/(pd||1)>.3&&!pS&&!(p.dash>0)&&!(p.ks>0)){p.hp-=1.56;p.hurt=.2;sfx.hurt();hurtFx();upd()}
      }
      if(e.sw>=.5){e.sw=null;e.cd=.9}
    }
  }else if(e.cd<=0&&!pS){
    if(d<26){e.sw=0;e.swh=0;e.sk='s';e.sd=dirOf(dx,dy);sfx.tele()}
    else if(d<58){e.sw=0;e.swh=0;e.sk='t';e.sd=dirOf(dx,dy);e.ax=dx/d;e.ay=dy/d;sfx.tele()}
  }
}
function drawE3(o){
  const x=Math.round(o.x),y=Math.round(o.y),d=o.dir||0;let f;
  if(o.sw!=null){
    const t=o.sw;
    f=o.sk==='t'?(t<.35?12:13):8+(t<.12?0:t<.24?1:t<.36?2:3);
    if(o.sk==='t'&&t<.35){ctx.fillStyle='rgba(224,32,60,'+(.15+.3*t/.35)+')';for(let s=14;s<=56;s+=4)for(const w of[-3,3])ctx.fillRect(Math.round(x+o.ax*s-o.ay*w)-2,Math.round(y+o.ay*s+o.ax*w)-2,4,4)}
  }else f=o.idle?(Math.sin(time*3+o.x)>.2?1:0):2+((time*6.8+o.x*.1|0)%6);
  if(!shOff){ctx.fillStyle='rgba(8,6,16,.4)';ctx.fillRect(x-4,y-1,8,1);ctx.fillRect(x-6,y,12,1);ctx.fillRect(x-4,y+1,8,1)}
  ctx.drawImage(o.hurt>0?FLASH:IMG,(f%8)*FW,E3_Y+(d*2+(f>=8?1:0))*FH,FW,FH,x-12,y-34,FW,FH);
  if(o.sw!=null&&o.sk==='t'&&o.sw>=.35&&o.sw<.62){
    const t=o.sw,pr=Math.min(1,(t-.35)/.08)*(t>.55?(.62-t)/.07:1),H=[o.x+o.ax*20,o.y-14],T=[H[0]+o.ax*32*pr,H[1]+o.ay*32*pr];
    if(pr>.05)tendF(tt=>[H[0]+(T[0]-H[0])*tt,H[1]+(T[1]-H[1])*tt],1,Math.round(32*pr)+8,0,1);
  }
}
