/* Deterministic Escape Area 51 movement: image-independent path tracing.
 * A trace walks every installed circuit until the next empty cell or grid edge.
 * Shared path traversed from opposite directions represents a head-on collision.
 * This module does not decide turn order, salvage or draw rules.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.Area51Movement=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const ACROSS=[5,4,7,6,1,0,3,2];
function enterAfterExit(row,col,exit){
 const side=Math.floor(exit/2);
 return {r:row+[-1,0,1,0][side],c:col+[0,1,0,-1][side],p:ACROSS[exit]};
}
function moveAll(grid,pilots,lookup,{maxSteps=144}={}){
 const n=grid.length;
 const occupants=pilots.filter(p=>p.alive&&p.at);
 const traces=[];
 for(const pilot of occupants){
  let {r,c,p}=pilot.at;
  const visited=new Set(),steps=[];
  let status="waiting";
  while(r>=0&&c>=0&&r<n&&c<n&&grid[r][c]){
   const key=r+":"+c+":"+p;
   if(visited.has(key)){status="loop";break}
   visited.add(key);
   if(steps.length>=maxSteps){status="loop";break}
   const tile=grid[r][c],exit=lookup(tile,p);
   if(!Number.isInteger(exit)||exit<0||exit>7)throw new Error("Invalid route endpoint");
   steps.push({r,c,entry:p,exit});
   ({r,c,p}=enterAfterExit(r,c,exit));
  }
  if(!(r>=0&&c>=0&&r<n&&c<n))status="escaped";
  traces.push({pilot,status,at:{r,c,p},steps});
 }
 const hit=new Set();
 // Opposing travelers use the same path segment, approached from different ends.
 const traversals=new Map();
 for(const t of traces)for(const s of t.steps){
  const low=Math.min(s.entry,s.exit),high=Math.max(s.entry,s.exit);
  const key=s.r+":"+s.c+":"+low+":"+high;
  if(!traversals.has(key))traversals.set(key,[]);
  traversals.get(key).push({id:t.pilot.id,entry:s.entry});
 }
 for(const all of traversals.values())for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++)
  if(all[i].id!==all[j].id&&all[i].entry!==all[j].entry){hit.add(all[i].id);hit.add(all[j].id)}
 // Waiting on exactly the same edge is also an unresolved collision.
 const waiting=new Map();
 for(const t of traces)if(t.status==="waiting"){
  const k=t.at.r+":"+t.at.c+":"+t.at.p;
  if(waiting.has(k)){hit.add(t.pilot.id);hit.add(waiting.get(k))}
  else waiting.set(k,t.pilot.id);
 }
 for(const t of traces){
  t.pilot.at=t.at;
  if(t.status!=="waiting"||hit.has(t.pilot.id))t.pilot.alive=false;
 }
 return traces.map(t=>({id:t.pilot.id,status:hit.has(t.pilot.id)?"collision":t.status,steps:t.steps,at:t.at}));
}
return {enterAfterExit,moveAll};
});
