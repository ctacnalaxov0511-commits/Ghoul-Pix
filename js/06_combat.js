// Basic attack, dash, rage mode, kagune rage drawing
// ---- logic ----
const REACH=46,SWING=.28;
function attack(){
  const C=CHS[p.ch],rg=p.rage>0,rr=(rg?72:56)*rf(),ds=e=>Math.hypot(e.x-p.x,e.y-p.y);
  let best=null,bd=70;
  for(const e of en){const d=ds(e);if(d<bd){bd=d;best=e}}
  if(best){const d=bd||1;p.fx=(best.x-p.x)/d;p.fy=(best.y-p.y)/d}
  if(C.scythe){p.st=[];p.swh=new Set();p.atk=p.tot=SWJ;p.cd=C.cd;p.swing++;sfx.slash();return}
  const list=en.filter(e=>{const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);return d<rr&&(rg||dx*p.fx+dy*p.fy>-.15*d)}).sort((a,b)=>ds(a)-ds(b)).slice(0,rg?C.tr:C.tn);
  const n=Math.max(1,list.length),gap=rg?.06:.1;
  p.st=[];
  for(let i=0;i<n;i++)p.st.push({i,ti:((p.ti||0)+i)%C.tr,e:list[i]||null,t:[p.x+p.fx*rr*.85,p.y+p.fy*rr*.85-9],d:i*gap,nh:list[i]&&Math.random()<C.dbl?1+(rg?2:1):1,hc:0});
  p.ti=((p.ti||0)+n)%C.tr;
  p.tot=Math.max(...p.st.map(s=>s.d+SWING+(s.nh-1)*.13));p.atk=p.tot;p.cd=rg?C.cdr:C.cd;p.swing++;
}
const rbE=document.getElementById('rb'),rtE=document.getElementById('rt');
function rbar(){
  const r=p.rage>0;
  rbE.style.width=(r?p.rage/(p.rmax||30)*100:p.rk/15*100)+'%';
  rbE.style.background=r?(p.rage<6&&((p.rage*4|0)%2)?'#fff':'#ff2a4a'):'#ff8a3c';
  rtE.textContent=r?'RAGE '+Math.ceil(p.rage)+'s':'RAGE '+p.rk+'/15';
}
function startDash(){
  sfx.dash();addShake(.08,1.5);
  p.dash=p.dtot=.24;p.del=0;p.dcd=p.rage>0?.6:1.2;p.atk=0;
  const px=-p.fy,py=p.fx;p.dp=[];
  const ba=Math.atan2(-p.fy,-p.fx);
  const nD=CHS[p.ch].wing?3:4;
  for(let i=0;i<nD;i++){const a=ba+(i-(nD-1)/2)*(nD===3?.85:.7),r=17+(i%2)*5;p.dp.push({x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r})}
  for(let i=0;i<6;i++)fx.push({x:p.dp[i%p.dp.length].x,y:p.dp[i%p.dp.length].y,t:.3});
}
function startRage(){
  if(CHS[p.ch].ksuper)ftx.push({x:p.x,y:p.y-40,t:2.2,txt:'I am a ghoul',c:'#ffffff',o:'#a01028',sz:7,fol:true,oy:-40});
  sfx.rage();flashA=.5;flashC='255,60,80';addShake(.35,4);hs=.08;
  p.rage=p.rmax=CHS[p.ch].rageT||30;p.rk=0;
  for(let i=0;i<10;i++)fx.push({x:p.x+Math.cos(i*.63)*8,y:p.y-8+Math.sin(i*.63)*8,t:.5,big:1});
}
function rageK(){
  const bx=p.bx,by=p.by,qx=-by,qy=bx,ba=Math.atan2(by,bx),f=[p.fx,p.fy],el=p.atk>0?p.tot-p.atk:-1;
  const NT=CHS[p.ch].tr;
  for(let i=0;i<NT;i++){
    const o=i-(NT-1)/2,ox=p.x+bx*2+qx*o*2.2,oy=p.y-13+by*2+qy*o*2.2,a=ba+o*.3,dx=Math.cos(a),dy=Math.sin(a),L=44+(i%3)*8,amp=7+(i%2)*3;
    let at=null,env=0;
    if(el>=0){
      const s=p.st.find(q=>q.ti===i);
      if(s){const u=el-s.d,dur=SWING+(s.nh-1)*.13;if(u>=0&&u<=dur){env=envT(u,dur,.08,.09)*stDip(s,u);env=env*env*(3-2*env);at=atkPath(o,[ox,oy],s.e?[s.e.x,s.e.y-8]:s.t,f)}}
    }
    tendX(t=>{
      const w=amp*t*Math.sin(t*5.5+time*7+i*1.3),X=ox+dx*L*t-dy*w,Y=oy+dy*L*t+dx*w;
      if(!at)return[X,Y];
      const q=at(t);return[X+(q[0]-X)*env,Y+(q[1]-Y)*env];
    },1,Math.round(L/2+6),0,1);
  }
  ctx.fillStyle='#ff5a70';
  for(let i=0;i<6;i++)ctx.fillRect(Math.round(p.x+Math.sin(time*3+i*2.1)*7),Math.round(p.y-4-(time*22+i*9)%24),2,2);
}
function vig(){
  ctx.setTransform(1,0,0,1,0,0);
  const a=.3+.12*Math.sin(time*6);
  ctx.fillStyle='rgba(224,32,60,'+a/2+')';ctx.fillRect(0,0,W,7);ctx.fillRect(0,H-7,W,7);ctx.fillRect(0,0,7,H);ctx.fillRect(W-7,0,7,H);
  ctx.fillStyle='rgba(224,32,60,'+a+')';ctx.fillRect(0,0,W,3);ctx.fillRect(0,H-3,W,3);ctx.fillRect(0,0,3,H);ctx.fillRect(W-3,0,3,H);
}
