// Enemy pathfinding (BFS flow field) and line of sight
const D8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
let flow=null,flowKey=-1;
// BFS distance field from the player's tile; enemies walk downhill around buildings
function buildFlow(){
  const key=(p.y/T|0)*MW+(p.x/T|0);
  if(key===flowKey&&flow)return;
  flowKey=key;flow=new Int16Array(MW*MH).fill(-1);
  const q=[key];flow[key]=0;
  for(let i=0;i<q.length;i++){
    const c=q[i],cx=c%MW,cy=c/MW|0;
    for(const [dx,dy] of D8){
      const nx=cx+dx,ny=cy+dy;
      if(nx<0||ny<0||nx>=MW||ny>=MH||grid[ny][nx]||zn[ny][nx]||flow[ny*MW+nx]>=0)continue;
      if(dx&&dy&&(grid[cy][nx]||grid[ny][cx]))continue;
      flow[ny*MW+nx]=flow[c]+1;q.push(ny*MW+nx);
    }
  }
}
function los(ax,ay,bx,by){
  const dx=bx-ax,dy=by-ay,n=Math.ceil(Math.hypot(dx,dy)/5);
  for(let i=1;i<n;i++){const x=ax+dx*i/n,y=ay+dy*i/n;if(solid(x,y)||solid(x+4,y)||solid(x-4,y)||solid(x,y+4)||solid(x,y-4))return false}
  return true;
}
