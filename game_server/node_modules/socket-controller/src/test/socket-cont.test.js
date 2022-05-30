import MockSocket from './mock-socket';
import ServerSocketController from '../controllers/sockets/server';
import NonSocketController from '../controllers/non-socket';

class TestController extends NonSocketController {
    testFunc(args) {
        return 'Foo'
    }
}

const initControllers = {
    test: TestController
}

test('basic send', (done) => {
    const mockSocket = new MockSocket();
    const socketController = new ServerSocketController({}, mockSocket);

    mockSocket.send = (msg) => {
        let {contName, attrName, args} = JSON.parse(msg);
        if( contName == 'test' && attrName == 'testFunc' && args == 'Hello World') 
        {
            done();
        } else {
            console.error('Did not receive proper args in socket send');
        }
    }
    
    socketController.send('test', 'testFunc', 'Hello World');
})

test('basic receive', (done) => {
    const mockSocketReceiver = new MockSocket();
    const receiverController = new ServerSocketController(initControllers, mockSocketReceiver);

    const mockSocketSender = new MockSocket();
    const senderController = new ServerSocketController({}, mockSocketSender);

    mockSocketSender.send = (msg) => {
        receiverController.onMessage(msg);
    }

    // mockSocketReceiver.send = (msg) => {
    //     senderController.onMessage(msg);
    // }

    let testReceiveCont = receiverController.registry.getController('test');
    testReceiveCont.testFunc = (args) => {
        if(args == 'Hello World') {
            done()
        } else {
            console.error('received wrong args');
        }
    }

    senderController.send('test', 'testFunc', 'Hello World');
});

test('basic fetch response', (done) => {
    const mockSocketReceiver = new MockSocket();
    const receiverController = new ServerSocketController(initControllers, mockSocketReceiver);

    const mockSocketSender = new MockSocket();
    const senderController = new ServerSocketController({}, mockSocketSender);

    mockSocketReceiver.send = (msg) => {
        senderController.onMessage(msg);
    }

    mockSocketSender.send = (msg) => {
        receiverController.onMessage(msg);
    }

    senderController.fetch('test', 'testFunc', 'Hello World')
    .then((response) => {
        if(response == 'Foo') {
            done();
        } else {
            console.error('received wrong args');
        }
    });
})