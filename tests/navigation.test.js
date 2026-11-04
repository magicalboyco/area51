const test=require("node:test");
const assert=require("node:assert/strict");
const nav=require("../engine/navigation.js");
const P=[[0,5],[1,4],[2,7],[3,6]];
const connections=nav.toConnections(P);
const tile=(rotation=0)=>({connections,rotation});
function board(){return Array.from({length:6},()=>Array(6).fill(null))}
test("a physical circuit has four disjoint reversible paths",()=>{
 assert.equal(nav.validatePairs(P),true);
 for(let p=0;p<8;p++)assert.equal(connections[connections[p]],p);
 assert.throws(()=>nav.validatePairs([[0,1],[1,2],[3,4],[5,6]]),/Duplicate/);
 assert.throws(()=>nav.validatePairs([[0,1],[2,3],[4,5]]),/Exactly four/);
});
test("quarter-turn rotation preserves all eight reciprocal connections",()=>{
 for(let r=0;r<4;r++)for(let p=0;p<8;p++){
   const exit=nav.connect(connections,p,r);
   assert.equal(nav.connect(connections,exit,r),p);
   assert.equal(exit,nav.rotatePort(connections[nav.rotatePort(p,-r)],r));
 }
 for(let p=0;p<8;p++)assert.equal(nav.rotatePort(p,4),p);
});
test("exits enter corresponding port of adjacent cell",()=>{
 const examples=[
  [0,{row:1,col:2,entry:5}],
  [1,{row:1,col:2,entry:4}],
  [2,{row:2,col:3,entry:7}],
  [3,{row:2,col:3,entry:6}],
  [4,{row:3,col:2,entry:1}],
  [5,{row:3,col:2,entry:0}],
  [6,{row:2,col:1,entry:3}],
  [7,{row:2,col:1,entry:2}]
 ];
 for(const [exit,expected] of examples)assert.deepEqual(nav.nextCell(2,2,exit),expected);
});
test("piece waits at an empty square and no movement is fabricated",()=>{
 const b=board();assert.deepEqual(nav.trace(b,{row:3,col:2,entry:0}),{status:"waiting",row:3,col:2,entry:0,segments:[]});
});
test("piece traverses one installed tile then stops at next unfilled cell",()=>{
 const b=board();b[2][2]=tile();
 const result=nav.trace(b,{row:2,col:2,entry:0});
 assert.equal(result.status,"waiting");
 assert.deepEqual([result.row,result.col,result.entry],[3,2,0]);
 assert.deepEqual(result.segments,[{row:2,col:2,entry:0,exit:5}]);
});
test("piece can travel across two connected tiles",()=>{
 const b=board();b[2][2]=tile();b[3][2]=tile();
 const result=nav.trace(b,{row:2,col:2,entry:0});
 assert.equal(result.status,"waiting");
 assert.equal(result.segments.length,2);
 assert.deepEqual([result.row,result.col,result.entry],[4,2,0]);
});
test("moving off the six-by-six grid produces an edge exit",()=>{
 const b=board();b[5][2]=tile();
 const result=nav.trace(b,{row:5,col:2,entry:0});
 assert.equal(result.status,"escaped");
 assert.equal(result.row,6);
});
test("a test tile can turn a route at 90 degrees",()=>{
 const b=board();b[3][3]=tile(1);
 const result=nav.trace(b,{row:3,col:3,entry:2});
 assert.equal(result.status,"waiting");
 assert.equal(result.segments[0].exit,7);
 assert.deepEqual([result.row,result.col,result.entry],[3,2,2]);
});
