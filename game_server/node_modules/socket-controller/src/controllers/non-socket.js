import BaseController from './base';

class NonSocketController extends BaseController {
    send(controller, attrName, args) {
        this.registry.action('socket', 'send')(contName, attrName, args);
    }

    fetch(controller, attrName, args) {
        this.registry.action('socket', 'fetch')(contName, attrName, args);
    }

    broadcast(controller, attrName, args) {
        this.registry.action('socket', 'broadcast')(contName, attrName, args);
    }
}

export default NonSocketController;