const RevokedToken          = require(Models + 'auth/revoked').RevokedTokenModel;
const NotFoundError         = require(Errors + 'payload');
const AutoBoundClass        = require(Base + 'autobind');
let crypto                  = require('crypto');
const SHA_HASH_LENGTH       = 64;
const ForbiddenError        = require(Errors + 'forbidden');

class AuthHandler extends AutoBoundClass {
    constructor() {
        super();
        this._jwtTokenHandler   = require('jsonwebtoken');
        this._authManager       = require(Managers + 'auth');
    }

    issueNewToken(req, user, callback) {
        let that = this;
        if (user) {
            let userToken = that._authManager.signToken("jwt-rs-auth", that._provideTokenPayload(user), that._provideTokenOptions());
            callback.onSuccess(userToken);
        }
        else {
            callback.onError(new NotFoundError("User not found"));
        }
    }

    revokeToken(req,token, callback) {
        let that = this;
        req.checkParams('token', 'Invalid token id provided').notEmpty().isAlphanumeric().isLength(SHA_HASH_LENGTH);
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ForbiddenError('Invalid token id :' + errorMessages.join(' && '));
                }
                let tokenHashedId = req.params.token;
                if (that.checkIfHashedTokenMatches(token, tokenHashedId)) {
                    return new RevokedToken({token: token});
                }
                else {
                    throw new ForbiddenError('Invalid credentials');
                }
            })
            .then((token) => {
                token.save();
                return token;
            })
            .then((token) => {
                callback.onSuccess("Token has been successfully revoked");
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    _hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    checkIfHashedTokenMatches(token, hashed) {
        let hashedValid = this._hashToken(token);
        return hashedValid === hashed;
    }


    _provideTokenPayload(user) {
        return {
            id: user.id,
            handle: user.handle,
            role: user.role,
            scope: 'default'
        };
    }

    _provideTokenOptions() {
        let config = require(global.Config);
        return {
            expiresIn: "30 minutes",
            audience: config.jwtOptions.audience,
            issuer: config.jwtOptions.issuer,
            algorithm: config.jwtOptions.algorithm
        };
    }


}

module.exports = AuthHandler;