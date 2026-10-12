// Joystick, buttons and keyboard input
// ---- input ----
const key={};let jx=0,jy=0,atkHeld=false,dashReq=false;
addEventListener('keydown',e=>{key[e.key.toLowerCase()]=1;if(e.key==='Shift')dashReq=true;if(e.key===' ')atkHeld=true});
addEventListener('keyup',e=>{key[e.key.toLowerCase()]=0;if(e.key===' ')atkHeld=false});
const stick=document.getElementById('stick'),knob=document.getElementById('knob');let sid=null;
function sMove(e){
  const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy),m=45;
  if(d>m){dx*=m/d;dy*=m/d}
  knob.style.transform=`translate(${dx}px,${dy}px)`;
  jx=dx/m;jy=dy/m;if(Math.hypot(jx,jy)<.2){jx=0;jy=0}
}
stick.addEventListener('pointerdown',e=>{sid=e.pointerId;stick.setPointerCapture(sid);sMove(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===sid)sMove(e)});
const sEnd=e=>{if(e.pointerId===sid){sid=null;jx=jy=0;knob.style.transform=''}};
stick.addEventListener('pointerup',sEnd);stick.addEventListener('pointercancel',sEnd);
const ab=document.getElementById('atk');
ab.addEventListener('pointerdown',e=>{atkHeld=true;ab.classList.add('on');ab.setPointerCapture(e.pointerId)});
const aEnd=()=>{atkHeld=false;ab.classList.remove('on')};
ab.addEventListener('pointerup',aEnd);ab.addEventListener('pointercancel',aEnd);
const db=document.getElementById('dash');
db.addEventListener('pointerdown',e=>{dashReq=true;db.classList.add('on');db.setPointerCapture(e.pointerId)});
const dEnd=()=>db.classList.remove('on');db.addEventListener('pointerup',dEnd);db.addEventListener('pointercancel',dEnd);
const ov=document.getElementById('ov');
ov.addEventListener('pointerdown',e=>{if(st==='play')return;if(e.target.id==='tomenu'){ov.style.display='none';showMenu();return}reset();st='play';ov.style.display='none'});
document.addEventListener('contextmenu',e=>e.preventDefault());

