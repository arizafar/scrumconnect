const mongoose = require('mongoose');

require('../db');

let userSchema = mongoose.Schema({
    name:{ type: String },
    sex:{ type: String },
    age: { type: String },
    country:{ type: String },
    dateCreated:{ type: Date }
});

module.exports = mongoose.model('userdata', userSchema, 'userdata');
