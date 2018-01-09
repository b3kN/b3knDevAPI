const BaseController = require(Controllers + 'base'),
    UserHandler      = require(Handlers + 'user'),
    util             = require("util");

class UserController extends BaseController {
    constructor() {
        super();
        this._userHandler = new UserHandler();
        this._passport = require('passport');
    }

    get(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._userHandler.getUserInfo(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }

    create(req, res) {
        let responseManager = this._responseManager;
        this.authenticate(req, res, () => {
            this._userHandler.createNewUser(req, responseManager.getDefaultResponseHandler(res));
        });
    }

    authenticate(req, res, callback) {
        console.log('UserController.authenticate init');
        let responseManager = this._responseManager;
        this._passport.authenticate('secret-key-auth', {
            onVerified: callback,
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res);
    }

}

module.exports = UserController;