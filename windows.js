let d=document,Q=(a)=>d.querySelectorAll(a),q=(a)=>Q(a)[0];
let windows=[];
let currentlyDragging=false;
let lastIdx=0;
[...Q("body .window")].forEach(initWindow)
function initWindow(win){
    console.log(win);
    windows.push(win);
    let dragging=false;
    let dragPos=[0,0];
    d.body.addEventListener("mouseup",e=>{
        dragging=false;
        currentlyDragging=false;
    });
    win.querySelector(".window-header").addEventListener("mousedown",e=>{
        if(!currentlyDragging){
            dragging=true;
            currentlyDragging=true;
            dragPos=[e.clientX,e.clientY];

            lastIdx++;
            win.style.zIndex=lastIdx;
        }
    })
    d.body.addEventListener("mousemove",e=>{
        if(dragging){
            //console.log(e);
            win.style.left=(parseInt(win.style.left.replace("px"))+e.clientX-dragPos[0])+"px";
            win.style.top=(parseInt(win.style.top.replace("px"))+e.clientY-dragPos[1])+"px";
            dragPos=[e.clientX,e.clientY]
        }
    });
    addEventListener("resize",e=>{ // upon screen resize
        if(win.getBoundingClientRect().right>innerWidth){
            let change=win.getBoundingClientRect().right-innerWidth;
            win.style.left=M.max(parseInt(win.style.left.replace("px",""))-change,0)+"px";
        };
        if(win.getBoundingClientRect().bottom>innerHeight){
            let change=win.getBoundingClientRect().bottom-innerHeight;
            win.style.top=M.max(parseInt(win.style.top.replace("px",""))-change,0)+"px";
        };
    });
}