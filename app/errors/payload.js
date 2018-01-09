'use strict';
const BaseError = require(Errors + 'base');

class PayloadError extends BaseError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = PayloadError;