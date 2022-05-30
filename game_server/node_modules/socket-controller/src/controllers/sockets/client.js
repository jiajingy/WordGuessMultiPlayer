import BaseSocketController from './base';

class ClientSocketcontroller extends BaseSocketController {
    constructor(initControllers={}, url) {
        super(initControllers);

        if(url) { this.url = url;}
    }

    async initURL() {
        let url = this.url ? this.url : window.location.origin + '/ws';
        this.url = url;
    }

    async initSocket() {
        this.socket = new WebSocket(this.url);
    }
}

export default ClientSocketController;