// Camera shake, hit-stop, sparks, flashes, floating text
let curX=-1,shakeA=0,hs=0,slow=0,combo=0,comboT=0,flashA=0,flashC='255,255,255',camX=null,camY=null,ghosts=[],ftx=[],stepT=0,ghT=0;
const cmbE=document.getElementById('cmb');
// ---- game feel: shake, hit-stop, slow-mo, sparks, combo, afterimages, flashes ----
function addShake(t,a){shake=Math.max(shake,t);shakeA=Math.max(shakeA,a)}
function burst(x,y,n,cols,sp,life,g){
  if(dust.length>420)return;
  for(let i=0;i<n;i++){const a=Math.random()*6.283,s=sp*(.3+Math.random()*.7);dust.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s*.7-sp*.25,t:life*(.6+Math.random()*.7),s:1+(Math.random()*2|0),c:cols[(Math.random()*cols.length)|0],g})}
}
function sparkAt(e){burst(e.x,e.y-10,6,['#ffd0d8','#ff6a7e','#ffffff'],110,.25,0);addShake(.04,1.2)}
function hurtFx(){flashA=.4;flashC='224,32,60';addShake(.16,2.8);hs=Math.max(hs,.04);combo=0;comboT=0}
function onKill(e){
  combo++;comboT=3;
  burst(e.x,e.y-8,e.boss?40:(e.ty?18:12),['#8a1230','#e8243e','#ff6a7e','#ffd0d8'],e.boss?140:90,.5,70);
  ftx.push({x:e.x,y:e.y-22,t:.9,txt:'+'+(e.boss?20:e.ty===2?6:e.ty?4:2),c:'#ffd24a'});
  if(e.boss){addShake(.7,6);hs=.18;slow=1.2;flashA=.6;flashC='255,255,255'}
  else if(e.ty){addShake(.12,2.5);hs=.05}
  else addShake(.06,1.5);
  if(combo>=5&&combo%5===0){sfx.combo();addShake(.2,3)}
}
function drawGhosts(){
  if(!FLASH)return;
  for(const g of ghosts){ctx.globalAlpha=g.t/.25*.4;ctx.drawImage(FLASH,g.f*FW,charSY(g.c,g.d),FW,FH,Math.round(g.x)-12,Math.round(g.y)-34,FW,FH)}
  ctx.globalAlpha=1;
}
function drawFtx(){
  ctx.font='8px "Press Start 2P",monospace';ctx.textAlign='center';ctx.lineWidth=2;ctx.strokeStyle='#14101c';
  for(const f of ftx){ctx.font=(f.sz||8)+'px "Press Start 2P",monospace';ctx.globalAlpha=Math.min(1,f.t/.4);ctx.strokeStyle=f.o||'#14101c';ctx.lineWidth=f.sz?3:2;ctx.strokeText(f.txt,Math.round(f.x),Math.round(f.y));ctx.fillStyle=f.c;ctx.fillText(f.txt,Math.round(f.x),Math.round(f.y))}
  ctx.globalAlpha=1;ctx.textAlign='left';
}
function drawFlash(dt){
  ctx.setTransform(1,0,0,1,0,0);
  const low=(p.hp>0&&p.hp<=p.mhp*.3)?.14+.1*Math.sin(time*7):0,a=Math.max(flashA,low),c=flashA>=low?flashC:'224,32,60';
  if(a>0){
    ctx.fillStyle='rgba('+c+','+a*.16+')';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='rgba('+c+','+a+')';ctx.fillRect(0,0,W,5);ctx.fillRect(0,H-5,W,5);ctx.fillRect(0,0,5,H);ctx.fillRect(W-5,0,5,H);
    ctx.fillStyle='rgba('+c+','+a*.45+')';ctx.fillRect(0,5,W,6);ctx.fillRect(0,H-11,W,6);ctx.fillRect(5,0,6,H);ctx.fillRect(W-11,0,6,H);
  }
  if(flashA>0)flashA=Math.max(0,flashA-dt*2);
}
