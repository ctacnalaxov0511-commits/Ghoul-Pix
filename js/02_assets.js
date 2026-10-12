// Sprite atlas loading, sprite drawing, animation frame selection, tile drawing
// ---- Pixel art atlas: 4-tone hue-shifted ramps, one light source (top-left), selective outlines, 8-direction rig ----
const FW=24,FH=36,TY=16*FH,TOUKA_Y=656;
const JUUZOU_Y=1232,E2_Y=1808,FROG_Y=2384,PORTAL_Y=2672,KR_Y=2720,KRF_Y=3008,CAFE_Y=3296,GA_Y=3344,TX_Y=3632,JX_Y=4208,SIT_Y=4784,E3_Y=4820;
const charSY=(c,d)=>c===13?JX_Y+(8+d)*FH:c===12?JX_Y+d*FH:c===11?TX_Y+(8+d)*FH:c===10?TX_Y+d*FH:c===9?KRF_Y+d*FH:c===8?KR_Y+d*FH:c===7?FROG_Y+d*FH:c<2?(c*8+d)*FH:c<4?TOUKA_Y+((c-2)*8+d)*FH:JUUZOU_Y+((c-4)*8+d)*FH;
const IMG=new Image();let ready=false,FLASH=null;
IMG.onload=()=>{
  FLASH=document.createElement('canvas');FLASH.width=IMG.width;FLASH.height=IMG.height;
  const x=FLASH.getContext('2d');x.drawImage(IMG,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,FLASH.width,FLASH.height);
  ready=true;
};
IMG.src='assets/atlas.png';
const dirOf=(x,y)=>(Math.round(Math.atan2(y,x)/(Math.PI/4))+8)%8;
// frames per direction: 0-1 idle, 2-7 run, 8 attack
function drawSpr(c,d,f,x,y,flash){
  x=Math.round(x);y=Math.round(y);
  if(!shOff){ctx.fillStyle='rgba(8,6,16,.4)';ctx.fillRect(x-4,y-1,8,1);ctx.fillRect(x-6,y,12,1);ctx.fillRect(x-4,y+1,8,1);}
  ctx.drawImage(flash?FLASH:IMG,f*FW,charSY(c,d),FW,FH,x-12,y-34,FW,FH);
}
function kFrame(){
  let d=dirOf(p.fx,p.fy),f;
  if(p.ks>0&&CHS[p.ch].ksuper)f=(p.kst<.1||p.kst>=1.34)?0:1;else if(p.sp>0||p.ks>0)f=8;else if(p.dash>0)f=4;else if(p.atk>0)f=8;else if(p.walk)f=2+Math.floor((p.anim||0)*11)%6;else f=Math.sin(time*3)>.2?1:0;
  if(CHS[p.ch].scythe&&p.rage>0){d=((Math.round((p.spa||0)/(Math.PI/4))%8)+8)%8;f=8}
  curX=-1;
  if(CHS[p.ch].wing){
    if(p.sp>0){const el=2.4-p.sp;curX=(el<.25||el>2.25)?4:5}
    else if(p.hurt>.1)curX=6;
    else if(p.dash>0)curX=3;
    else if(p.atk>0){const k=(p.tot-p.atk)/(p.tot||.3);curX=k<.3?0:k<.6?1:2}
    if(curX>=0)f=curX;
  }
  if(CHS[p.ch].scythe){
    if(p.thr>0)curX=p.thr>.15?5:6;
    else if(p.rage>0)curX=7+(((time*9)|0)%2);
    else if(p.hurt>.1)curX=4;
    else if(p.dash>0)curX=3;
    else if(p.atk>0&&p.swh){const k=(p.tot-p.atk)/(p.tot||.3);curX=k<.3?0:k<.6?1:2}
    if(curX>=0)f=curX;
  }
  return{d,f};
}
function drawTile(x,y,h){
  const g=grid[y][x];let sx;
  if(g===1)sx=(y+1<MH&&grid[y+1][x]===0)?(10+h%4)*16:(8+h%2)*16;
  else if(g===2){
    ctx.drawImage(IMG,(h%4)*16,TY+16,16,16,x*T,y*T,16,16);
    const hor=(x>0&&grid[y][x-1]===2)||(x<MW-1&&grid[y][x+1]===2);
    ctx.drawImage(IMG,(hor?4:5)*16,TY+16,16,16,x*T,y*T,16,16);return;
  }
  else if(zn[y][x]){ctx.drawImage(IMG,(h%4)*16,TY+16,16,16,x*T,y*T,16,16);return}
  else sx=((y>0&&grid[y-1][x]===1)?4+h%4:h%4)*16;
  ctx.drawImage(IMG,sx,TY,16,16,x*T,y*T,16,16);
}

