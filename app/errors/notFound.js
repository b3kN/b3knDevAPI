'use strict';
const BaseError = require(Errors + 'base');

class NotFoundError extends BaseError {
    constructor(message) {
        super(message, 404);
    }
}

module.exports = NotFoundError;