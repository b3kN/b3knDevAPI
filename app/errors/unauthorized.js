'use strict';
const BaseError = require(Errors + 'base');

class UnauthorizedError extends BaseError {
    constructor(message) {
        super(message, 401);
    }
}

module.exports = UnauthorizedError;