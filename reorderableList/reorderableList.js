




//////////////////////////inline styles//////////////////////
// Dynamically inject styles for reorderableList
function injectReorderableListStyles() {
    const styles = `
      dragableListItem {
          transition: all 0.3s ease; /* Smooth transition for all properties */
          width: 80%; /* Takes 80% of the parent div's width */
          min-height: 50px; /* Fixed height */
          position: relative; /* For positioning child elements */
          margin: auto; /* Center the task div horizontally */
          border: 2px solid rgb(48, 48, 48);
          padding: 10px;
          overflow: auto;
          display: flex; /* Arrange child elements in a row */
          align-items: center; /* Vertically center the child elements */
          justify-content: space-between; /* Space out the child elements */
          gap: 20px; /* Adds spacing between horizontal items */
          margin-bottom: 5px; /* Add vertical spacing between list items */
          background: #d8d8d8;
      }
  
      div.dragableItemContent {
          width: 100%; /* Automatically adjust width based on remaining space */
          height: auto; /* Expand downwards when content grows */
          min-height: 100%; /* Matches the height of the task div initially */
          word-break: break-word;
      }
  
      .dragging {
          position: fixed;
          width: 100px;
          z-index: 9;
          rotate: -5deg;
      }
  
      .dragDummy {
          background: #f3f3f3;
          border: 4px dotted rgb(226, 226, 226);
      }
  
      dropTarget {
          position: fixed;
          top: 0; /* Adjust as needed to align with the intended position */
          width: 100%;
          height: 3px;
          background-color: rgb(60, 114, 164);
          z-index: 8;
      }
    `;
  
    // Create a <style> element
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
  
    // Append the <style> element to the <head>
    document.head.appendChild(styleSheet);
  }
  
  // Call the function to inject styles
  injectReorderableListStyles();
////////////////////////////////////////////////////////////




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
        return this.#items.at(-1).getElement();
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
        <a class="deleteButton" style="width: 25px; height: 25px; cursor: pointer"><img src="reorderableList/delete-icon.png" alt="Delete" style="width: 100%; height: 100%;" /></a>
        <a class="dragButton" style="width: 50px; height: 50px; cursor: grab;"><img src="reorderableList/drag-icon.png" alt="Drag" style="width: 100%; height: 100%;" /></a>
        </div>
        `;
        const taskMidDiv = newItem.querySelector(".dragableItemContent");
        taskMidDiv.appendChild(elem);
        this.#owningList.prepend(newItem);

        //add listeners
        newItem.querySelector(".deleteButton").addEventListener("click", () => { newItem.remove(); delete this; });
        newItem.querySelector(".dragButton").addEventListener("mousedown", (event) => { this.onDragBegin(event); });
        //newItem.querySelector(".dragButton").addEventListener("touchstart", (event) => { this.onDragBegin(event); });
    }
    getElement() {return this.#element; }


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

      const mouseMoveHandler = (event) => { this.onDragMove(event); };
      const mouseUpHandler = (event) => { this.onDragEnd(event); document.removeEventListener("mousemove", mouseMoveHandler); document.removeEventListener("mouseup", mouseUpHandler); };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
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
    //console.log("yPosition");
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
      //console.log(this.isAbove);
      //console.log(this.yPosition);
      break;
    }
  }
}

}







/////// Example implementation //////////////////

// this example shows how to add dragable items,
// to a HTML element called: "testList"
const htmlElement = document.getElementById("exampleList");
if(htmlElement)
{
    const exampleList = new ReorderableList(htmlElement);
    const elem1 = document.createElement("test1");
    const elem2 = document.createElement("test2");
    const elem3 = document.createElement("test3");
    
    elem1.innerHTML = `<div class="grow-wrap">
    <textarea name="text" class ="inputText" id="text" onInput="this.parentNode.dataset.replicatedValue = this.value"> This is an example for input text inside a dragable list item.  </textarea>
    </div>`
    elem2.innerHTML = `<p> this is an example for text display inside a dragable list item </p>`

    exampleList.addElement(elem1);
    exampleList.addElement(elem2);
    exampleList.addElement(elem3);

}
///////////////////////////////////////////////////