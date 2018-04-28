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

        this.element.addEventListener('click', () => { this.onClick(); });
    }

    toJSON() {
        if (this.deleted) {
            return;

        }

        let jsonObj = Object.assign({}, this);
        delete jsonObj.container;
        delete jsonObj.element;
        delete jsonObj.icon;
        delete jsonObj.deleted;

        return jsonObj;
    }


    onClick() {

        $('#modal').modal('show');
        modalBody.innerHTML = `
            <h4>Main</h4>
            <div id="mainContent">
                ${ this.createInput('id', this.id) }
                ${ this.createInput('name', this.name) }
                ${ this.createInput('connectionType', this.connectionType) }
                ${ this.createInput('deviceType', this.deviceType, true) }
            </div>
            
            <h4>Config</h4>
            <div id="configContent">
                ${ this.getConfigHtml() }
            </div>
            <div class="clearfix"><button id="addConfigBtn" type="button" class="btn btn-light" style="float:right;">+ Add</button></div>
            
            <h4>Additional</h4>
            <div id="additionalContent">
                ${ this.getAdditionalHtml() }
            </div>
        `;

        modalDeleteBtn.style.display = this.deviceType === 'gateway' ? 'none' : 'block';

        modalDeleteBtn.onclick = () => {
            this.element.remove();
            this.deleted = true;
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

        this.config = this.getGroupValue('config');
        this.additional = this.getGroupValue('additional');
        $('#modal').modal('hide');
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
        this[name].forEach(router => {
            $(container).line(view.x, view.y, router.view.x, router.view.y, { color:"#000", stroke: 2, zindex: 1 });
        });
    }

}

