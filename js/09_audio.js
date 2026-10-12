// Web Audio sound effects, in-game music and the main menu theme
// ---- Audio: everything is synthesized with Web Audio (no files) ----
let AC=null,MG=null,nz=null,muted=false;
function initAudio(){
  if(!AC){
    try{
      AC=new(window.AudioContext||window.webkitAudioContext)();
      MG=AC.createGain();MG.gain.value=muted?0:.55;MG.connect(AC.destination);
      nz=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);
      const d=nz.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
      setInterval(sched,40);
    }catch(e){AC=null}
  }
  if(AC&&AC.state!=='running')AC.resume();
}
['pointerdown','pointerup','touchend','click'].forEach(n=>document.addEventListener(n,initAudio));
const mb=document.getElementById('mute'),mnE=document.getElementById('mnbtn'),pbE=document.getElementById('portbtn');
mb.addEventListener('pointerdown',e=>{e.stopPropagation();muted=!muted;initAudio();if(MG)MG.gain.value=muted?0:.55;mb.textContent=muted?'SND OFF':'SND ON'});
const mf=n=>440*Math.pow(2,(n-69)/12);
function tn(f,d,type,v,f2,t0){
  if(!AC)return;
  const t=AC.currentTime+(t0||0),o=AC.createOscillator(),g=AC.createGain();
  o.type=type||'square';o.frequency.setValueAtTime(f,t);
  if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);
  g.gain.setValueAtTime(v||.2,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(MG);o.start(t);o.stop(t+d+.02);
}
function ns(d,v,f1,f2,type,t0){
  if(!AC)return;
  const t=AC.currentTime+(t0||0),s=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();
  s.buffer=nz;s.loop=true;fl.type=type||'bandpass';fl.frequency.setValueAtTime(f1,t);
  if(f2&&f2!==f1)fl.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  s.connect(fl);fl.connect(g);g.connect(MG);s.start(t);s.stop(t+d+.02);
}
const sfx={
  click(){tn(520,.05,'square',.12,880)},
  portal(){[0,.06,.12,.18,.24].forEach((d,i)=>tn(mf(76+i*3),.4,'sine',.1,mf(88+i*3),d));ns(.5,.12,2000,6000,'bandpass')},
  sup(){tn(400,.5,'sawtooth',.18,1600);ns(.4,.3,800,4000,'bandpass')},
  buy(){[0,.07,.14].forEach((d,i)=>tn(mf(72+i*4),.12,'square',.12,0,d))},
  coin(){tn(1500,.07,'square',.05,0,.08)},
  crystal(){tn(1700,.04,'triangle',.05,900)},
  slash(){ns(.16,.35,2200,500,'bandpass');tn(300,.1,'sawtooth',.08,120)},
  hit(){tn(240,.09,'square',.2,70);ns(.08,.3,1200,300,'lowpass')},
  kill(n){tn(520+Math.min(n||0,12)*40,.2,'square',.16,90);ns(.14,.2,900,200,'lowpass')},
  combo(){[0,.05,.1].forEach((d,i)=>tn(mf(72+i*4),.12,'square',.1,0,d))},
  hurt(){tn(200,.28,'sawtooth',.28,50);ns(.2,.35,600,150,'lowpass')},
  dash(){ns(.25,.4,500,3500,'bandpass');tn(120,.22,'sine',.25,380)},
  rage(){tn(70,.9,'sawtooth',.3,260);tn(105,.9,'square',.12,390);ns(.7,.4,300,2500,'bandpass');[0,.12,.24].forEach((d,i)=>tn(mf(57+i*5),.3,'square',.12,0,d))},
  boss(){tn(55,1.2,'sawtooth',.35,48);tn(58.3,1.2,'sawtooth',.3,50);ns(1,.2,200,80,'lowpass');tn(220,.4,'square',.15,110,.1)},
  tele(){tn(300,.35,'square',.1,700)},
  slam(){ns(.3,.6,500,60,'lowpass');tn(110,.3,'sine',.4,35)},
  shoot(){[0,.03,.06].forEach(d=>tn(900,.12,'triangle',.1,300,d))},
  summon(){[0,.08,.16,.24].forEach((d,i)=>tn(mf(52+i*4),.18,'square',.12,0,d))},
  bossdead(){ns(.9,.6,1500,80,'lowpass');[0,.1,.2,.3,.4].forEach((d,i)=>tn(mf(64-i*4),.35,'sawtooth',.2,mf(52-i*4),d))},
  over(){[0,.25,.5,.75].forEach((d,i)=>tn(mf(57-i*3),.45,'square',.2,0,d))}
};
function bossSnd(o,n){
  if(n==='sweep'||n==='charge'||n==='summon'||n==='volley')sfx.tele();
  else if(o==='sweep'&&n==='rec')sfx.slam();
  else if(n==='dash')sfx.dash();
  else if(n==='stun')sfx.slam();
  else if(o==='volley'&&n==='rec')sfx.shoot();
  else if(o==='summon'&&n==='rec')sfx.summon();
}
// music: Am-F-Dm-E loop; faster in rage, darker (detuned bass) with a boss
let nextT=0,mstep=0;
const CH=[[57,60,64],[53,57,60],[50,53,57],[52,56,59]];
// ---- Menu theme: original dark piano-rock track (fast piano arpeggios, driving drums, minor-key lead), 140 bpm, 8-bar loop ----
let mT=0,mS=0;
const MC=[[57,60,64,69],[53,57,60,65],[55,60,64,67],[55,59,62,67],[57,60,64,69],[53,57,60,65],[52,56,59,64],[57,60,64,69]],
 MBASS=[45,41,48,43,45,41,40,45],MPAT=[0,1,2,3,2,1,2,3,0,1,2,3,2,1,3,2],
 MLEAD=[[0,0,76,3],[0,3,74,1],[0,4,72,3],[0,7,69,1],[0,8,72,4],[0,12,74,2],[0,14,76,2],
  [1,0,77,3],[1,3,76,1],[1,4,72,3],[1,7,69,1],[1,8,72,4],[1,12,76,2],[1,14,74,2],
  [2,0,79,3],[2,3,76,1],[2,4,72,2],[2,6,76,2],[2,8,79,4],[2,12,76,2],[2,14,72,2],
  [3,0,74,3],[3,3,71,1],[3,4,67,3],[3,7,71,1],[3,8,74,4],[3,12,71,2],[3,14,67,2],
  [4,0,81,3],[4,3,79,1],[4,4,76,3],[4,7,72,1],[4,8,76,4],[4,12,79,2],[4,14,81,2],
  [5,0,81,3],[5,3,77,1],[5,4,72,3],[5,7,77,1],[5,8,81,4],[5,12,84,2],[5,14,81,2],
  [6,0,80,3],[6,3,76,1],[6,4,71,3],[6,7,76,1],[6,8,80,4],[6,12,83,2],[6,14,80,2],
  [7,0,81,6],[7,8,76,4],[7,12,69,4]];
