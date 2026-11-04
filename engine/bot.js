/* Escape Area 51 — first-generation solo opponent.
 * No difficulty settings yet: bots avoid forbidden voluntary exits,
 * then prefer captures and safer positions.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.Area51Bot=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
function chooseMove(moves,random=Math.random){
 if(!Array.isArray(moves)||!moves.length)return null;
 const survivable=moves.filter(m=>m.safe);
 const legal=survivable.length?survivable:moves;
 function score(m){
   return (m.captures||0)*100+(m.liberty||0)*3;
 }
 let best=-Infinity,candidates=[];
 for(const move of legal){
   const value=score(move);
   if(value>best){best=value;candidates=[move]}
   else if(value===best)candidates.push(move);
 }
 const n=Math.max(0,Math.min(candidates.length-1,Math.floor(random()*candidates.length)));
 return candidates[n];
}
return {chooseMove};
});
