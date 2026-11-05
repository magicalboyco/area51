const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const src=fs.readFileSync(require("node:path").join(__dirname,"../index.html"),"utf8");
test("pilot color selection offers all eight colors and is accessible",()=>{
 assert.match(src,/id="crewColors"/);assert.match(src,/id="crewPicked"/);
 assert.match(src,/const colorNames=\['Orange','Blue','Purple','Green','Pink','Yellow','Lavender','Mint'\]/);
 assert.match(src,/aria-pressed/);assert.match(src,/chosenColor/);
 assert.match(src,/colorIndex:id===0\?chosenColor/);
});
test("card fronts identify their actual unique numbered deck ID",()=>{
 assert.match(src,/class="cardLabel"/);
 assert.match(src,/card.title='Navigation card '/);
 assert.match(src,/Array.from\(\{length:35\},\(_,i\)=>i\)/);
});
test("game JavaScript still parses after selector integration",()=>{
 const match=src.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(match);assert.doesNotThrow(()=>new vm.Script(match[1]));
});
