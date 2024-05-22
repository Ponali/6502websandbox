let M=Math;
let memoryUsage=[
    {"flexlen":false, "overwrite":true, "change":false,"write":false,"name":"runtime addresses","color":"#0ff","start":0xfffc,"end":0xfffd,"reference":0},
    {"flexlen":true, "overwrite":false,"change":true, "write":false,"name":"ROM",              "color":"#88e","start":0x0600,"end":0xffff,"reference":1},
    {"flexlen":true,"overwrite":false,"change":true, "write":true, "name":"RAM",              "color":"#3d3","start":0x0000,"end":0x01ff,"reference":2}
    //{"crucial":false,"overwrite":false,"change":true, "write":true, "name":"32x32 screen",     "color":"#113","start":0x0200,"end":0x05ff,"reference":3}
];
let muCnv=q("#memoryCanvas"),muCtx=muCnv.getContext("2d");
muCnv.width=800;muCnv.height=50;
function renderMUCanvas(){
    let ctx=muCtx;
    ctx.fillStyle="#444";
    ctx.font="16px Arial";
    ctx.fillRect(0,0,muCnv.width,muCnv.height);
    let toRender=[...memoryUsage].sort((a,b)=>a.start-b.start);
    for(let i=0;i<toRender.length;i++){
        let component=toRender[i];
        ctx.fillStyle=component.color;
        let startPos=M.floor(component.start/0xffff*muCnv.width);
        let rectLength=M.ceil((component.end-component.start)/0xffff*muCnv.width);
        console.log(startPos);
        ctx.fillRect(startPos,0,rectLength,50);
        let colorDepth=ctx.fillStyle.slice(1).match(/.{1,2}/g).map(a=>parseInt(a,16)).reduce((partialSum, a)=>partialSum+a,0)/(255*3);
        ctx.fillStyle=(colorDepth>0.5?"#000":"#fff");
        let textWidth=ctx.measureText(component.name).width;
        if(textWidth<rectLength){
            ctx.fillText(component.name,startPos+3,45);
        }
    }
};
function addr2hex(addr){return (addr|0).toString(16).padStart(4,"0");}
function updateMemorySettings(){
    let insert=[];
    let maxlen=[...memoryUsage.map(a=>a.name.length)].sort((a,b)=>a-b).reverse()[0];
    for(let i=0;i<memoryUsage.length;i++){
        let component=memoryUsage[i];
        let elem=d.createElement("div");
        elem.innerHTML='<div id="componentColor" style="background:'+component.color+';"></div>'+(component.name+": ").padEnd(maxlen+2," ");
        if(component.change){
            elem.innerHTML+=`start: $<input type="text" value="${addr2hex(component.start)}" /> end: $<input type="text" value="${addr2hex(component.end)}" /> / offset: $<input type="text" value="${addr2hex(component.start)}" /> length: $<input type="text" value="${addr2hex(component.end-component.start+1)}" />`;
            if(!component.flexlen){[...elem.children].at(-1).setAttribute("disabled",!0)};
            [...elem.children].slice(1).forEach((a,j)=>{a.addEventListener("change",()=>{
                j=[0,1,3,2][j]; // swap 2 and 3
                let lenbef=component.end-component.start;
                if(j!=3){
                    memoryUsage[i][j?"end":"start"]=parseInt(a.value,16)+(component.start-1)*(j==2);
                } else {
                    memoryUsage[i].end+=parseInt(a.value,16)-component.start;
                    memoryUsage[i].start=parseInt(a.value,16);
                };
                if(!component.flexlen){
                    if(j==1){
                        memoryUsage[i].start=memoryUsage[i].end-lenbef;
                    } else {
                        memoryUsage[i].end=memoryUsage[i].start+lenbef;
                    }
                }
                renderMUCanvas();
                updateMemorySettings();
            });});
        } else {
            elem.innerHTML+=`start: $<input type="text" value="${addr2hex(component.start)}" disabled /> end: $<input type="text" value="${addr2hex(component.end)}" disabled /> / This component is locked.`
        }
        insert.push(elem);
    };
    q("#memorySettings").innerHTML="";
    insert.forEach(a=>q("#memorySettings").appendChild(a));
};
renderMUCanvas();
updateMemorySettings();
function getMemoryType(addr){
    let a=[...memoryUsage].sort((a,b)=>b.overwrite-a.overwrite).find(a=>(a.start<=addr)&&(a.end>=addr))
    if(!a){return null;}
    return a.reference;
}
function getComponentFromReference(ref){
    return memoryUsage.find(a=>a.reference==ref);
};
function getMemoryComponent(addr){
    let a=getMemoryType(addr);
    if(!a){return null;}
    return getComponentFromReference(a);
}
function getAvailableStart(length){
    let sorted=[...memoryUsage].sort((a,b)=>a.start-b.start);
    try{
        return sorted[sorted.map(a=>{let end=a.end+1+length,start=a.end+1;let out=false;memoryUsage.forEach(b=>{if(end<b.start){out=true};});return out;}).indexOf(true)].end+1
    }catch{
        return 0;
    }
}
function addMemoryComponent(comp){
    let len=comp.end-comp.start+1;
    let start=getAvailableStart(len);
    comp.start=start;
    comp.end=start+len-1;
    memoryUsage.push(comp);
    memory.reset();
}
function updateMemoryGUI(){
    renderMUCanvas();
    updateMemorySettings();
    if(currentOutput&&currentOutput.reset)currentOutput.reset();
}