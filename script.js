const TODOS = 'todo';

class EventEmitter {
    constructor() {
        this.subscriptions = [];
    }

    subscribe(callback) {
        this.subscriptions.push(callback);
    }

    emit(data) {
        this.subscriptions.forEach(s => s(data));
    }
}

class Todo {
    /**
     * @param {Integer} id 
     * @param {String} title 
     */
    constructor(id, title) {
        /** @type {Integer} */
        this.id = id;
        /** @type {String} */
        this.title = title;
        
        /** @type {Date} */
        this.createdDate = new Date();
        /** @type {Date} */
        this.modifiedDate = new Date();
    }

    rename(title) {
        this.title = title;
        this.modifiedDate = new Date();
    }
}

class TodoService {
    constructor() {
        /** @type {Todo[]} */
        this.todos = [];
        /** @type {Integer} */
        this.lastId = 0;
        /** @type {EventEmitter} */
        this.eventEmitter = new EventEmitter();
        this.restore();
    }

    getAll() {
        /** @type {Todo[]} */
        return [...this.todos];
    }

    addTodo(title = '') {
        const todo = new Todo(++this.lastId, title);
        this.todos.unshift(todo);
        this.commit();
    }

    edit(id, title) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) throw new Error(`Todo with ${id} id not found.`);
        todo.rename(title);
        this.commit();
    }

    delete(id) {
        const todoIndex = this.todos.findIndex(t => t.id === id);
        if (id === -1) throw new Error(`Todo with ${id} id not found.`);
        this.todos.splice(todoIndex, 1);
        this.commit();
    }

    sort(direction) {
        if (direction) {
            this.todos.sort((a, b) => a.title > b.title ? 1 : -1);
        } else {
            this.todos.sort((a, b) => b.title > a.title ? 1 : -1);
        }
        this.commit();
    }

    commit() {
        localStorage.setItem(TODOS, JSON.stringify({ todos: this.todos, lastId: this.lastId }));
        this.eventEmitter.emit();
    }

    restore() {
        const { todos, lastId } = JSON.parse(localStorage.getItem(TODOS)) || { todos: [], lastId: 0 };
        this.todos = todos;
        this.lastId = lastId;
    }
}

document.addEventListener("dragstart", ({target}) => {
    dragged = target;
    id = target.id;
    list = target.parentNode.children;
    for(let i = 0; i < list.length; i += 1) {
        if(list[i] === dragged) {
            index = i;
        }
    }
});

document.addEventListener("dragover", (event) => {
    event.preventDefault();
});

document.addEventListener("drop", ({target}) => {
    if(target.className == "dropzone" && target.id !== id) {
        dragged.remove( dragged );
        for(let i = 0; i < list.length; i += 1) {
            if(list[i] === target){
                indexDrop = i;
            }
        }
        console.log(index, indexDrop);
        if(index > indexDrop) {
            target.before( dragged );
        } else {
            target.after( dragged );
        }
    }
});

const arrows = [1, 0];
class Application {
    /** @param {TodoService} todoService */
    constructor(todoService) {
        /** @type {TodoService} */
        this.todoService = todoService;
        
        this.todoService.eventEmitter.subscribe(e => this.render());
        
        this.todoList = document.querySelector('#todo-list');
        this.addBtn = document.querySelector('#add-btn');
        this.sortBtn = document.querySelector('#sort-btn');
        
        /** @type {Boolean} */
        this.sortFlag = false;

        this.addBtn.addEventListener('click', e => {
            this.addTodo();
        });

        this.sortBtn.addEventListener('click', e => {
            this.sortTodos();
        })

        const sort = document.body.querySelector('.sort');
        sort.dataset.value = +localStorage.getItem('todolist_sort');
    }

    render() {
        this.todoList.innerHTML = '';

        this.todoService.getAll().forEach((todo, index) => {
            const listItem = document.createElement('label');
            listItem.classList.add('dropzone');
            listItem.setAttribute('draggable', true);
            listItem.id = index;
            
            const imgMove = document.createElement('img');
            imgMove.classList.add('rows_move');
            imgMove.src = '/assets/images/menu-icon-3-lines.png';
            
            listItem.append(imgMove);

            const input = document.createElement('input');
            input.value = todo.title;
            input.addEventListener('change', e => {
                this.rename(todo.id, e.target.value);
            });

            listItem.append(input);

            const imgX = document.createElement('img');
            imgX.classList.add('xicon');
            imgX.style.width = '20px';
            imgX.style.height = '20px';
            imgX.src = '/assets/images/x_passiv.png';
            imgX.addEventListener('click', e => {
                this.delete(todo.id);
            });

            listItem.append(imgX);

            this.todoList.append(listItem);
        });
    }

    addTodo(title) {
        this.todoService.addTodo(title);
    }

    rename(id, title) {
        this.todoService.edit(id, title);
    }

    delete(id) {
        this.todoService.delete(id);
    }

