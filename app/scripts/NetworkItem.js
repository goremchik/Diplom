/**
 * Created by Andrii_Shoferivskyi on 2018-04-27.
 */

import DraggbleItem from './DraggbleItem';

const modalSaveBtn = document.getElementById('modalSaveBtn');
const modalBody = document.getElementById('modalBody');

export default class NetworkItem extends DraggbleItem {

    constructor(container, icon, { view, additional, config, name, id }) {
        super(container, icon, view, name);

        this.id = id;
        this.name = name;
        this.additional = additional;
        this.config = config;

        this.element.addEventListener('click', () => { this.onClick(); });
        modalSaveBtn.addEventListener('click', () => { this.onSaveClick(); });
    }

    toJSON() {
        let jsonObj = Object.assign({}, this);
        delete jsonObj.container;
        delete jsonObj.element;
        delete jsonObj.icon;

        return jsonObj;
    }


    onClick() {

        $('#modal').modal('show');
        modalBody.innerHTML = `
            <h4>Main</h4>
            <div id="mainContent">
                ${ this.createInput('id', this.id, true) }
                ${ this.createInput('name', this.name) }
            </div>
            
            <h4>Config</h4>
            <div id="configContent">
                
            </div>

            <h4>Additional</h4>
            <div id="additionalContent">
            
            </div>
        `;
    }

    onSaveClick() {


        $('#modal').modal('hide');
    }

    createInput(name, value, disabled, localName) {
        return `
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">${ name }</span>
              </div>
              <input id="${ name + localName && '' }" type="text" data-name="${ localName }" class="form-control" value="${ value }" ${ disabled ? 'disabled' : '' }>
            </div>
        `;
    }
}