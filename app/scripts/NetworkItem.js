/**
 * Created by Andrii_Shoferivskyi on 2018-04-27.
 */

import DraggbleItem from './DraggbleItem';

const modalSaveBtn = document.getElementById('modalSaveBtn');
const modalBody = document.getElementById('modalBody');
const linesContainer = document.getElementById('linesContainer');
const modalDeleteBtn = document.getElementById('modalDeleteBtn');

export default class NetworkItem extends DraggbleItem {

    constructor(container, icon, { view, additional, config, name, id, connectionType, deviceType }) {
        super(container, icon, view, name);

        this.deleted = false;
        this.id = id;
        this.name = name;
        this.connectionType = connectionType;
        this.additional = additional;
        this.config = config;
        this.deviceType = deviceType;

        this.element.addEventListener('click', (e) => { this.onClick(e); });
    }

    toJSON() {
        if (this.deleted) { return; }

        let jsonObj = Object.assign({}, this);
        delete jsonObj.container;
        delete jsonObj.element;
        delete jsonObj.icon;
        delete jsonObj.deleted;
        delete jsonObj.isNew;

        return jsonObj;
    }

    onClick(e) {
        if (e.ctrlKey) {
            if (!window.prevElement) {
                window.prevElement = this;
                return;
            }

            window.nextElement = this;

            let el1 = window.prevElement;
            let el2 = window.nextElement;

            if (el1.deviceType != el2.deviceType) {

                switch (el1.deviceType) {
                    case 'node':
                        if (el2.deviceType === 'router') {
                            el2.nodes.push(el1);
                            el2.drawLines('nodes', el2.id);
                        }
                        break;

                    case 'router':
                        if (el2.deviceType === 'node') {
                            el1.nodes.push(el2);
                            el1.drawLines('nodes', el1.id);
                        } else {
                            el2.routers.push(el1);
                            el2.drawLines('routers', el2.id);
                        }
                        break;

                    case 'gateway':
                        if (el2.deviceType === 'router') {
                            el1.routers.push(el2);
                            el1.drawLines('routers', el1.id);
                        }
                        break;
                }

            }

            delete window.prevElement;
            delete window.nextElement;

        } else {

            $('#modal').modal('show');
            modalBody.innerHTML = `
            <h3>Main</h3>
            <div id="mainContent">
                ${ this.createInput('id', this.id) }
                ${ this.createInput('name', this.name) }
                ${ this.createInput('connectionType', this.connectionType) }
                ${ this.createInput('deviceType', this.deviceType, true) }                
                ${ this.deviceType === 'node' ?
            this.createInput('dataType', this.dataType) +
            this.createInput('measureUnits', this.measureUnits) : '' }
            </div>
            
            <h3>Config</h3>
            <div id="configContent">
                ${ this.getConfigHtml() }
            </div>
            <div class="clearfix"><button id="addConfigBtn" type="button" class="btn btn-light" style="float:right;">+ Add</button></div>
            
            <h3>Additional</h3>
            <div id="additionalContent">
                ${ this.getAdditionalHtml() }
            </div>
        `;

            modalDeleteBtn.style.display = this.deviceType === 'gateway' ? 'none' : 'block';

            modalDeleteBtn.onclick = () => {
                this.element.remove();
                this.deleted = true;

                if (this.deviceType === 'router') {
                    this.drawLines('nodes', this.id);
                }
                $('#modal').modal('hide');

            };


            document.getElementById('addConfigBtn').addEventListener('click', () => {
                let configContent = document.getElementById('configContent');

                let input = document.createElement('div');
                input.innerHTML = this.createInput('', '', false, 'config');

                let el = input.children[0];
                el.querySelector('.delete-icon').addEventListener('click', () => {
                    el.remove();
                });

                configContent.appendChild(el)
            });

            let deleteIcons = modalBody.querySelectorAll('.delete-icon');

            deleteIcons.forEach((el) => {
                el.addEventListener('click', () => {
                    el.parentNode.parentNode.parentNode.remove();
                })
            });

            modalSaveBtn.onclick = this.onSaveClick.bind(this);
        }
    }

    //delete

    getConfigHtml() {
        let html = '';

        for (let i in this.config) {
            html += this.createInput(i, this.config[i], false, 'config');
        }

        return html;
    }

    getAdditionalHtml() {
        let html = '';

        for (let i in this.additional) {
            html += this.createInput(i, this.additional[i], true, 'additional');
        }

        return html;
    }

    getDataValue(name) {
        return modalBody.querySelector(`[data-name="${ name }"]`).value
    }

    getGroupValue(group) {
        let obj = {};

        modalBody.querySelectorAll(`[data-group="${ group }"]`)
                 .forEach(el => {
                     console.log(el);
                    let key = el.querySelector('.key-item').value;
                    if (key) {
                        obj[key] = el.querySelector('.value-item').value;
                    }

                 });

        return obj;
    }

    onSaveClick() {
        this.id = this.getDataValue('id');
        this.name = this.getDataValue('name');
        this.connectionType =this.getDataValue('connectionType');

        if (this.deviceType === 'node') {
            this.measureUnits = this.getDataValue('measureUnits');
            this.dataType = this.getDataValue('dataType');
        }

        this.config = this.getGroupValue('config');
        this.additional = this.getGroupValue('additional');
        $('#modal').modal('hide');

        console.log(this);

        this.element.querySelector('div').innerHTML = this.name;

    }

    createInput(name, value, disabled, groupName) {
        let isConfig = groupName === 'config';
        return `
            <div class="input-group" data-group="${ groupName }">
              <div class="input-group-prepend">
                <input class="form-control type-name key-item" type="text" value="${ name }" ${ !isConfig && 'hidden' }>
                <span class="input-group-text input-text-left" ${ isConfig && 'hidden' }>${ name }</span>
              </div>
              
                  <input type="text" data-name="${ name }" class="form-control value-item" value="${ value }" ${ disabled ? 'disabled' : '' }>
              ${ groupName === 'config' ? `<div class="input-group-append">
                <span class="input-group-text"><i class="fa fa-trash-alt delete-icon"></i></span>
              </div>` : '' }
            </div>
        `;
    }

    drawLines(name, context) {
        let view = this.view;
        let container = linesContainer.querySelector(`[data-line="${ context }"`);

        if (!container) {
            container = document.createElement('div');
            container.setAttribute('data-line', context);
            linesContainer.appendChild(container);
        }

        container.innerHTML = '';

        if (this.deleted) { return; }

        this[name].forEach(router => {
            $(container).line(view.x, view.y, router.view.x, router.view.y, { color:"#000", stroke: 1, zindex: 1 });
        });
    }

}

