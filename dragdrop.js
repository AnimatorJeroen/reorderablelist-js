var dragging_startPosX;
var dragging_startPosY;
var target = null;
var isAbove = false;
var yPosition = 0;
var startOffsetTop;
var startOffsetLeft;
function onDragBegin(event, elem)
{
  //reset drag/drop vars
  target = null;
  isAbove = false;
  yPosition = 0;

  //fix the height during dragging to prevent scrollbar jumping
  taskList.style.height = taskList.offsetHeight + "px";

  const computedStyleWidth = window.getComputedStyle(elem).width;

  startOffsetTop = elem.getBoundingClientRect().top;
  startOffsetLeft = elem.getBoundingClientRect().left;
  elem.classList.add("dragging");

  //insert a temp placeholder
  const dummyTask = document.createElement("task");
  dummyTask.classList.add("dragDummy");
  dummyTask.style.height = window.getComputedStyle(elem).height;
  taskList.insertBefore(dummyTask, elem);
  const dropTargetLine = document.createElement("dropTarget");
  taskList.insertBefore(dropTargetLine, elem);
  dropTargetLine.style.width = computedStyleWidth;
  
  //fix inital display line of dropTargetLine
  const marginBottom = parseFloat(window.getComputedStyle(elem).marginBottom);
  const rect = dummyTask.getBoundingClientRect();
  yPosition = rect.top + rect.height + marginBottom/2 + "px";
  dropTargetLine.style.left = rect.left + "px";
  dropTargetLine.style.width = rect.width + "px";
  dropTargetLine.style.top = yPosition;


  event.preventDefault();
  dragging_startPosX = event.clientX;
  dragging_startPosY = event.clientY;
  elem.style.top = (startOffsetTop) + "px"; 
  // Set the width of the element explicitly to maintain its size while dragging
  elem.style.width = computedStyleWidth;

  onDragMove(event, elem);
  document.onmousemove = (event) => { onDragMove(event, elem, dropTargetLine, dummyTask); };
  document.onmouseup = (event) => { onDragEnd(event, elem, dummyTask, dropTargetLine); };

}

function findDropTarget(mouseY, elem, dummyTask, dropTargetLine)
{
  const tasks = Array.from(taskList.children);
  for (const task of tasks) {
    if(task == dropTargetLine || task == elem || task == dummyTask)
      continue;
    if(dropTargetLine == null)
      break;

    const marginBottom = parseFloat(window.getComputedStyle(task).marginBottom);
    const rect = task.getBoundingClientRect();
    // Check if the mouse is within the bounds of this task
    if (mouseY > rect.top && mouseY < rect.bottom) {
      // Insert the drop target before or after this task based on the mouse position
      target = task;
      if (mouseY < rect.top + rect.height / 2) {
        yPosition = rect.top - marginBottom/2 +  "px";
        isAbove = true;
      } else {
        yPosition = rect.top + rect.height + marginBottom/2 + "px";
        isAbove = false;
      }
      console.log(isAbove + " " + target.querySelector(".inputText").value);
      console.log(yPosition);
      break;
    }
  }

  return {target, isAbove, yPosition};
}

let scrollInterval = null;
function onDragMove(event, elem, dropTargetLine, dummyTask)
{
  elem.style.transition ="none";

  
  event.preventDefault();
  const dragDeltaX = event.clientX - dragging_startPosX;
  const dragDeltaY = event.clientY - dragging_startPosY;

  elem.style.left = (startOffsetLeft + dragDeltaX) + "px";
  elem.style.top = (startOffsetTop + dragDeltaY) + "px";

  const mouseY = event.clientY;
  findDropTarget(mouseY, elem,dummyTask, dropTargetLine);
  if(target != null)
    dropTargetLine.style.top = yPosition;
    

    // Auto-scroll logic
    const scrollThreshold = 50; // Distance from the edge of the viewport to trigger scrolling

    if (mouseY < scrollThreshold || mouseY > window.innerHeight - scrollThreshold) {

      if(!scrollInterval){
        const scrollSpeed = mouseY < scrollThreshold ? -10 : 10; // Pixels to scroll per frame
        scrollInterval = setInterval( () => {window.scrollBy(0, scrollSpeed);}, 16);
      }
    } else if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
    }

}

function onDragEnd(event, elem, dummyTask, dropTargetLine)
{

  dropTargetLine.remove();
  document.onmousemove = null;
  document.onmouseup = null;


  if(target != null)
  {
    taskList.insertBefore(dummyTask, isAbove ? target : target.nextSibling);
  }
  elem.style.transition = "all 0.3s ease";
  elem.style.rotate = "0deg";
  elem.style.left = dummyTask.getBoundingClientRect().left + "px";
  elem.style.top = (dummyTask.getBoundingClientRect().top) + "px";

  
  // Wait for the animation duration before proceeding
  const animationDuration = parseFloat(window.getComputedStyle(elem).transitionDuration) * 1000 || 0;
  setTimeout(() => {

    if (target != null) {
      console.log("place");
      taskList.insertBefore(elem, isAbove ? target : target.nextSibling);
    }

    dummyTask.remove();
    
    elem.style.left = "";
    elem.style.top = "";
    elem.style.width = ""; // Reset width to allow dynamic resizing
    elem.style.rotate = "";
    elem.style.transition = "";
    elem.classList.remove("dragging");
    taskList.style.height = "";

  }, animationDuration);
}

export function makeDragable(elem, clickElem)
{
  clickElem.addEventListener("mousedown", (event) => { onDragBegin(event, elem); });
}