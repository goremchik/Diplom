/**
 * Created by Andrii_Shoferivskyi on 2018-04-03.
 */

import './styles/index.less';
import Gateway from './scripts/Gateway';

let url = 'http://localhost:3000/gateway';
let container = document.getElementById('dragContainer');
let saveBtn = document.getElementById('saveBtn');

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
