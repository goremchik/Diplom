/**
 * Created by Andrii_Shoferivskyi on 2018-04-03.
 */

import './styles/index.less';
import Gateway from './scripts/Gateway';

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
    .then(response => response);
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

