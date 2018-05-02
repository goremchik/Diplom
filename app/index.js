/**
 * Created by Andrii_Shoferivskyi on 2018-04-03.
 */

import './styles/index.less';
import Gateway from './scripts/Gateway';
import Router from './scripts/Router';
import Node from './scripts/Node';

const url = 'http://localhost:3000/config';
const realData = 'http://localhost:3000/real';
const container = document.getElementById('dragContainer');
const realContainer = document.getElementById('realContainer');
const saveBtn = document.getElementById('saveBtn');
const linesContainer = document.getElementById('linesContainer');
const contextMenu = document.getElementById('contextMenu');
const modalCompareBody = document.getElementById('modalCompareBody');

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


document.getElementById('compareBtn').addEventListener("click", () => {
    fetch(realData).then((data) => data.json())
        .then(({ gateway }) => gateway)
        .then( gatewayData => {
            realContainer.innerHTML = '';
            let realGateway = new Gateway(realContainer, gatewayData, true);
            compareItems(gateway, realGateway, true);
        });
});

function compareItems(item1, item2, isGlobal) {
    if (isGlobal) {
        modalCompareBody.innerHTML = '';
        $('#modalCompare').modal('show');
    }
    for (let i in item1) {

        switch(i) {
            case 'name':
            case 'view':
            case 'container':
            case 'element':
            case 'icon':
            case 'deleted':
            case 'isNew':
            case 'additional':
                break;
            case 'config':
            case 'visibleDevices':
                for (let j in item1[i]) {
                    if (item1[i][j] !== item2[i][j]) {
                        showDiffObjects(`Device id: ${item1.id}; Key: ${i + ' ' + j}; Current value: ${item1[i][i]}; Real value: ${item2[i]}`);
                    }
                }
                break;
            case 'nodes':
            case 'routers':
                item1[i].forEach((el, index) => {
                    compareItems(item1[i][index], item2[i][index], false);
                });
                break;
            default:
                console.log(i, item1[i], item2[i]);
                if (item1[i] !== item2[i]) {
                    showDiffObjects(`Device id: ${item1.id}; Key: ${i}; Current value: ${item1[i]}; Real value: ${item2[i]}`);
                }
                break;
        }
    }
}

function showDiffObjects(str) {
    let p = document.createElement('p');
    p.innerText = str;
    modalCompareBody.appendChild(p);
}