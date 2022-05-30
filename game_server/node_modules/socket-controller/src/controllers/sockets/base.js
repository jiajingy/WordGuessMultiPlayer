import ControllerBase from '../base';
import ControllerRegistry from '../../registry';

class BaseSocketController extends ControllerBase {
    constructor(initControllers={}) {
        let registry = new ControllerRegistry(initControllers);
        super(registry);
        this.registry.addController('socket', this);

        this._connection = new Promise(resolve => this._connectionResolve = resolve);
        this._responses = {};    // {msgId: {msgPromise, resolveFunc, rejectFunc}}
        this.startSocket();
    }

    async initSocket() {
        console.error('initSocket is not implemented. initSocket must assign the value this.socket');
    }

    async startSocket() {
        await this.initSocket();
        
        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('close', this.onClose.bind(this));
        this.socket.on('error', this.onError.bind(this));
        this.socket.on('open', this.onOpen.bind(this));
    }

    send(contName, attrName, args) {
        this._sendMsgType('send', contName, attrName, args);
    }

    fetch(contName, attrName, args) {
        return this._sendMsgType('fetch', contName, attrName, args);
    }

    genUniqueId() {
        return Math.random();
    }

    async _sendMsgType(msgType, contName, attrName, args, msgId) {
        await this._connection;
        msgId = typeof(msgId) != 'undefined' ? msgId : this.genUniqueId();
        let payload = {contName, attrName, args, msgType, msgId};

        let msgPromise;
        if(msgType == 'fetch') {
            let resolveFunc;
            let rejectFunc;
            msgPromise = new Promise((resolve, reject) => {
                resolveFunc = resolve;
                rejectFunc = reject;
            });
            this._responses[msgId] = {msgPromise, resolveFunc, rejectFunc};
        }
        this.socket.send(JSON.stringify(payload));

        return msgPromise;
    }

    onOpen() {
        this._connectionResolve();
    }

    onClose() {}

    _sendResponse(msgId, result) {
        let msgType = 'response';
        let payload = {msgType, msgId, result};
        this.socket.send(JSON.stringify(payload));
    }

    async onMessage(msg) {
        // TODO: Explicity list the available functions for security reasons.
        let {msgType, contName, attrName, args, msgId, result} = JSON.parse(msg);
        if (msgType == 'response') {
            this._responses[msgId].resolveFunc(result);
        } else {
            let result = await this.registry.action(contName, attrName)(args);
            if (msgType == 'fetch') {
                this._sendResponse(msgId, result);
            }
        }
    }

    onError(err) {
        console.error(err);
    }
}

export default BaseSocketController;