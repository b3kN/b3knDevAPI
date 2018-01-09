const LocalAuthStrategy = require('passport-local').Strategy;
const UserModel         = require(Models + 'user').UserModel;
const UnauthorizedError = require(Errors + 'unauthorized');
const NotFoundError     = require(Errors + 'notFound');

class CredentialsAuthStrategy extends LocalAuthStrategy {
    constructor() {
        super(CredentialsAuthStrategy.provideOptions(), CredentialsAuthStrategy.handleUserAuth);
    }

    get name() {
        return 'credentials-auth';
    }

    static handleUserAuth(email, password, done) {
        UserModel.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(new NotFoundError("Email not found"), false);
            }
            if (!user.checkPassword(password)) {
                return done(new UnauthorizedError("Invalid credentials"), false);
            }
            return done(null, user);
        });
    }

    static provideOptions() {
        return {
            usernameField: 'email',
            passReqToCallback: false,
            passwordField: 'password',
            session: false
        };
    }

    getSecretKey() {
        throw new Error("No key is required for this type of auth");
    }
}
exports = module.exports = CredentialsAuthStrategy;