/**
 * Created by Andrii_Shoferivskyi on 2018-04-26.
 */

import NetworkItem from './NetworkItem';
import Node from './Node';
import icon from '../img/router.png';

export default class Router extends NetworkItem {

    constructor(container, obj) {
        super(container, icon, obj);

        this.nodes = obj.nodes.filter(el => el).map(el => new Node(container, el));

        this.drawLines('nodes', this.id);
        this.element.addEventListener('dragend', this.drawLines.bind(this, 'nodes', this.id));

        this.nodes.forEach(node => {
            node.element.addEventListener('dragend', this.drawLines.bind(this, 'nodes', this.id));
        });
    }

}