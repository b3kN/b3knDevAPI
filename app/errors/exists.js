'use strict';
const BaseError = require(Errors + 'base');

class ExistsError extends BaseError {
    constructor(message) {
        super(message, 409);
    }
}

module.exports = ExistsError;