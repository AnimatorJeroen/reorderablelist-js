import { addTask } from './dragdrop.js';

import { ReorderableList } from './reorderableList.js'



const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskButton = document.getElementById("addTaskBtn");



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

const list = new ReorderableList(document.getElementById("listTest"));
const elem1 = document.createElement("test1");
elem1.innerHTML = `<div class="grow-wrap">
<textarea name="text" class ="inputText" id="text" onInput="this.parentNode.dataset.replicatedValue = this.value"> Text </textarea>
</div>`

const elem2 = document.createElement("test2");
elem2.innerHTML = `<p> hello world! </p>`
list.addElement(elem1);

list.addElement(elem2);


