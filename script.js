const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskButton = document.getElementById("addTaskBtn");


var dragging_startPosX;
var dragging_startPosY;
var target = null;
var isAbove = false;
var yPosition = 0;
function onDragBegin(event, elem)
{
  //reset drag/drop vars
  target = null;
  isAbove = false;
  yPosition = 0;

  const computedStyleWidth = window.getComputedStyle(elem).width;

  startOffsetTop = elem.offsetTop;
  startOffsetLeft = elem.offsetLeft;
  elem.classList.add("dragging");

  //insert a temp placeholder
  const dummyTask = document.createElement("task");
  dummyTask.classList.add("dragDummy");
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

function onDragMove(event, elem, dropTargetLine, dummyTask)
{
  event.preventDefault();
  const dragDeltaX = event.clientX - dragging_startPosX;
  const dragDeltaY = event.clientY - dragging_startPosY;

  elem.style.left = (startOffsetLeft + dragDeltaX) + "px";
  elem.style.top = (startOffsetTop + dragDeltaY) + "px";

  const mouseY = event.clientY;
  findDropTarget(mouseY, elem,dummyTask, dropTargetLine);
  if(target != null)
    dropTargetLine.style.top = yPosition;
    

}

function onDragEnd(event, elem, dummyTask, dropTargetLine)
{

  dummyTask.remove();
  dropTargetLine.remove();
  elem.style.left = 0;
  elem.style.top = 0;
  document.onmousemove = null;
  document.onmouseup = null;

  if(target != null)
  {
    console.log("place");
      taskList.insertBefore(elem, isAbove ? target : target.nextSibling);
  }

  elem.classList.remove("dragging");
  elem.style.width = ""; // Reset width to allow dynamic resizing
}

function makeDragable(elem, clickElem)
{
  clickElem.addEventListener("mousedown", (event) => { onDragBegin(event, elem); });
}

function addTask() {
  const taskName = taskInput.value.trim();
  if (taskName == "")
    return;

  //add elements
  const newTask = document.createElement("task");
  newTask.innerHTML = 
  `
  <div class="taskFrontDiv">
  <input type="checkbox" class="check" id="checkbox" name="checkbox">
  </div>
  <div class="taskMidDiv">
  <div class="grow-wrap">
    <textarea name="text" class ="inputText" id="text" onInput="this.parentNode.dataset.replicatedValue = this.value"> ${taskName} </textarea>
  </div>
  </div>
  <div class="taskEndDiv">
  <button class="deleteButton">❌</button>
  <button class="dragButton">||</button>
  </div>
  `;

  //add listeners
  newTask.querySelector(".check").addEventListener("click", () => { newTask.classList.toggle("completed"); });
  newTask.querySelector(".deleteButton").addEventListener("click", () => { newTask.remove(); });
  makeDragable(newTask, newTask.querySelector(".dragButton"));

  taskInput.value = "";
  taskList.prepend(newTask);
}

taskInput.addEventListener("keydown", (event) =>
{
  if (event.key == "Enter")
    addTask();
})

//check if it contains input
taskInput.addEventListener("input", () => {
  if(taskInput.value.trim() == "")
  addTaskButton.setAttribute("disabled", true);
else
  addTaskButton.removeAttribute("disabled");
})

addTaskButton.addEventListener("click", () => {addTask();})

