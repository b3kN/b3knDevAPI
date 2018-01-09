'use strict';
const BaseError = require(Errors + 'base');

class ValidationError extends BaseError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = ValidationError;