    sortTodos() {
        this.todoService.sort(this.sortFlag);

        this.sortFlag = !this.sortFlag;

        this.sortBtn.dataset.value = Number(this.sortFlag);

        localStorage.setItem('todolist_sort', Number(this.sortFlag));
    }
}

const app = new Application(new TodoService());

app.render();

// Сверстать верстку нормально
// Добавить логику ограничения добавления новых задач если в списке уже есть пустой Таск.
// При удалении последнего элемента список не очищался совсем а имел дефолтный пустой Таск.

/*
var mousePosition;
var offset = [0,0];
var div;
var isDown = false;

// div = document.createElement("div");
// div.id = 'div';
// div.style.position = "absolute";
// div.style.left = "0px";
// div.style.top = "0px";
// div.style.width = "100px";
// div.style.height = "100px";
// div.style.background = "red";
// div.style.color = "blue";

//document.body.appendChild(div);

const mousedownFunction = function(event) {
    div = event.target;
        
    div.parentElement.classList.toggle("parent-moved");
    //console.log(div);
    //console.log(div.parentElement);
    isDown = true;
    offset = [
        div.offsetLeft - event.clientX,
        div.offsetTop - event.clientY,
    ];

    // var rect = event.target.getBoundingClientRect();
    // var x = event.clientX - rect.left;
    // var y = event.clientY - rect.top;
    // const position = document.body.querySelector('.position');
    // position.innerHTML = `${x}-${y}`;
}
//div.addEventListener('mousedown', mousedownFunction, true);

document.addEventListener('mouseup', function(event) {
    isDown = false;
    if (!div) return;
    div.parentElement.classList.toggle("parent-moved");
    div.left = 0;
    div.top = 0;
    // var elem = document.elementFromPoint(mousePosition.x - offset[0], mousePosition.y - offset[1]);
    // var elem = document.elementFromPoint(offset[0], offset[1]);

    var elem = document.elementFromPoint(mousePosition.x, mousePosition.y);
    elem.parentElement.style.top = 0
    elem.parentElement.style.left = 0
    div.parentElement.style.top = 0;
    div.parentElement.style.left = 0;

    //console.log(elem.tagName);
    const todos = document.body.querySelector('.todos');
    if (elem.tagName == 'LABEL') {
        todos.insertBefore(div.parentElement, elem.nextSibling);
        return;
    }
    //console.log(elem.parentElement);
    todos.insertBefore(div.parentElement, elem.parentElement.nextSibling);
    // let temp = div.parentElement;
    // div.parentElement = elem.parentElement;
    // elem.parentElement = temp;
    // if (elem && elem.tagName.toLowerCase() == "label" && elem.dataset.localid && elem.dataset.localid.length > 0) {
    //     elem.style.position = 'relative';
    //     console.log(elem);
    //     const dodos = document.body.querySelector('.todos');
    //     div.style.position = 'relative';
    //     dodos.insertBefore(div, elem);
    // }
    // const div = document.body.querySelector('#div');
    // var rect = div.getBoundingClientRect();
    // var x = event.clientX - rect.left;
    // var y = event.clientY - rect.top;
    // const position = document.body.querySelector('.position');
    // position.innerHTML = `${x}-${y}`;
}, true);

document.addEventListener('mousemove', function(event) {
    event.preventDefault();
    if (isDown) {
        mousePosition = {
            x : event.clientX,
            y : event.clientY,
        };
        if (!div) return;

        //div.parentElement.style.left = (mousePosition.x + offset[0]) + 'px';
        div.parentElement.style.top  = (mousePosition.y + offset[1]) + 'px';

        // var elem = document.elementFromPoint(mousePosition.x, mousePosition.y);
        // console.log(elem);
        // const div = document.body.querySelector('#div');
        // var rect = div.getBoundingClientRect();
        // var x = event.clientX - rect.left;
        // var y = event.clientY - rect.top;
        // const position = document.body.querySelector('.position');
        // position.innerHTML = `${x}-${y}`;

        const position = document.body.querySelector('.position');
        position.innerHTML = `${mousePosition.x}/${mousePosition.y}/${offset[0]}/${offset[1]}`;
    }
}, true);

const animated_div = document.getElementById('animated_div');
animated_div.addEventListener('click', function (event) {
    localStorage.clear();
});

const changed = function(event) {
    const element = event.target.parentElement;
    console.log(element);
    console.log(event.target);
    const data = localStorage.getItem(element.dataset.localid);
    data = JSON.parse(data);
    if (data) {
        data.value = event.target.value;
        localStorage.setItem(element.dataset.localid, data);
    }
}

const add = document.body.querySelector('.add');
add.addEventListener('click', function() {
    const todoFirst = document.body.querySelector('.todos label:first-child');
    if (todoFirst) {
        const input = todoFirst.querySelector('input');
        if (input.value.length === 0) {
            const isEmpty = document.body.querySelector('.is_empty');
            isEmpty.innerHTML = "Content is empty";
            todoFirst.focus();
        } else {
            let id = `tdl_${Date.now()}`;
            let data = { position: 1, value: input.value, addDateTime: formatDate(new Date()) };
            const json = JSON.stringify(data);
            localStorage.setItem(id, json);
            addData(json);
        }
    } else {
        let data = { position: 0, value: '', addDateTime: '' };
        addData(data, '');
    }
    // if (todoFirst.value.length === 0) {
    //     isEmpty.innerHTML = "Content is empty";
    //     todoFirst.focus();
    //     return;
    // } else {
    //     isEmpty.innerHTML = '';
    // }
    // let data = { value: todoFirst.value, addDateTime: formatDate(new Date()) };
    // const json = JSON.stringify(data);
    // let id = `tdl_${Date.now()}`;
    // localStorage.setItem(id, json);
    // addData(data, id);

    // todoFirst.value = Math.floor(Math.random() * 100000);
    //#region ver. 1
    // const todoFirst = document.body.querySelector('.todos .first input');
    // const isEmpty = document.body.querySelector('.is_empty');
    // if (todoFirst.value.length === 0) {
    //     isEmpty.innerHTML = "Content is empty";
    //     todoFirst.focus();
    //     return;
    // } else {
    //     isEmpty.innerHTML = '';
    // }
    // let data = { value: todoFirst.value, addDateTime: formatDate(new Date()) };
    // const json = JSON.stringify(data);
    // let id = `tdl_${Date.now()}`;
    // localStorage.setItem(id, json);
    // addData(data, id);

    // todoFirst.value = Math.floor(Math.random() * 100000);
    //#endregion
});

const addData = function(data) {
    const temp = template.replace('first', data.value);
    const todos = document.body.querySelector('.todos');
    const label = document.createElement('label');
    label.innerHTML = temp;
    if (data.localid)
        label.dataset.localid = data.localid;
    else {
        let id = `tdl_${Date.now()}`;
        label.dataset.localid =  id;
    }
    label.querySelector('.rows_move').addEventListener('mousedown', mousedownFunction, true);
    label.querySelector('span.datetime').innerHTML = data.addDateTime;
    label.querySelector('img.xicon').addEventListener('click', remove);
    label.querySelector('input').addEventListener('change', changed);
    todos.prepend(label);
}

function allStorage() {
    let values = [];
    let keys = Object.keys(localStorage);
    keys.forEach(item => {
        let da = localStorage.getItem(item);
        let data = { key: item, value: da };
        values.push(data);
    });
    return values;
}

// const first = document.body.querySelector('.first');
// const firstImg = first.querySelector('img.xicon');
// firstImg.addEventListener('click', function() {
//     const input = first.querySelector('input');
//     input.value = '';
// });

const remove = function (event) {
    const parent = event.target.parentElement;
    localStorage.removeItem(parent.dataset.localid);
    parent.remove();
};

const todos = document.body.querySelector('.todos');
todos.addEventListener('scroll', function (event) {
    const todoFirst = document.body.querySelector('.todos .first');
    if (event.target.scrollTop > 2) {
        todoFirst.style.position = 'absolute';
        //todoFirst.style.width = '70%'
        //event.target.paddingTop = '30px';
        //event.target.style.borderTopWidth = '20px';
    }
    else {
        todoFirst.style.position = 'relative';
        //todoFirst.style.width = '100%'
        //event.target.style.borderTopWidth = '1px';
    }
});

const labels = todos.querySelectorAll('label');
labels.forEach((item, index) => {
    if (index !== 0) {
        const img = item.querySelector('img.xicon');
        img.addEventListener('click', remove);
    }
});

const arrows = [1, 0];
const sort = document.body.querySelector('.sort');
sort.addEventListener('click', function(event) {
    sortTableByColumn(arrows[+event.target.dataset.value]);
    event.target.dataset.value = (+event.target.dataset.value === 0 ? 1 : 0);
    localStorage.setItem('todolist_sort', event.target.dataset.value);
});

function sortTableByColumn(upDown) {
    let items = document.body.querySelectorAll('.todos label');
    items = [...items].filter((item,index) => { return index > 0 });
    items.sort((a, b) => {
        if (upDown == arrows[1]) {
            //if (isNaN(+a.querySelector('input').value)) {
                if (a.querySelector('input').value > b.querySelector('input').value)
                    return -1;
                if (b.querySelector('input').value > a.querySelector('input').value)
                    return +1;
                return 0;
            // } else {
            //     return +a.querySelector('input').value - +b.querySelector('input').value;
            // }
        } else if (upDown == arrows[0]) {
            //if (isNaN(+a.querySelector('input').value)) {
                if (a.querySelector('input').value > b.querySelector('input').value)
                    return +1;
                if (b.querySelector('input').value > a.querySelector('input').value)
                    return -1;
                return 0;
            // } else {
            //     return +b.querySelector('input').value - +a.querySelector('input').value;
            // }
        }
    });
    const todo = document.body.querySelector('.todos');
    [...document.body.querySelectorAll('.todos label')].map((item, index) => {
        if (index > 0)
            item.remove();
    });
    items.forEach(item => {
        todo.appendChild(item)
    });
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}
*/