function menuTrack(){
  if(!AC||AC.state!=='running')return;
  const sd=60/140/4;
  if(!mT||mT<AC.currentTime)mT=AC.currentTime+.05;
  while(mT<AC.currentTime+.2){
    const t=mT-AC.currentTime,bar=(mS>>4)%8,s=mS&15,full=mS>=32,ch=MC[bar];
    const pv=.05+Math.min(.04,mS/400);
    const n=ch[MPAT[s]]+(s%8>=4?12:0);
    tn(mf(n),.32,'triangle',pv,0,t);tn(mf(n+12),.18,'sine',pv*.35,0,t);
    if(s===0){for(const q of ch.slice(0,3))tn(mf(q),sd*15,'sawtooth',.014,0,t)}
    if(full){
      if(s%4===0||s===6||s===10)tn(mf(MBASS[bar]),sd*1.7,'square',.09,0,t);
      if(s===0||s===6||s===8||s===10)tn(150,.13,'sine',.55,40,t);
      if(s===4||s===12){ns(.13,.26,1800,900,'bandpass',t);tn(220,.08,'triangle',.1,120,t)}
      if(s%2===0)ns(.03,s%4===2?.07:.04,8000,8000,'highpass',t);
      if(s===15)ns(.12,.05,7000,7000,'highpass',t);
      for(const q of MLEAD){if(q[0]===bar&&q[1]===s){const L=q[3]*sd*.95;tn(mf(q[2]),L,'sawtooth',.045,0,t);tn(mf(q[2])*1.004,L,'square',.03,0,t)}}
    }
    mS++;mT+=sd;
  }
}
function sched(){
  if(st==='menu'){menuTrack();nextT=0;return}
  mT=0;mS=0;
  if(!AC||(st!=='play'&&st!=='menu'&&st!=='shop'&&st!=='dim')||AC.state!=='running'){nextT=0;return}
  const mn=st==='menu'||st==='shop'||st==='dim',rg=!mn&&p&&p.rage>0,bs=!mn&&en.some(e=>e.boss),sd=60/(mn?84:rg?148:bs?126:108)/4;
  if(!nextT||nextT<AC.currentTime)nextT=AC.currentTime+.05;
  while(nextT<AC.currentTime+.2){
    const t=nextT-AC.currentTime,bar=(mstep>>4)%4,s=mstep&15,ch=CH[bar],root=ch[0]-12-(bs&&bar%2?1:0);
    if(!mn&&(s%8===0||(rg&&s%4===0)))tn(130,.12,'sine',.5,40,t);
    if(!mn&&(s===4||s===12))ns(.1,.16,1800,900,'bandpass',t);
    if(!mn&&s%2===1)ns(.03,.05,7000,7000,'highpass',t);
    if([0,3,6,8,11,14].includes(s))tn(mf(root),sd*1.6,'square',.12,0,t);
    tn(mf(ch[s%3]+(s%8>=4?12:0)+(rg&&s%2?12:0)),sd*.9,'square',.045,0,t);
    mstep++;nextT+=sd;
  }
}
