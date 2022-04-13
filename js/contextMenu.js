class ContextMenu
{
    constructor()
    {
        this.desktop = document.querySelector('.desktop');
        this.taskbar = document.querySelector('.taskbar');
        this.contextMenu = this.desktop.querySelector('.desktopContextMenu');
        this.viewMenu = this.contextMenu.querySelector('.view');
        this.sortbyMenu = this.contextMenu.querySelector('.sortby');
        this.newMenu = this.contextMenu.querySelector('.new');
        this.posX, this.posY = 0;
    }

    propogateMenu(e)
    {
        if(e.target===this.desktop)
        { 
            
            this.contextMenu.classList.add('active');

            if((e.pageX+this.contextMenu.clientWidth)>this.desktop.clientWidth)
            {
                this.posX=this.desktop.clientWidth-this.contextMenu.clientWidth;
            } else {
                this.posX=e.pageX;
            }

            if((e.pageY+this.contextMenu.clientHeight)>this.desktop.clientHeight-this.taskbar.clientHeight)
            {
                this.posY=e.pageY-this.contextMenu.clientHeight;
            } else {
                this.posY=e.pageY;
            }

            this.contextMenu.style.left = `${this.posX}px`;
            this.contextMenu.style.top = `${this.posY}px`;
            
            document.querySelectorAll('.sub-menu').forEach((el)=>
            {
                el.style.visibility = "hidden";
                el.style.display = "block";
                el.classList.remove('aligntop');
                el.classList.remove('alignleft');

                if(el.getBoundingClientRect().x + el.clientWidth > this.desktop.clientWidth)
                {
                    el.classList.add('alignleft');
                } else {
                    el.classList.remove('alignleft');
                }

                if(el.getBoundingClientRect().y+el.clientHeight>this.desktop.clientHeight-this.taskbar.clientHeight)
                {
                    el.classList.add('aligntop');
                } else {
                    el.classList.remove('aligntop');
                }
                el.style.display = "none";   
            });
            
        } else {
            this.contextMenu.classList.remove('active');
        }
    }

    menuClickEvent(e)
    {
        if(e.target!=this.contextMenu)
        {
            this.contextMenu.classList.remove('active');
        }

        if(e.target.textContent === "Folder")
        {
            desktopItems.createItem(e);
        }
    }

    menuMouseDown(e)
    {
        if(e.target!=this.contextMenu && e.target.nodeName!="UL" && e.target.nodeName!="LI")
        {
            this.contextMenu.classList.remove('active');
        }
    }

}