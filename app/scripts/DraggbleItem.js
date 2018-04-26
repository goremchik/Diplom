/**
 * Created by Andrii_Shoferivskyi on 2018-04-26.
 */

export default class DraggbleItem {

    constructor(el) {
        this.element = el;

        el.addEventListener('dragstart', this.dragStart.bind(this));
        el.addEventListener('dragend', this.dragEnd.bind(this));
        el.addEventListener('dragover', this.move.bind(this));
    }

    callbackOnDragEnd() {}

    dragStart(e) { }

    dragEnd(e) {
        let el = e.target;
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
        this.callbackOnDragEnd();
    }

    move(e) { }

}