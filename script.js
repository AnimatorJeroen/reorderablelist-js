import { ReorderableList } from './reorderableList.js'



const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTaskBtn");
const list = new ReorderableList(document.getElementById("taskList"));



function addTask()
{
  const taskName = taskInput.value.trim();
  if (taskName == "")
    return;

  //add element content
  const newTask = document.createElement("taskContent");
  newTask.innerHTML = 
  
  `<input type="checkbox" class="check" name="checkbox">
  <div class="grow-wrap">
  <textarea name="text" class ="inputText" onInput="this.parentNode.dataset.replicatedValue = this.value"> ${taskName} </textarea>
  </div>`

  const reorderableItem = list.addElement(newTask);
  //add listener
  newTask.querySelector(".check").addEventListener("click", () => { reorderableItem.classList.toggle("completed"); });

  taskInput.value = "";
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




const testList = new ReorderableList(document.getElementById("testList"));
const elem1 = document.createElement("test1");
elem1.innerHTML = `<div class="grow-wrap">
<textarea name="text" class ="inputText" id="text" onInput="this.parentNode.dataset.replicatedValue = this.value"> Text </textarea>
</div>`
const elem2 = document.createElement("test2");
elem2.innerHTML = `<p> hello world! this is a test for text display inside a list element </p>`
testList.addElement(elem1);
testList.addElement(elem2);

