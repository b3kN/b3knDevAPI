let mongoose    = require('mongoose');
let Schema      = mongoose.Schema;

let RevokedScheme = new Schema({
    token: String,
    date: {type: Date, default: Date.now}
});

module.exports.RevokedModel = mongoose.model('Revoked', RevokedScheme);