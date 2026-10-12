// Canvas setup, constants and screen fitting (portrait/landscape)
const T=16,MW=72,MH=60;let W=190;
let H=256;
const cv=document.getElementById('cv'),ctx=cv.getContext('2d');
function fit(){
  if(innerWidth>innerHeight*1.05){H=230;W=Math.min(560,Math.round(H*innerWidth/innerHeight))}
  else{W=190;H=Math.max(200,Math.min(440,Math.round(W*innerHeight/innerWidth)))}
  cv.width=W;cv.height=H;
  const s=Math.min(innerWidth/W,innerHeight/H);
  cv.style.width=W*s+'px';cv.style.height=H*s+'px';
  cv.style.left=(innerWidth-W*s)/2+'px';cv.style.top=(innerHeight-H*s)/2+'px';
}
addEventListener('resize',fit);fit();

