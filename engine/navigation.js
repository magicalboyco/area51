/* Escape Area 51 — navigation geometry.
   Pure functions: no artwork, DOM or network dependencies.
   Port numbers are clockwise: 0,1 top; 2,3 right; 4,5 bottom; 6,7 left.
   Pairing data MUST be verified against the original physical tile artwork.
*/
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.Area51Navigation=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  const BOARD_SIZE=6,PORT_COUNT=8;
  const OPPOSITE=[5,4,7,6,1,0,3,2];
  const STEPS=[[-1,0],[0,1],[1,0],[0,-1]];
  function validPort(port){return Number.isInteger(port)&&port>=0&&port<8}
  function rotatePort(port,quarterTurns){
    if(!validPort(port)||!Number.isInteger(quarterTurns))throw new Error("Invalid port or rotation");
    return (port+2*((quarterTurns%4+4)%4))%8;
  }
  function validatePairs(pairs){
    if(!Array.isArray(pairs)||pairs.length!==4)throw new Error("Exactly four path pairs required");
    const used=new Set();
    for(const pair of pairs){
      if(!Array.isArray(pair)||pair.length!==2||!validPort(pair[0])||!validPort(pair[1])||pair[0]===pair[1])throw new Error("Invalid path");
      if(used.has(pair[0])||used.has(pair[1]))throw new Error("Duplicate port");
      used.add(pair[0]);used.add(pair[1]);
    }
    if(used.size!==8)throw new Error("Every port must be used exactly once");
    return true;
  }
  function toConnections(pairs){
    validatePairs(pairs);
    const result=Array(8);
    for(const [a,b] of pairs){result[a]=b;result[b]=a}
    return result;
  }
  function connect(connections,entry,rotation=0){
    if(!Array.isArray(connections)||connections.length!==8||!validPort(entry))throw new Error("Invalid tile");
    const originalEntry=rotatePort(entry,-rotation);
    const originalExit=connections[originalEntry];
    if(!validPort(originalExit)||connections[originalExit]!==originalEntry)throw new Error("Invalid tile pairing");
    return rotatePort(originalExit,rotation);
  }
  function nextCell(row,col,exit){
    if(!Number.isInteger(row)||!Number.isInteger(col)||!validPort(exit))throw new Error("Invalid coordinates");
    const [dr,dc]=STEPS[Math.floor(exit/2)];
    return {row:row+dr,col:col+dc,entry:OPPOSITE[exit]};
  }
  function inside(row,col,size=BOARD_SIZE){return row>=0&&col>=0&&row<size&&col<size}
  // Board cells: null OR {connections: [8 entries], rotation: integer}
  // Begins on an entry port in the specified cell. Stops at the first unfilled cell.
  function trace(board,start,{maxSteps=144}={}){
    const size=board.length;
    if(!Number.isInteger(maxSteps)||maxSteps<1)throw new Error("Invalid step limit");
    let {row,col,entry}=start;
    if(!validPort(entry))throw new Error("Invalid start port");
    const visited=new Set(),segments=[];
    while(inside(row,col,size)){
      const tile=board[row]?.[col];
      if(!tile)return {status:"waiting",row,col,entry,segments};
      const state=[row,col,entry].join(":");
      if(visited.has(state))return {status:"loop",row,col,entry,segments};
      visited.add(state);
      if(segments.length>=maxSteps)throw new Error("Trace step limit exceeded");
      const exit=connect(tile.connections,entry,tile.rotation||0);
      segments.push({row,col,entry,exit});
      ({row,col,entry}=nextCell(row,col,exit));
    }
    return {status:"escaped",row,col,entry,segments};
  }
  return {BOARD_SIZE,OPPOSITE,rotatePort,validatePairs,toConnections,connect,nextCell,inside,trace};
});
