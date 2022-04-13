var desktop = new Desktop();
var contextMenu = new ContextMenu();
var desktopItems = new DesktopItems();


var obj = {
    isSelecting:false,
    isSelectingStill:false,
    selectionX:0,
    selectionY:0,
    pageX:0,
    pageY:0,
    target:null
}

document.addEventListener('mousedown', (e)=>{
    obj=saveEvent(e);
    if(e.target==desktop.desktop){ desktop.selectStreamIn(e); }
    
    contextMenu.menuMouseDown(e);
});

document.addEventListener('mousemove', (e)=>{
    
    if(obj.isSelecting){
        obj.isSelectingStill=true;
        obj.selectionX=e.pageX; 
        obj.selectionY=e.pageY; 
        desktop.selectStreamStill(e);
        desktopItems.checkSelection(desktop.selectionStream);
    }
});

document.addEventListener('mouseup', (e)=>{

    desktop.selectStreamOut(e);

    //two means right-click (if Mouse has a middle mouse button [code:1])
    if(obj.isSelecting && e.button == "2")
    {
        if(!obj.isSelectingStill){desktopItems.itemContext(e);}
        contextMenu.propogateMenu(obj);
        clearObj(obj);
    }

    //zero means left-click
    if(e.button == "0")
    {  
        contextMenu.menuClickEvent(e);
        if(!obj.isSelectingStill){desktopItems.itemClickEvent(e);}
    }
    if(obj.isSelectingStill){desktopItems.selectionOut(e);}
    obj.isSelectingStill=false;
    obj.isSelecting=false;
    
});

document.addEventListener('click', (e)=>{
    
});

document.addEventListener('dblclick', (e)=>{
    
});

window.addEventListener('resize', (e)=>{
    desktopItems.sortItems(desktopItems.sortType);
});

function saveEvent(e) {
    return obj = {
        isSelecting:true,
        isSelectingStill:false,
        selectionX:e.pageX,
        selectionY:e.pageY,
        pageX:e.pageX,
        pageY:e.pageY,
        target:e.target
    }
}

function clearObj(obj) {
    obj.isSelecting=false;
    obj.selectionX=0;
    obj.selectionY=0;
    obj.pageX=0;
    obj.pageY=0;
    obj.target=null;
}



// setInterval(()=>{console.log((desktopItems.selectStream))},10)