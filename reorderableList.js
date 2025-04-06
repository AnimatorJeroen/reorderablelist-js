export class ReorderableList
{
    #element;
    #items = [];
    constructor(elem) {
        this.#element = elem;
    }

    addElement(elem)
    {
        this.#items.push(new ReorderableListItem(elem, this.#element));
    }

};

class ReorderableListItem
{
    #element;
    #owningList;
    constructor(elem, owner) {
        this.#owningList = owner;

        //add elements
        const newItem = document.createElement("dragableListItem");
        this.#element = newItem;
        newItem.innerHTML = 
        `
        <div class="dragableItemContent" style="width: 100%; height: auto;">

        </div>
        <div class="dragableItemOptions" style="display: flex; justify-content: flex-end; align-items: center; gap: 10px;">
        <a class="deleteButton" style="width: 25px; height: 25px; cursor: pointer"><img src="delete-icon.png" alt="Delete" style="width: 100%; height: 100%;" /></a>
        <a class="dragButton" style="width: 50px; height: 50px; cursor: grab;"><img src="drag-icon.png" alt="Drag" style="width: 100%; height: 100%;" /></a>
        </div>
        `;
        const taskMidDiv = newItem.querySelector(".dragableItemContent");
        taskMidDiv.appendChild(elem);
        this.#owningList.prepend(newItem);

        //add listeners
        newItem.querySelector(".deleteButton").addEventListener("click", () => { newItem.remove(); delete this; });
        newItem.querySelector(".dragButton").addEventListener("mousedown", (event) => { this.onDragBegin(event); });
    }

    dragableListItemContent
    static dragging_startPosX;
    static dragging_startPosY;
    static target = null;
    static isAbove = false;
    static yPosition = 0;
    static startOffsetTop;
    static startOffsetLeft;
    static dropTargetLine = null;
    static dummyTask = null;
    static scrollInterval = null;

    
    onDragBegin(event, elem)
    {
      //reset drag/drop vars
      this.target = null;
      this.isAbove = false;
      this.yPosition = 0;
    
      //fix the height during dragging to prevent scrollbar jumping
      this.#owningList.style.height = this.#owningList.offsetHeight + "px";
    
      const computedStyleWidth = window.getComputedStyle(this.#element).width;
    
      this.startOffsetTop = this.#element.getBoundingClientRect().top;
      this.startOffsetLeft = this.#element.getBoundingClientRect().left;
      this.#element.classList.add("dragging");
    
      //insert a temp placeholder
      this.dummyTask = document.createElement("dragableListItem");
      this.dummyTask.classList.add("dragDummy");
      this.dummyTask.style.height = window.getComputedStyle(this.#element).height;
      this.#owningList.insertBefore(this.dummyTask, this.#element);
      this.dropTargetLine = document.createElement("dropTarget");
      this.#owningList.insertBefore(this.dropTargetLine, this.#element);
      this.dropTargetLine.style.width = computedStyleWidth;
      
      //fix inital display line of dropTargetLine
      const marginBottom = parseFloat(window.getComputedStyle(this.#element).marginBottom);
      const rect = this.dummyTask.getBoundingClientRect();
      this.yPosition = rect.top + rect.height + marginBottom/2 + "px";
      this.dropTargetLine.style.left = rect.left + "px";
      this.dropTargetLine.style.width = rect.width + "px";
      this.dropTargetLine.style.top = this.yPosition;
    
    
      event.preventDefault();
      this.dragging_startPosX = event.clientX;
      this.dragging_startPosY = event.clientY;
      this.#element.style.top = (this.startOffsetTop) + "px"; 
      // Set the width of the element explicitly to maintain its size while dragging
      this.#element.style.width = computedStyleWidth;
    
      this.onDragMove(event);
      document.onmousemove = (event) => { this.onDragMove(event); };
      document.onmouseup = (event) => { this.onDragEnd(event); };
    }

    onDragMove(event)
    {
        this.#element.style.transition ="none";

        event.preventDefault();
        const dragDeltaX = event.clientX - this.dragging_startPosX;
        const dragDeltaY = event.clientY - this.dragging_startPosY;

        this.#element.style.left = (this.startOffsetLeft + dragDeltaX) + "px";
        this.#element.style.top = (this.startOffsetTop + dragDeltaY) + "px";

        const mouseY = event.clientY;
        this.findDropTarget(mouseY);
        if(this.target != null)
            this.dropTargetLine.style.top = this.yPosition;

        // Auto-scroll logic
        const scrollThreshold = 50; // Distance from the edge of the viewport to trigger scrolling

        if (mouseY < scrollThreshold || mouseY > window.innerHeight - scrollThreshold) {

        if(!this.scrollInterval){
            const scrollSpeed = mouseY < scrollThreshold ? -10 : 10; // Pixels to scroll per frame
            this.scrollInterval = setInterval( () => {window.scrollBy(0, scrollSpeed);}, 16);
        }
        } else if (this.scrollInterval) {
        clearInterval(this.scrollInterval);
        this.scrollInterval = null;
        }

    }

    onDragEnd(event)
    {

        if(this.dropTargetLine != null)
            this.dropTargetLine.remove();
    document.onmousemove = null;
    document.onmouseup = null;


    if(this.target != null)
    {
        this.#owningList.insertBefore(this.dummyTask, this.isAbove ? this.target : this.target.nextSibling);
    }
    this.#element.style.transition = "all 0.3s ease";
    this.#element.style.rotate = "0deg";
    this.#element.style.left = this.dummyTask.getBoundingClientRect().left + "px";
    this.#element.style.top = (this.dummyTask.getBoundingClientRect().top) + "px";

    
    // Wait for the animation duration before proceeding
    const animationDuration = parseFloat(window.getComputedStyle(this.#element).transitionDuration) * 1000 || 0;
    setTimeout(() => {

        if (this.target != null) {
        console.log("place");
        this.#owningList.insertBefore(this.#element, this.isAbove ? this.target : this.target.nextSibling);
        }

        this.dummyTask.remove();
        
        this.#element.style.left = "";
        this.#element.style.top = "";
        this.#element.style.width = ""; // Reset width to allow dynamic resizing
        this.#element.style.rotate = "";
        this.#element.style.transition = "";
        this.#element.classList.remove("dragging");
        this.#owningList.style.height = "";

    }, animationDuration);
    }


findDropTarget(mouseY)
{
  const tasks = Array.from(this.#owningList.children);
  for (const task of tasks) {
    console.log("yPosition");
    if(this.dropTargetLine == null)
        break;

    if(task == this.dropTargetLine || task == this.#element || task == this.dummyTask)
      continue;

    const marginBottom = parseFloat(window.getComputedStyle(task).marginBottom);
    const rect = task.getBoundingClientRect();
    // Check if the mouse is within the bounds of this task
    if (mouseY > rect.top && mouseY < rect.bottom) {
      // Insert the drop target before or after this task based on the mouse position
      this.target = task;
      if (mouseY < rect.top + rect.height / 2) {
        this.yPosition = rect.top - marginBottom/2 +  "px";
        this.isAbove = true;
      } else {
        this.yPosition = rect.top + rect.height + marginBottom/2 + "px";
        this.isAbove = false;
      }
      console.log(this.isAbove);
      console.log(this.yPosition);
      break;
    }
  }
}

}