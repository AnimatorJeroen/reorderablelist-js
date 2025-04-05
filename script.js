import { makeDragable } from './dragdrop.js';



const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskButton = document.getElementById("addTaskBtn");

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

