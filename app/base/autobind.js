const autoBind = require('auto-bind');

class AutoBoundClass {
    constructor() {
        autoBind(this);
    }
}
module.exports = AutoBoundClass;