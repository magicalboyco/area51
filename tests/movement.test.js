const test=require("node:test"),assert=require("node:assert/strict");
const {moveAll,enterAfterExit}=require("../engine/movement.js");
const grid=()=>Array.from({length:6},()=>Array(6).fill(null));
const unit={id:0,rot:0};
const lookup=(_,p)=>({0:5,5:0,1:4,4:1,2:7,7:2,3:6,6:3})[p];
test("transfers to correct adjacent cell and entry endpoint",()=>{
 assert.deepEqual(enterAfterExit(3,3,5),{r:4,c:3,p:0});
 assert.deepEqual(enterAfterExit(3,3,3),{r:3,c:4,p:6});
});
test("remains waiting at an empty tile",()=>{
 const p={id:0,alive:true,at:{r:2,c:2,p:0}};
 const result=moveAll(grid(),[p],lookup);
 assert.equal(result[0].status,"waiting");assert.equal(p.alive,true);
});
test("follows chained circuits to next unfinished sector",()=>{
 const b=grid();b[2][2]=unit;b[3][2]=unit;
 const p={id:0,alive:true,at:{r:2,c:2,p:0}};
 const result=moveAll(b,[p],lookup);
 assert.equal(result[0].status,"waiting");assert.equal(result[0].steps.length,2);
 assert.deepEqual(p.at,{r:4,c:2,p:0});
});
test("exiting board causes elimination",()=>{
 const b=grid();b[5][2]=unit;
 const p={id:0,alive:true,at:{r:5,c:2,p:0}};
 const [t]=moveAll(b,[p],lookup);
 assert.equal(t.status,"escaped");assert.equal(p.alive,false);
});
test("head-on travelers on the same circuit are both eliminated",()=>{
 const b=grid();b[2][2]=unit;
 const p={id:0,alive:true,at:{r:2,c:2,p:0}};
 const q={id:1,alive:true,at:{r:2,c:2,p:5}};
 const result=moveAll(b,[p,q],lookup);
 assert.deepEqual(result.map(t=>t.status),["collision","collision"]);
 assert.equal(p.alive,false);assert.equal(q.alive,false);
});
test("separate routes through same circuit do not collide",()=>{
 const b=grid();b[2][2]=unit;
 const p={id:0,alive:true,at:{r:2,c:2,p:0}};
 const q={id:1,alive:true,at:{r:2,c:2,p:1}};
 const result=moveAll(b,[p,q],lookup);
 assert.deepEqual(result.map(t=>t.status),["waiting","waiting"]);
 assert.equal(p.alive,true);assert.equal(q.alive,true);
});
test("tracing movement does not affect eliminated tokens",()=>{
 const p={id:0,alive:false,at:{r:1,c:1,p:0}};
 assert.deepEqual(moveAll(grid(),[p],lookup),[]);
});
