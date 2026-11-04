const test=require("node:test"),assert=require("node:assert/strict");
const {chooseMove}=require("../engine/bot.js");
test("bot has no legal turn when it has no moves",()=>assert.equal(chooseMove([]),null));
test("bot never voluntarily exits when a survival move exists",()=>{
 const moves=[{i:0,r:0,safe:false,captures:4,liberty:5},{i:1,r:2,safe:true,captures:0,liberty:1}];
 assert.equal(chooseMove(moves,()=>0).i,1);
});
test("bot chooses a required forced exit when no safe move exists",()=>{
 const moves=[{i:0,r:0,safe:false},{i:1,r:2,safe:false,captures:1}];
 assert.equal(chooseMove(moves,()=>0).i,1);
});
test("bot prefers a survivable capture",()=>{
 const moves=[{i:0,r:0,safe:true,captures:0,liberty:3},{i:1,r:2,safe:true,captures:1,liberty:1}];
 assert.equal(chooseMove(moves,()=>0).i,1);
});
test("bot values open neighboring grid cells on a tie in captures",()=>{
 const moves=[{i:0,r:0,safe:true,liberty:1},{i:1,r:2,safe:true,liberty:3}];
 assert.equal(chooseMove(moves,()=>0).i,1);
});
test("bot uses provided randomness only to break exact ties",()=>{
 const moves=[{i:0,r:0,safe:true},{i:1,r:2,safe:true}];
 assert.equal(chooseMove(moves,()=>0).i,0);
 assert.equal(chooseMove(moves,()=>.999).i,1);
});
