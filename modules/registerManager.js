'use strict';

const User = require('../models/userdata.model');

let manager = {};

manager.registerUser = function(data) {
  let userData = new User();
  let {name, sex, age, country} = data;
  userData.name = name;
  userData.sex = sex;
  userData.age = age;
  userData.country =  country;
  userData.dateCreated = new Date();
  return userData.save().then(() => {
    return userData;
  })
}

module.exports = manager;
