import {BasicEmitter} from 'basic-emitter';

class MockSocket extends BasicEmitter {
    constructor(...args) {
        super(...args);
        setTimeout(()=>{this.fire('open')});
    }

    on(eventName, callback) {
        this.addEventListener(eventName, callback);
    }

    send(msg) {}
}

export default MockSocket;