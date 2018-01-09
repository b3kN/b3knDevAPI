const AutoBoundClass    = require(Base + 'autobind');
const JwtRsStrategy     = require(AuthStrategy + 'jwtrs');
const SecretKeyAuth     = require(AuthStrategy + 'secret');
const CredentialsAuth   = require(AuthStrategy + 'credentials');
const ExtractJwt        = require("passport-jwt").ExtractJwt;
const JwtToken          = require(Models + 'auth/token');
const RevokedToken      = require(Models + 'auth/revoked').RevokedModel;
const ForbiddenError    = require(Errors + 'forbidden');
const Config            = require(global.Config);

class AuthManager extends AutoBoundClass {
    constructor() {
        super();
        this._passport = require('passport');
        this._strategies = [];
        this._jwtTokenHandler = require('jsonwebtoken');
        this._setupStrategies();
        this._setPassportStrategies();
    }

    _setupStrategies() {
        // Init JWT strategy
        let jwtOptions = this._provideJwtOptions();
        let secretKeyAuth = new SecretKeyAuth({secretKey: this._provideSecretKey()});
        let jwtRs = new JwtRsStrategy(jwtOptions, this._verifyRevokedToken);
        this._strategies.push(jwtRs);
        this._strategies.push(new CredentialsAuth());
        this._strategies.push(secretKeyAuth);
    }

    _verifyRevokedToken(token, payload, callback) {
        RevokedToken.find({token: token}, function (err, docs) {
            if (docs.length) {
                callback.onFailure(new ForbiddenError("Token has been revoked"));
            } else {
                callback.onVerified(token, payload);
            }
        });
    }

    extractJwtToken(req) {
        return ExtractJwt.fromAuthHeader()(req);
    }

    _provideJwtOptions() {
        let jwtOptions = {};
        jwtOptions.extractJwtToken = ExtractJwt.fromAuthHeader();
        jwtOptions.privateKey = this._provideJwtPrivateKey();
        jwtOptions.publicKey = this._provideJwtPublicKey();
        jwtOptions.issuer = Config.jwtOptions.issuer;
        jwtOptions.audience = Config.jwtOptions.audience;
        return jwtOptions;
    }

    _provideJwtPublicKey() {
        const fs = require('fs');
        return fs.readFileSync(global.Config + 'secrets/jwt-key.pub', 'utf8');
    }

    _provideJwtPrivateKey() {
        const fs = require('fs');
        return fs.readFileSync(global.Config + 'secrets/jwt-key.pem', 'utf8');
    }

    _provideSecretKey() {
        const fs = require('fs');
        return fs.readFileSync(global.Config + 'secrets/secret.key', 'utf8');
    }

    providePassport() {
        return this._passport;
    }

    getSecretKeyForStrategy(name) {
        for (let i = 0; i < this._strategies.length; i++) {
            let strategy = this._strategies[i];
            if (strategy && strategy.name === name) {
                return strategy.provideSecretKey();
            }
        }
    }

    _setPassportStrategies() {
        let passport = this._passport;
        this._strategies.forEach(function (strategy) {
            passport.use(strategy);
        });
    }

    signToken(strategyName, payload, options) {
        let key = this.getSecretKeyForStrategy(strategyName);
        switch (strategyName) {
            case 'jwt-rs-auth':
                return new JwtToken(
                    this._jwtTokenHandler.sign(payload,
                        key,
                        options)
                );
            default:
                throw new TypeError("Cannot sign toke for the " + strategyName + " strategy");
        }
    }
}
exports = module.exports = new AuthManager();