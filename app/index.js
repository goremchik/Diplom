/**
 * Created by Andrii_Shoferivskyi on 2018-04-03.
 */

import './styles/index.less';
import Gateway from './scripts/Gateway';
import Router from './scripts/Router';
import Node from './scripts/Node';

let url = 'http://localhost:3000/gateway';
let container = document.getElementById('dragContainer');
let saveBtn = document.getElementById('saveBtn');

const contextMenu = document.getElementById('contextMenu');

let gateway = null;
fetch(url).then(data => data.json())
          .then(data => new Gateway(container, data))
          .then(el => { gateway = el; });

saveBtn.addEventListener('click', () => {

    fetch(url, {
        body: JSON.stringify(gateway),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
    })
    .then(response => { location.reload() });
});


document.addEventListener("contextmenu", e => {
    e.preventDefault();
    // console.log(e)
    let x = e.pageX, y = e.pageY;

    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.style.display = 'block';
});

document.addEventListener("click", e => {
    contextMenu.style.display = 'none';
});

document.getElementById('addRouterBtn').addEventListener("click", e => {
    let x = e.screenX, y = e.screenY;
    new Router(container, {
        view: { x, y },
        additional: {},
        config: {},
        name: '',
        id: '',
        connectionType: '',
        deviceType: 'router',
        nodes: [],
        isNew: true
    });
    //contextMenu.style.display = 'none';
});

document.getElementById('addNodeBtn').addEventListener("click", e => {
    let x = e.screenX, y = e.screenY;
    new Node(container, {
        view: { x, y },
        additional: {},
        config: {},
        name: '',
        id: '',
        connectionType: '',
        deviceType: 'node',
        isNew: true
    });
    //contextMenu.style.display = 'none';
});


