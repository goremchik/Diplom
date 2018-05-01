/**
 * Created by Andrii_Shoferivskyi on 2018-04-03.
 */

import './styles/index.less';
import Gateway from './scripts/Gateway';
import Router from './scripts/Router';
import Node from './scripts/Node';

const url = 'http://localhost:3000/config';
const container = document.getElementById('dragContainer');
const saveBtn = document.getElementById('saveBtn');
const linesContainer = document.getElementById('linesContainer');
const contextMenu = document.getElementById('contextMenu');

let gateway = null;
fetch(url).then((data) => data.json())
          .then(({ gateway }) => new Gateway(container, gateway))
          .then(el => { gateway = el; });

saveBtn.addEventListener('click', () => {
    fetch(url, {
        body: JSON.stringify({ gateway }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
    })
    .then(response => { location.reload() });
});

document.addEventListener("contextmenu", e => {
    e.preventDefault();
    let x = e.pageX, y = e.pageY;

    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.style.display = 'block';
});

document.addEventListener("click", () => {
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
});

document.getElementById('exportBtn').addEventListener("click", () => {

    let textFileAsBlob = new Blob([JSON.stringify({ gateway })], {type:'text/plain'});
    let fileNameToSaveAs = 'Iot_Network';
    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";

    if (!window.webkitURL) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {

        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
});

document.getElementById('importInput').addEventListener("change", ({ target }) => {
    let file = target.files[0];

    if (!FileReader) { return; }
    if (!file.type.match('text.*')) { return; }

    let reader = new FileReader();

    reader.onload = function({ target }) {
        let fileText = target.result;
        let obj = JSON.parse(fileText);

        if (obj) {
            container.innerHTML = '';
            linesContainer.innerHTML = '';
            gateway = new Gateway(container, obj);
        }
    };

    reader.readAsText(file);
});
