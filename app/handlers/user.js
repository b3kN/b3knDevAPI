const UserModel             = require(Models + 'user').UserModel;
const AlreadyExistsError    = require(Errors + 'exists');
const ValidationError       = require(Errors + 'validation');
const UnauthorizedError     = require(Errors + 'unauthorized');

class UserHandler {
    constructor() {
        this._validator = require('validator');
    }

    static get userScheme() {
        return {
            'handle': {
              notEmpty: true,
              isLenth: {
                options: [{min: 2, max: 20}],
                errorMessage: 'Handle must be between 2 and 12 chars long'
              },
              errorMessage: 'Invalid Handle'
            },
            'name': {
              'first': {
                notEmpty: true,
                isLength: {
                    options: [{min: 2, max: 15}],
                    errorMessage: 'First name must be between 2 and 15 chars long'
                },
                errorMessage: 'Invalid First Name'
              },
              'last': {
                notEmpty: true,
                isLength: {
                    options: [{min: 2, max: 15}],
                    errorMessage: 'Last name must be between 2 and 15 chars long'
                },
                errorMessage: 'Invalid Last Name'
              }
            },
            'email': {
                isEmail: {
                    errorMessage: 'Invalid Email'
                },
                errorMessage: "Invalid email provided"
            },
            'password': {
                notEmpty: true,
                isLength: {
                    options: [{min: 6, max: 35}],
                    errorMessage: 'Password must be between 6 and 35 chars long'
                },
                errorMessage: 'Invalid Password Format'
            },
            'role': {
                notEmpty: true,
                errorMessage: 'Invalid Role Format'
            }

        };
    }

    getUserInfo(req, userToken, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                let userId = req.params.id;
                if (userToken.id !== userId) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id");
                }
                else {
                    return new Promise(function (resolve, reject) {
                        UserModel.findById(userId, function (err, user) {
                            if (user === null) {
                                throw new NotFoundError('User could not be found in the database');
                            } else {
                                resolve(user);
                            }
                        });
                    });
                }

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    createNewUser(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(UserHandler.USER_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new UserModel({
                    handle: validator.trim(data.handle),
                    name: {
                      first: validator.trim(data.name.first),
                      last: validator.trim(data.name.last)
                    },
                    email: validator.trim(data.email),
                    password: validator.trim(data.password),
                    role: validator.trim(data.role)
                });
            })
            .then((user) => {
                return new Promise(function (resolve, reject) {
                    UserModel.find({email: user.email}, function (err, docs) {
                        if (docs.length) {
                            reject(new AlreadyExistsError("User already exists"));
                        } else {
                            resolve(user);
                        }
                    });
                });
            })
            .then((user) => {
                user.save();
                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}

module.exports = UserHandler;