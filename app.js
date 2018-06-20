'use strict';
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fse = require('fs-extra');
const path = require('path');

const config = require('./config');
const userManager = require('./modules/registerManager');

const app = express();
const server = http.createServer(app);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine' , 'ejs');
app.use(express.static('./js'));

app.get('/', (req, res) => {
  return fse.readJson('./resources/countries.json').then((data) => {
    return res.render('index.ejs', {data});
  });
});

app.post('/register', (req, res) => {
  let userData = req.body;
  let errors = validate(userData);
  if(errors.length != 0) {
    return res.render('error.ejs', {errors});
  }
  return userManager.registerUser(userData).then((data) => {
    return res.render('success.ejs', {data});
  })
});

server.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port} in ${app.get('env')} mode`);
});


app.get('*', function(req, res, next) {
  let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
    res.render('error.ejs', {errors: []});
});

function validate(data) {
  let errors = [];
  if(!data.name || data.name == '') {
    errors.push('Name is mandatory.');
  }
  if(data.age =='' || !data.age.match(/^[0-9]*$/gm)) {
    errors.push('Age must be a number.');
  }
  if(!data.sex) {
    errors.push('Please select the sex.');
  }
  return errors;
}
