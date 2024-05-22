let outputSelect=q("#outputSelect");
let currentOutput={};
function setOutput(){
  if(currentOutput&&currentOutput.component){
    memoryUsage.splice(memoryUsage.indexOf(currentOutput.component),1);
  } else {console.log("old has no component")}; // remove the old component
  let v=parseInt(outputSelect.value);
  currentOutput=[noOut,Display,characterArray,LEDsim][v]();
  if(currentOutput.component){
    addMemoryComponent(currentOutput.component); // add the new component
  } else {console.log("new has no component")};
  if(currentOutput.initialize){currentOutput.initialize()}
  q("#mainOutput").innerHTML="";
  if(currentOutput.html){q("#mainOutput").appendChild(currentOutput.html());};
  updateMemoryGUI();
}
outputSelect.addEventListener("change",setOutput);
if(outputSelect.value!="0"){setOutput()};
function noOut(){
    return {};
}
function Display() {
  var displayArray = [];
  var palette = [
    "#000000", "#ffffff", "#880000", "#aaffee",
    "#cc44cc", "#00cc55", "#0000aa", "#eeee77",
    "#dd8855", "#664400", "#ff7777", "#333333",
    "#777777", "#aaff66", "#0088ff", "#bbbbbb"
  ];
  palette='ကႀကႀႀ退က邀ႀႀ郀타邀郿ကჿჿကჿჿကကၟက需Ⴏက윀ჿၟက佟ၟ需侯ၟ윀俿ႇက靟ႇ需鞯ႇ윀響Ⴏက뽟Ⴏ需뾯Ⴏ윀뿿თက읟თ需잯თ윀쟿ჿကჿ需ჿ윀伀ၟၟ伀靟Ⴏ伀읟ჿ佟ၟ佟佟靟侯佟읟俿侇ၟ靟侇靟鞯侇읟響侯ၟ뽟侯靟뾯侯읟뿿俗ၟ읟俗靟잯俗읟쟿俿ၟ俿靟俿읟需ႇၟ需鞇Ⴏ需잇ჿ靟ႇ佟靟鞇侯靟잇俿鞇ႇ靟鞇鞇鞯鞇잇響鞯ႇ뽟鞯鞇뾯鞯잇뿿韗ႇ읟韗鞇잯韗잇쟿響ႇ響鞇響잇뼀Ⴏၟ뼀鞯Ⴏ뼀잯ჿ뽟Ⴏ佟뽟鞯侯뽟잯俿뾇Ⴏ靟뾇鞯鞯뾇잯響뾯Ⴏ뽟뾯鞯뾯뾯잯뿿뿗Ⴏ읟뿗鞯잯뿗잯쟿뿿Ⴏ뿿鞯뿿잯윀თၟ윀韗Ⴏ윀쟗ჿ읟თ佟읟韗侯읟쟗俿잇თ靟잇韗鞯잇쟗響쾯ჟ뽟쾯韟뾯쾯쿟뿿쿟ჟ콟쿟韟쾯쿟쿟쿿쿿ჟ쿿韟쿿쿟ჿၟ響Ⴏ쿿ჿჿ佟響侯쿿俿ჿ靟響鞯쿿響ჿ뽟響뾯쿿뿿ჿ콟響쾯쿿쿿ჿ響쿿᠈᠒Ȓజద㘦‰›⨺呄呎幎䡘䡢牢籬籶晶邀邊骊蒔蒞躞뢨뢲ꊲ겼곆훆샐샚쫚ﻮ'.split("").map(a=>(a.charCodeAt()^0x1000).toString(16).padStart(4,"0")).join("").match(/.{1,6}/g).map(a=>"#"+a);
  // for those wondering why there are random characters, i just didnt want to store the entire array as-is
  // https://upload.wikimedia.org/wikipedia/commons/1/15/Xterm_256color_chart.svg
  let canvas = d.createElement("canvas");
  var ctx;
  var width;
  var height;
  var pixelSize;
  var numX = 32;
  var numY = 32;
  function initialize() {
    canvas.width=canvas.height=160;
    width = canvas.width;
    height = canvas.height;
    pixelSize = width / numX;
    ctx = canvas.getContext('2d');
    reset();
  }
  function makeHTML(){
      let elem=d.createElement("div");
      elem.appendChild(canvas);
      return elem;
  }
  function reset() {
    let offset=memoryUsage.find(a=>a.reference==3).start;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    for(let i=0;i<0x400;i++){
      let j=(i+offset);
      updatePixel(j);
    }
  }

  function updatePixel(addr,val) {
    let offset=memoryUsage.find(a=>a.reference==3).start;
    addr-=offset;
    ctx.fillStyle = palette[val%palette.length];
    var y = Math.floor((addr) / 32);
    var x = (addr) % 32;
    console.log(`x=${x}, y=${y}, offset=${offset}, addr=${addr2hex(addr)}`);
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }

  function onSet(addr,val){
    //console.log("set "+addr+" to "+val)
    if(getMemoryType(addr)==3){
      updatePixel(addr,val)
    }
  }

  return {
    initialize: initialize,
    reset: reset,
    updatePixel: updatePixel,
    html: makeHTML,
    component: {"flexlen":false,"overwrite":false,"change":true, "write":true, "name":"32x32 screen",     "color":"#113","start":0x0200,"end":0x05ff,"reference":3},
    memorySet: onSet
  };
};
function characterArray(){
  let chArray=[];
  let thisHTML=null;
  function updateCharacter(i,j,val){
    let offset=memoryUsage.find(a=>a.reference==4).start;
    if(!val){val=memory.get(i*32+j+offset)};
    val=String.fromCharCode(val);
    if(val=="\x00"||val=="\n"){val=" ";}
    console.log(`i=${i}, j=${j}, val=${val}`);
    //chArray[i][j]=String.fromCharCode(val);
    chArray[i]=chArray[i].split("").map((a,b)=>b==j?val:a).join("");
    //console.log(chArray);
    if(thisHTML){
      thisHTML.querySelector("textarea").value=chArray.join("\n");
    } else {
      console.log("no html present!")
    }
  }
  function initialize(){
    chArray=[];
    for(let i=0;i<32;i++){
      chArray.push(" ".repeat(128));
    };
    for(let i=0;i<32;i++){
      for(let j=0;j<128;j++){
        updateCharacter(i,j);
      };
    };
  }
  function makeHTML(){
    thisHTML=d.createElement("div");
    let textarea=d.createElement("textarea");
    textarea.setAttribute("rows","32");
    textarea.setAttribute("cols","128");
    thisHTML.appendChild(textarea);
    return thisHTML;
  }
  function onSet(addr,val){
    if(getMemoryType(addr)==4){
      console.log("set "+addr+" to "+val);
      let offset=memoryUsage.find(a=>a.reference==4).start;
      addr-=offset;
      let i=M.floor(addr/128);
      let j=addr%128;
      updateCharacter(i,j,val);
    }
  }
  return {
    initialize: initialize,
    html: makeHTML,
    reset: initialize,
    memorySet: onSet,
    component: {"flexlen":false,"overwrite":false,"change":true, "write":true, "name":"Character array",     "color":"#362","start":0x0000,"end":0x0fff,"reference":4}
  }
}
function LEDsim(){
  let characters="";
  let cursor=0;
  let htmlelem;
  function initialize(){
    characters="";
  };
  function makeHTML(){
    let textarea=d.createElement("textarea");
    textarea.setAttribute("rows","2");
    textarea.setAttribute("cols","40");
    htmlelem=textarea;
    return textarea;
  };
  function getPins(addr,val){
    if(!val){val=memory.get(addr)};
    return [...Array(3).keys()].map(a=>(val>>a)&1);
  }
  function onSet(addr,val){
    if(getMemoryType(addr)!=5) return;
    let offset=memoryUsage.find(a=>a.reference==5).start;
    let addr2=addr;
    addr-=offset;
    console.log(addr+" got set to "+val);
    let RS,RW,E;
    if(addr==0){
      // other pins (RS, R/W, E)
      [E,RW,RS]=getPins(0,val);
      console.log(`RS=${RS}, RW=${RW}, E=${E}`);
    } else {
      // data pins got set
      [E,RW,RS]=getPins(addr2-1);
      console.log(`data=${val} RS=${RS}, RW=${RW}, E=${E}`);
      if(RS){
        if(RW){
          // read data
          console.log("reading data");
        } else {
          // write data
          console.log("writing "+val);
          characters+=String.fromCharCode(val);
          htmlelem.value=characters;
          cursor++;
        }
      }
    }
  }
  return {
    initialize: initialize,
    reset: initialize,
    html: makeHTML,
    memorySet: onSet,
    component: {"flexlen":false,"overwrite":false,"change":true, "write":true, "name":"LED simulation",     "color":"#08e","start":0x0000,"end":0x0001,"reference":5}
  }
}