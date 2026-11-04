const test=require("node:test");
const assert=require("node:assert/strict");
const audit=require("../data/tile-audit.json");
const nav=require("../engine/navigation.js");
test("all 35 physical navigation cards are accounted for",()=>{
 assert.equal(audit.cards.length,35);
 assert.deepEqual(audit.cards.map(card=>card.id),Array.from({length:35},(_,id)=>id));
});
test("provisional maps are all reciprocal and cover exactly eight endpoints",()=>{
 for(const card of audit.cards){
  assert.equal(card.connections.length,8,"card "+card.id);
  const paths=card.connections.map((end,start)=>[start,end]).filter(([start,end])=>start<end);
  nav.validatePairs(paths);
  for(let p=0;p<8;p++)assert.equal(card.connections[card.connections[p]],p,"card "+card.id+" port "+p);
 }
});
test("verification status is explicit and cannot be claimed without individual proof",()=>{
 assert.equal(audit.verifiedCount,audit.cards.filter(card=>card.verified===true).length);
 for(const card of audit.cards){
  assert.equal(typeof card.verified,"boolean");
  assert.match(card.artwork,/^assets\/tile\d+\.webp$/);
  if(card.verified)assert.ok(card.notes&&!/PROVISIONAL/.test(card.notes),"verified card must have an audit note");
 }
});
