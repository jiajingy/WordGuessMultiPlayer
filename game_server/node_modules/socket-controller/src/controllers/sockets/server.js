import BaseSocketController from './base';

class ServerSocketController extends BaseSocketController {
    constructor(initControllers={}, socket) {
        super(initControllers);

        this.socket = socket;
    }

    async initSocket() {
        // Do nothing since we have already initialized socket;
    }
}

export default ServerSocketController;