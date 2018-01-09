const ResponseManager       = require(Managers + 'response'),
    AutoBoundClass     = require(Base + 'autobind');

class BaseController extends AutoBoundClass {
    constructor() {
        super();
        if (new.target === BaseController) {
            throw new TypeError("Cannot construct BaseController instances directly");
        }
        this._responseManager = ResponseManager;
    }

    getAll(req, res) {

    }

    get(req, res) {

    }

    create(req, res) {

    }

    update(req, res) {

    }

    remove(req, res) {

    }

    authenticate(req, res, callback) {

    }
}
module.exports = BaseController;