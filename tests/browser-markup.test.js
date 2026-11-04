const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const html=fs.readFileSync(require("node:path").join(__dirname,"../index.html"),"utf8");
test("browser inline script is valid JavaScript",()=>{
 const script=html.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(script,"inline game script exists");
 assert.doesNotThrow(()=>new vm.Script(script[1],{filename:"game-inline.js"}));
});
test("salvage dialog has accessible controls and is initially hidden",()=>{
 for(const id of ["salvage","salvageTitle","salvageInfo","ownCard","capturedCard","swapCard","doneSalvage","salvageCount"])
  assert.match(html,new RegExp('id="'+id+'"'),id);
 assert.match(html,/<div id="salvage" hidden role="dialog"/);
 assert.match(html,/id="ownCard"/);assert.match(html,/id="capturedCard"/);
});
test("game script loads movement and rules modules and only then bot",()=>{
 const from=html.indexOf('<script src="engine/movement.js"></script>');
 const rules=html.indexOf('<script src="engine/rules.js"></script>');
 const bot=html.indexOf('<script src="engine/bot.js"></script>');
 assert.ok(from>0&&rules>from&&bot>rules);
});
test("salvage exchange is offered before captured hands return to deck",()=>{
 const commit=html.slice(html.indexOf("function commit("),html.indexOf("function computer("));
 assert.match(commit,/pendingSalvage=\{/);
 assert.match(commit,/showSalvage\(\);draw\(\);return;/);
 const finish=html.slice(html.indexOf("function completeTurn("),html.indexOf("function closeSalvage("));
 assert.ok(finish.indexOf("recycleCaptured")<finish.indexOf("Area51Rules.download"));
});
