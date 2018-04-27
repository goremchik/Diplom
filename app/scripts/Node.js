/**
 * Created by Andrii_Shoferivskyi on 2018-04-26.
 */

import NetworkItem from './NetworkItem';
import icon from '../img/node.png';

export default class Node extends NetworkItem {

    constructor(container, obj) {
        super(container, icon, obj);

        this.dataType = obj.dataType;
        this.measureUnits = obj.measureUnits;
    }

}
