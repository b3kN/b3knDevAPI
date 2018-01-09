'use strict';
const BaseError = require(Errors + 'base');

class NotImplemented extends BaseError {
    constructor(message) {
        super(message, 501);
    }
}

module.exports = NotImplemented;