/**
 * Created by Andrii_Shoferivskyi on 2018-04-26.
 */

import NetworkItem from './NetworkItem';
import Router from './Router';
import icon from '../img/gateway.png';

export default class Gateway extends NetworkItem {

    constructor(container, obj) {
        super(container, icon, obj);

        this.routers = obj.routers.map(el => new Router(container, el));
    }

}