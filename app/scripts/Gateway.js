/**
 * Created by Andrii_Shoferivskyi on 2018-04-26.
 */

import NetworkItem from './NetworkItem';
import Router from './Router';
import icon from '../img/gateway.png';

export default class Gateway extends NetworkItem {

    constructor(container, obj) {
        console.log(obj);
        super(container, icon, obj);



        this.routers = obj.routers.filter(el => el).map(el => new Router(container, el));

        this.drawLines('routers', this.id);
        this.element.addEventListener('dragend', this.drawLines.bind(this, 'routers', this.id));

        this.routers.forEach(router => {
            router.element.addEventListener('dragend', this.drawLines.bind(this, 'routers', this.id));
        })
    }

}