import express from 'express';

const cors = require('cors');
const dict = require('./dictionary_engine');
const auth = require('./authtorization');
const entity = require('./entity_engine');

let rest = express.Router();
rest.get('/', adminRootHandler);

function adminRootHandler(req, res){
    res.send('HELLO');
}


rest.use('/dict', cors(), dict);
rest.use('/auth', cors(), auth);
rest.use('/', cors(), entity);
module.exports = rest;
