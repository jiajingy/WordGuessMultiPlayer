import NonSocketController from '../controllers/non-socket';

class TestController extends NonSocketController {
    testFunc(arg1) {
        return 'Foo ' + arg1
    }
}

export default TestController;