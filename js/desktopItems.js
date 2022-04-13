class DesktopItems
{
    constructor()
    {
        this.placeholder = document.querySelector('.placeholder');
        this.selectStream = document.querySelector('.selectStream');
        this.desktop = document.querySelector('.desktop');
        this.sortType = "name";
        this.items = this.getItems();
        this.itemNames = this.getNames();
        this.lastItem = this.items[this.items.length-1];
        this.suggestedName = this.suggestName();
        this.left = 0;
    }

    getItems() {
        return document.querySelectorAll('.placeholder');
    }

    getNames() {
        var i=0;
        var names = [];
        this.items.forEach((el)=>{
            names[i] = el.children[1].innerText.toLowerCase();
            i++;
        });
        return names;
    }

    SaveItemsAndNames()
    {
        this.items = this.getItems();
        this.itemNames = this.getNames();
    }

    itemClickEvent(e)
    {
        document.querySelectorAll('.placeholder').forEach((el)=>{
            
            if(e.target===el || e.target===el.children[0])
            {
                el.classList.add('active');
            } else {
                if(this.selectStream==null)
                {
                    el.classList.remove('active');
                }  
            }
        });
    }

    itemContext(e)
    {
        document.querySelectorAll('.placeholder').forEach((el)=>{
            
            if(e.target===el || e.target===el.children[0])
            {
                el.classList.add('active');
            } else {
                if(this.selectStream==null)
                {
                    el.classList.remove('active');
                }
            }
        });
    }

    checkSelection(selection)
    {
        console.log(selection.x + ", " + selection.y + ", " + selection.width + ", " + selection.height);

        document.querySelectorAll('.placeholder').forEach((el)=>{
            this.selectStream = document.querySelector('.selectStream');
            var elPos = el.getBoundingClientRect();
            if(elPos.x+elPos.width >= selection.x && elPos.x <= selection.x+selection.width
                && elPos.y+elPos.height >= selection.y && elPos.y <= selection.y+selection.height)
            {
                el.classList.add('active');
                el.classList.add('selected');
            } else {
                el.classList.remove('active');
                el.classList.remove('selected');
            }
        });
    }

    selectionOut(e)
    {
        document.querySelectorAll('.placeholder').forEach((el)=>{
            if(el.classList.contains('selected'))
            {
                el.classList.add("active");
            }
        });
    }

    createItem(e)
    {
        this.sortItems(this.sortType);
        var newItem = this.lastItem.cloneNode(true);
        this.desktop.appendChild(newItem);
        var el = document.createElement('span');
        el.setAttribute("class", "rename");
        el.setAttribute("role", "textbox");
        el.setAttribute("contenteditable", "true");
        el.setAttribute("onfocusout", "desktopItems.rename(event)");
        el.setAttribute("onkeydown", "desktopItems.rename(event)");
        newItem.children[1].innerHTML = "";
        el.innerText = this.suggestName(); 
        el._parentElement = newItem.children[1];
        newItem.children[1].appendChild(el);

        //positioning newly created item at the end
        if(this.preventOverflow(this.lastItem))
        {
            newItem.style.left = this.left + "px";
            newItem.style.top = "0px";
        } else {
            var previousElement = this.lastItem;
            newItem.style.top = (previousElement.getBoundingClientRect().y
            + previousElement.clientHeight + parseInt(getComputedStyle(previousElement).marginBottom)) + "px";
        }
        
        //letting user rename newly created item
        el.focus();
        this.selectText(el);  
    }

    rename(e)
    {
        var value = e.target.textContent;

        if(""+e=="[object KeyboardEvent]")
        {
            if(e.key == "Enter")
            {
                e.target.removeAttribute("onfocusout");
                e.target.parentElement.innerHTML=value;
                this.sortItems(this.sortType);
            }
        }

        if(""+e=="[object FocusEvent]")
        {
            e.target.parentElement.innerHTML=value;
            this.sortItems(this.sortType);
        }    
    }

    sortItems(orderBy)
    {
        this.SaveItemsAndNames();
        var first=true;
        var previousElement = null;
        var nextColumn = false;
        this.left = 0;
        if(orderBy=="name")
        {
            this.itemNames.sort();
            var items=this.getItems();

            this.itemNames.forEach((eln)=>{

                for(let el of items) {
                    if(el.children[1].innerText.toLowerCase() == eln.toLowerCase())
                    {
                        if(first) {
                            el.style.top = "0px"; 
                            previousElement = el;      
                            first = false;
                            el.style.left = this.left;
                        } else {
                            nextColumn = this.preventOverflow(previousElement);
                            if(nextColumn)
                            {
                                el.style.left = this.left + "px";
                                el.style.top = "0px";
                                nextColumn=false;
                            } else {
                                el.style.top = (previousElement.getBoundingClientRect().y
                                + previousElement.clientHeight + parseInt(getComputedStyle(previousElement).marginBottom)) + "px";
                                el.style.left = parseInt(getComputedStyle(previousElement).left) + "px";
                            }
                            previousElement=el;
                            
                        }  
                        this.lastItem = el;
                        break;
                    }
                }
            });
        }
    }

    preventOverflow(previousElement)
    {
        
        if(previousElement.getBoundingClientRect().y 
        + previousElement.clientHeight + parseInt(getComputedStyle(previousElement).marginBottom) 
        + 90 >= this.desktop.clientHeight-document.querySelector('.taskbar').clientHeight)
        {
            
            this.left=(previousElement.getBoundingClientRect().x 
            + previousElement.clientWidth + parseInt(getComputedStyle(previousElement).marginRight));
            return true;
        } else {
            return false;
        }
    }

    suggestName()
    {
        this.SaveItemsAndNames();
        var nameExists=true;
        this.itemNames.sort();
        var name = "New folder";
        var j=2;
        while(nameExists)
        { 
            nameExists=false;
            for(var i=0; i<this.itemNames.length; i++)
            {
                if(this.itemNames[i].toLowerCase() == name.toLowerCase())
                {
                    nameExists=true;
                    //name already exists so the next name should be checked
                    break;
                }  
            }
            if(!nameExists)
            {
                return name;
            }
            name = "New folder ("+(j)+")";
            j++;
        } 
    }

    selectText(element) {
        var text = element;
        var range;
        var selection;

        if (document.body.createTextRange) { //ms
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) { //all others
            selection = window.getSelection();        
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    arrangeInColumns(element) {
        
    }
}