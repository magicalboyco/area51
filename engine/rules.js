/* Escape Area 51: physical rulebook — draw and priority override protocol.
 * All procedures mutate the passed match state to preserve a single authority.
 * The optional salvage exchange must occur before captured hands are recycled.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.Area51Rules=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
function cyclic(start,length){return Array.from({length},(_,n)=>(start+n)%length)}
function isEligible(p){return !!p&&p.alive&&p.hand.length<3}
function nextEligible(state,fromIndex){
 const n=state.pilots.length;
 for(let i=1;i<=n;i++){const idx=(fromIndex+i)%n;if(isEligible(state.pilots[idx]))return idx}
 return null;
}
function recycleCaptured(state,ids,shuffle){
 const captured=[];
 for(const id of ids){
  const p=state.pilots.find(x=>x.id===id);
  if(!p)continue;
  captured.push(...p.hand.splice(0));
 }
 state.deck.push(...captured);
 if(captured.length&&shuffle)shuffle(state.deck);
 if(ids.includes(state.overrideHolder)){
  state.overrideHolder=nextEligible(state,state.overrideHolder);
 }
 return captured.length;
}
function download(state,activeIndex){
 const n=state.pilots.length;
 if(!n||activeIndex<0||activeIndex>=n)throw new Error("Invalid active pilot");
 let order;
 if(n===2){order=[activeIndex]}
 else {
  const priority=state.overrideHolder;
  order=cyclic(priority!==null&&priority!==undefined?priority:activeIndex,n);
  if(priority!==null&&priority!==undefined)state.overrideHolder=null;
 }
 let drawn=0;
 for(const index of order){
  const p=state.pilots[index];if(!isEligible(p))continue;
  while(p.hand.length<3){
   if(!state.deck.length){
    if(n>=3)state.overrideHolder=index;
    return {drawn,priorityHolder:state.overrideHolder??null,exhausted:true};
   }
   p.hand.push(state.deck.pop());drawn++;
   if(n===2)break;
  }
 }
 return {drawn,priorityHolder:state.overrideHolder??null,exhausted:false};
}
return {cyclic,nextEligible,recycleCaptured,download};
});
