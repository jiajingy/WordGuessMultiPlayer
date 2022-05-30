class ControllerRegistry {
    constructor(initControllers={}) {
        this._controllers = {};
        this.addControllers(initControllers);
    }

    getController(contName) {
        return this._controllers[contName];
    }

    action(contName, attrName) {
        let controller = this.getController(contName);
        return controller[attrName];
    }

    addController(contName, contCls) {
        if(typeof(contCls) === 'function') {
            let contInstance = new contCls(this);
            this._controllers[contName] = contInstance;
        } else {
            this._controllers[contName] = contCls;
        }
    }

    addControllers(contDict) {
        Object.entries(contDict).forEach(([contName, contCls]) => this.addController(contName, contCls))
    }
}

export default ControllerRegistry;