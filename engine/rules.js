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
function salvageExchange(state,activeId,exchanges){
 if(state.pilots.length<3)throw new Error("Salvage is for three or more aliens");
 const active=state.pilots.find(p=>p.id===activeId);
 if(!active||!active.alive)throw new Error("Only an active surviving pilot may salvage");
 if(!Array.isArray(exchanges))throw new Error("Exchange selections required");
 const usedHand=new Set(),usedCaptured=new Set();
 for(const ex of exchanges){
  if(!Number.isInteger(ex.ownIndex)||ex.ownIndex<0||ex.ownIndex>=active.hand.length)throw new Error("Invalid own card index");
  const victim=state.pilots.find(p=>p.id===ex.fromPilot);
  if(!victim||victim.alive||ex.fromPilot===activeId)throw new Error("Salvage source must be a captured opponent");
  if(!Number.isInteger(ex.capturedIndex)||ex.capturedIndex<0||ex.capturedIndex>=victim.hand.length)throw new Error("Invalid captured card index");
  const ownKey=ex.ownIndex,otherKey=ex.fromPilot+":"+ex.capturedIndex;
  if(usedHand.has(ownKey)||usedCaptured.has(otherKey))throw new Error("Card reused in salvage exchange");
  usedHand.add(ownKey);usedCaptured.add(otherKey);
 }
 // Validate all choices first; then execute swaps without shifting hand indices.
 for(const ex of exchanges){
  const victim=state.pilots.find(p=>p.id===ex.fromPilot);
  [active.hand[ex.ownIndex],victim.hand[ex.capturedIndex]]=[victim.hand[ex.capturedIndex],active.hand[ex.ownIndex]];
 }
 return exchanges.length;
}
function download(state,activeIndex){
 const n=state.pilots.length;
 if(!n||activeIndex<0||activeIndex>=n)throw new Error("Invalid active pilot");
 const priority=state.overrideHolder;
 const start=n>=3&&priority!==null&&priority!==undefined?priority:activeIndex;
 if(n>=3&&priority!==null&&priority!==undefined)state.overrideHolder=null;
 const order=n===2?[activeIndex]:cyclic(start,n);
 let drawn=0;
 // A group round awards at most one card to each eligible alien, then repeats.
 while(true){
  let outstanding=false;
  for(const index of order){
   const pilot=state.pilots[index];
   if(!isEligible(pilot))continue;
   outstanding=true;
   if(!state.deck.length){
    if(n>=3)state.overrideHolder=index;
    return {drawn,priorityHolder:state.overrideHolder??null,exhausted:true};
   }
   pilot.hand.push(state.deck.pop());drawn++;
   if(n===2)return {drawn,priorityHolder:null,exhausted:false};
  }
  if(!outstanding)return {drawn,priorityHolder:state.overrideHolder??null,exhausted:false};
 }
}

return {cyclic,nextEligible,recycleCaptured,download,salvageExchange};
});
