const test=require("node:test"),assert=require("node:assert/strict");
const rules=require("../engine/rules.js");
const p=(id,hand=[],alive=true)=>({id,hand:hand.slice(),alive});
test("two-player download refills only the active pilot",()=>{
 const s={pilots:[p(0,[10,11]),p(1,[12])],deck:[40,41],overrideHolder:null};
 assert.deepEqual(rules.download(s,0),{drawn:1,priorityHolder:null,exhausted:false});
 assert.deepEqual(s.pilots[0].hand,[10,11,41]);assert.deepEqual(s.pilots[1].hand,[12]);assert.deepEqual(s.deck,[40]);
});
test("group downloads clockwise, one pilot at a time until hands are full",()=>{
 const s={pilots:[p(0,[1]),p(1,[2,3]),p(2,[4])],deck:[50,51,52,53,54],overrideHolder:null};
 const result=rules.download(s,1);
 assert.equal(result.drawn,5);assert.deepEqual(s.pilots.map(x=>x.hand.length),[3,3,3]);
 assert.deepEqual(s.pilots[1].hand,[2,3,54]);assert.deepEqual(s.pilots[2].hand,[4,53,51]);assert.deepEqual(s.pilots[0].hand,[1,52,50]);
});
test("empty backup pile claims priority and stops that turn",()=>{
 const s={pilots:[p(0,[1,2,3]),p(1,[4,5]),p(2,[6,7])],deck:[],overrideHolder:null};
 const result=rules.download(s,0);
 assert.equal(result.priorityHolder,1);assert.equal(result.exhausted,true);
 assert.equal(s.pilots[2].hand.length,2);
});
test("override holder starts next download, then module is set aside",()=>{
 const s={pilots:[p(0,[1]),p(1,[2]),p(2,[3])],deck:[60,61,62],overrideHolder:2};
 const result=rules.download(s,0);
 assert.deepEqual(s.pilots[2].hand,[3,62,61]);
 assert.deepEqual(s.pilots[0].hand,[1]);assert.equal(result.priorityHolder,1);
});
test("captured cards return to deck and module transfers clockwise to eligible survivor",()=>{
 const s={pilots:[p(0,[10,11],false),p(1,[20]),p(2,[30,31,32])],deck:[40],overrideHolder:0};
 const count=rules.recycleCaptured(s,[0],a=>a.reverse());
 assert.equal(count,2);assert.equal(s.pilots[0].hand.length,0);
 assert.equal(s.deck.length,3);assert.equal(s.overrideHolder,1);
});
test("captured pilot with no eligible successors relinquishes priority",()=>{
 const s={pilots:[p(0,[11],false),p(1,[20,21,22]),p(2,[30,31,32])],deck:[],overrideHolder:0};
 rules.recycleCaptured(s,[0]);assert.equal(s.overrideHolder,null);
});
