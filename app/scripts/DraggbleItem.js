/**
 * Created by Andrii_Shoferivskyi on 2018-04-26.
 */

export default class DraggbleItem {

    constructor(container, icon, view, name, newDate) {
        this.container = container;
        this.icon = icon;
        this.view = view;

        this.element = this.createElement(name, newDate);
        this.setElementPosition(view.x, view.y);

        this.element.addEventListener('dragend', this.dragEnd.bind(this));
    }

    dragEnd(e) {
        let el = e.target;
        this.setElementPosition(e.clientX, e.clientY);
    }

    setElementPosition(x, y) {
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.view.x = x;
        this.view.y = y;
    }

    createElement(name, newDate) {
        let el = document.createElement('div');

        el.className = 'draggable';
        el.setAttribute('draggable', 'true');

        if (this.icon) {
            let img = document.createElement('img');
            img.src = this.icon;
            img.className = 'item-img';
            el.appendChild(img);
        }

        let div = document.createElement('div');
        div.style.textAlign = 'center';
        div.innerText = name;
        div.style.background = new Date() > newDate ? '#ff5353' : '#fff';
        el.appendChild(div);

        this.container.appendChild(el);
        return el;
    }
}