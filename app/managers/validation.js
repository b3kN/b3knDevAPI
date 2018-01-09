const AutoBoundClass    = require(Base + 'autobind');
const expressValidator  = require('express-validator');

class ValidationManager extends AutoBoundClass {
    constructor() {
        super();
    }

        provideDefaultValidator() {
        return expressValidator({
            errorFormatter: ValidationManager.errorFormatter
        })
    }

    static errorFormatter(param, msg, value) {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}
module.exports = ValidationManager;