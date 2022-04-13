class Desktop
{
    constructor()
    {
        this.desktop = document.querySelector('.desktop');
        this.desktopContextMenu = this.desktop.querySelector('.desktopContextMenu');
        this.isSelecting = false;
        this.selectX, this.selectY = 0;
        this.selectionStream = {x:0, y:0, width:0, height:0};
    }

    selectStreamIn(e)
    {
        if((e.target!=this.desktopContextMenu && e.target.nodeName!='UL'
        && e.target.nodeName!='LI' && e.target==this.desktop))
        {
            this.selectX = e.pageX;
            this.selectY = e.pageY;
            this.createSelectionStream(e.pageX, e.pageY);
            this.isSelecting=true;
            desktopItems.selectStream=document.querySelector('.selectStream');
            // this.updateSelectionStream(document.querySelector('.selectStream'));
        }
    }

    selectStreamStill(e)
    {
        if(this.isSelecting && (e.target!=this.desktopContextMenu && e.target.nodeName!='UL'
        && e.target.nodeName!='LI'))
        {
            var selectStream = document.querySelector('.selectStream');
            selectStream.style.visibility = "visible";
            // console.log(e.pageX + ", " + e.pageY);
            if(e.pageX <= this.selectX)
            {
                if(e.pageX===this.selectX)
                {
                    selectStream.style.visibility="hidden";
                } else {
                    selectStream.style.visibility="visible";
                }
                selectStream.style.width = Math.abs(e.pageX-this.selectX) + "px";
                selectStream.style.left = e.pageX + "px"; 
            } else {
                selectStream.style.width = Math.abs(e.pageX-this.selectX) + "px";
            }

            if(e.pageY <= this.selectY)
            {
                if(e.pageY===this.selectY)
                {
                    selectStream.style.visibility="hidden";
                } else {
                    selectStream.style.visibility="visible";
                }
                selectStream.style.height = Math.abs(e.pageY-this.selectY) + "px";
                selectStream.style.top = e.pageY + "px";
            } else {
                selectStream.style.height = Math.abs(e.pageY-this.selectY) + "px";
            }   
        }
        if(document.querySelector('.selectStream')!=null && document.querySelector('.selectStream')!=0)
        {
            this.selectionStream=this.updateSelectionStream(document.querySelector('.selectStream'));
        }
        
    }

    selectStreamOut(e)
    {
        var selectStream = document.querySelector('.selectStream');

        if(this.isSelecting)
        {
            this.isSelecting=false;
            this.selectX = this.selectY = 0;
        }

        if(typeof(selectStream)!="undefined" && (selectStream!=null && selectStream!="0"))
        {   
            this.desktop.removeChild(document.querySelector('.selectStream'));
            desktopItems.selectStream=null;
        }
    } 

    createSelectionStream(posx, posy)
    {
        var el = document.createElement('div');
        el.style.position = "absolute";
        el.setAttribute('class', 'selectStream');
        el.style.visibility="hidden";
        el.style.left = posx + "px";
        el.style.top = posy + "px";
        el._parentElement = this.desktop;
        this.desktop.appendChild(el);
    }

    updateSelectionStream(el)
    {
        return {
            x:el.getBoundingClientRect().x, 
            y:el.getBoundingClientRect().y, 
            width:el.clientWidth, 
            height:el.clientHeight
        };
    }
}