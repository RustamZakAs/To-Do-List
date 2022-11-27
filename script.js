const template = `
    <img class="rows_move" src="/assets/images/menu-icon-3-lines.png" />
    <input type="text" value="first"/>
    <img class="xicon" src="/assets/images/x_passiv.png" width="20px" height="20px" />
    <span class="datetime" hidden>datetime</span>
`;

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
    div.left = 0;
    div.top = 0;
    // var elem = document.elementFromPoint(mousePosition.x - offset[0], mousePosition.y - offset[1]);
    // var elem = document.elementFromPoint(offset[0], offset[1]);
    const todos = document.body.querySelector('.todos');

    var elem = document.elementFromPoint(mousePosition.x, mousePosition.y);
    elem.parentElement.style.top = 0
    elem.parentElement.style.left = 0
    div.parentElement.style.top = 0;
    div.parentElement.style.left = 0;

    console.log(elem.tagName);
    if (elem.tagName == 'LABEL') {
        todos.insertBefore(div.parentElement, elem.nextSibling);
        return;
    }
    console.log(elem.parentElement);
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
        div.parentElement.style.left = (mousePosition.x + offset[0]) + 'px';
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

const add = document.body.querySelector('.add');
add.addEventListener('click', function() {
    const todoFirst = document.body.querySelector('.todos .first input');
    const isEmpty = document.body.querySelector('.is_empty');
    if (todoFirst.value.length === 0) {
        isEmpty.innerHTML = "Content is empty";
        todoFirst.focus();
        return;
    } else {
        isEmpty.innerHTML = '';
    }
    let data = { value: todoFirst.value, addDateTime: formatDate(new Date()) };
    const json = JSON.stringify(data);
    let id = `tdl_${Date.now()}`;
    localStorage.setItem(id, json);
    addData(data, id);

    todoFirst.value = Math.floor(Math.random() * 100000);
});

const addData = function(data, localid) {
    const temp = template.replace('first', data.value);
    const todos = document.body.querySelector('.todos');
    const label = document.createElement('label');
    label.innerHTML = temp;
    label.dataset.localid = localid;
    label.querySelector('.rows_move').addEventListener('mousedown', mousedownFunction, true);
    label.querySelector('span.datetime').innerHTML = data.addDateTime;
    label.querySelector('img.xicon').addEventListener('click', remove);
    todos.appendChild(label);
}

window.addEventListener('load', function () {
    const sort = document.body.querySelector('.sort');
    sort.dataset.value = +this.localStorage.getItem('todolist_sort');
    let localData = allStorage();
    localData = localData.filter(item => { return item.key.includes('tdl') } );
    localData.forEach(item => {
        const obj = JSON.parse(item.value);
        addData(obj, item.key);
    });
});

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

const first = document.body.querySelector('.first');
const firstImg = first.querySelector('img.xicon');
firstImg.addEventListener('click', function() {
    const input = first.querySelector('input');
    input.value = '';
});

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

const arrows = [1,0];
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