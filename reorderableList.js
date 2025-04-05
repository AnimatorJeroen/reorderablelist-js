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
        this.#element = elem;
        this.#owningList = owner;

        //add elements
        const newElem = document.createElement("dragableListItem");
        newElem.innerHTML = 
        `
        <div class="taskMidDiv">

        </div>
        <div class="taskEndDiv">
        <button class="deleteButton">❌</button>
        <button class="dragButton">||</button>
        </div>
        `;
        const taskMidDiv = newElem.querySelector(".taskMidDiv");
        taskMidDiv.appendChild(elem);
        this.#owningList.appendChild(newElem);
    }
}