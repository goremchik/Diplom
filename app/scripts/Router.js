/**
 * Created by Andrii_Shoferivskyi on 2018-04-26.
 */

import NetworkItem from './NetworkItem';
import Node from './Node';
import icon from '../img/router.png';

export default class Router extends NetworkItem {

    constructor(container, obj) {
        super(container, icon, obj);

        this.nodes = obj.nodes.map(el => new Node(container, el));
    }

}