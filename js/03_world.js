// Map generation (zones, buildings, shop, portal, cafe), collision, reflections
// ---- map ----
let grid;
const SZ={x0:3,y0:16,x1:26,y1:40},SHOP={x:13,y:24};
let zn,conn,pS=false,pSl=null,nearShop=false;
const safeAt=(px,py)=>{const x=px/T|0,y=py/T|0;return x>=0&&y>=0&&x<MW&&y<MH&&zn[y][x]===1};
function genMap(){
  grid=Array.from({length:MH},(_,y)=>Array.from({length:MW},(_,x)=>x===0||y===0||x===MW-1||y===MH-1?1:0));
  zn=Array.from({length:MH},(_,y)=>Array.from({length:MW},(_,x)=>x>=SZ.x0&&x<=SZ.x1&&y>=SZ.y0&&y<=SZ.y1?1:0));
  for(let x=SZ.x0;x<=SZ.x1;x++){grid[SZ.y0][x]=2;grid[SZ.y1][x]=2}
  for(let y=SZ.y0;y<=SZ.y1;y++){grid[y][SZ.x0]=2;grid[y][SZ.x1]=2}
  for(const y of[24,25,33,34])grid[y][SZ.x1]=0;
  for(const x of[14,15]){grid[SZ.y0][x]=0;grid[SZ.y1][x]=0}
  let n=0,tr=0;
  while(n<76&&tr++<4000){
    const w=2+(Math.random()*3|0),hh=2,x=2+(Math.random()*(MW-w-4)|0),y=2+(Math.random()*(MH-hh-4)|0);
    if(x+w>SZ.x0-2&&x<SZ.x1+3&&y+hh>SZ.y0-2&&y<SZ.y1+3)continue;
    let ok=true;
    for(let j=-1;j<=hh&&ok;j++)for(let i=-1;i<=w;i++)if(grid[y+j]&&grid[y+j][x+i]){ok=false;break}
    if(!ok)continue;
    for(let j=0;j<hh;j++)for(let i=0;i<w;i++)grid[y+j][x+i]=1;n++;
  }
  for(let j=0;j<3;j++)for(let i=0;i<3;i++)grid[SHOP.y+j][SHOP.x+i]=3;
  for(let j=0;j<3;j++)for(let i=0;i<2;i++)grid[PT.y+j][PT.x+i]=3;
  for(let j=0;j<3;j++)for(let i=0;i<4;i++)grid[CF.y+j][CF.x+i]=3;
  conn=Array.from({length:MH},()=>new Array(MW).fill(false));
  const q=[[SZ.x1+2,24]];conn[24][SZ.x1+2]=true;
  for(let i=0;i<q.length;i++){
    const [cx,cy]=q[i];
    for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=cx+dx,ny=cy+dy;
      if(nx<0||ny<0||nx>=MW||ny>=MH||conn[ny][nx]||grid[ny][nx]||zn[ny][nx])continue;
      conn[ny][nx]=true;q.push([nx,ny]);
    }
  }
}
function drawShop(){ctx.drawImage(IMG,0,TY+32,48,48,SHOP.x*T,SHOP.y*T,48,48);drawPortalW();ctx.drawImage(IMG,0,CAFE_Y,64,48,CF.x*T,CF.y*T,64,48)}
// mirror portal to the Kaneki dimension: glow on the plaza + soft reflection on the floor
function drawPortalW(){
  const x=PT.x*T,y=(PT.y+3)*T,fr=((time*5)|0)%4,g=.6+.4*Math.sin(time*3);
  for(let yy=-6;yy<=6;yy++)for(let xx=-22;xx<=22;xx++){
    if((xx+yy)&1)continue;const d=Math.hypot(xx/22,yy/6);
    if(d<1){ctx.fillStyle='rgba(120,190,255,'+(.22*(1-d)*g)+')';ctx.fillRect(x+16+xx,y-3+yy,1,1)}
  }
  reflect(IMG,fr*32,PORTAL_Y,32,46,x,y-1,.22,0);
  ctx.drawImage(IMG,fr*32,PORTAL_Y,32,48,x,y-48,32,48);
}
function reflect(img,sx,sy,w,foot,x,gy,al,wob){
  for(let k=0;k<=foot;k++){
    ctx.globalAlpha=al*(1-k/(foot+1));
    const off=wob?Math.round(Math.sin(time*4+k*.6)*wob):0;
    ctx.drawImage(img,sx,sy+foot-k,w,1,x+off,gy+k,w,1);
  }
  ctx.globalAlpha=1;
}
const solid=(px,py)=>{const x=px/T|0,y=py/T|0;return x<0||y<0||x>=MW||y>=MH||grid[y][x]>0};
function tryMove(o,dx,dy){
  const hw=4,hh=3;
  const ok=(nx,ny)=>!(solid(nx-hw,ny-hh)||solid(nx+hw,ny-hh)||solid(nx-hw,ny+hh)||solid(nx+hw,ny+hh))&&!(o!==p&&(safeAt(nx-hw,ny-hh)||safeAt(nx+hw,ny-hh)||safeAt(nx-hw,ny+hh)||safeAt(nx+hw,ny+hh)));
  if(ok(o.x+dx,o.y))o.x+=dx;if(ok(o.x,o.y+dy))o.y+=dy;
}

