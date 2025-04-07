<h1> What? </h1>

A simple js implementation for creating lists with drag-drop support.
It was quick experiment and has not been extensively tested so use at your own risk.

See live demo here: https://animatorjeroen.github.io/reorderablelist-js/

<h1> Usage </h1>

To use in your project, simply add the folder: reorderableList. Then add the script in your HTML document as a module.
HTML List example:

```html
    <h1>example 1: re-orderable List</h1>
    <ul id="exampleList"></ul>
    <script src="reorderableList/reorderableList.js" type="module"></script>
```

Example js code to create a reorderable list: (this snippet is included in reorderableList.js) :

```js
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
```

<h1> Demo to-do list </h1>

todoList.js shows an implementation of reorderableList.js for a little todo list application.

