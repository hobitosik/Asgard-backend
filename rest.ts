import express from 'express';

const dict = require('./dictionary_engine');
const auth = require('./authtorization');
const entity = require('./entity_engine');

let rest = express.Router();
rest.get('/', adminRootHandler);

function adminRootHandler(req, res){
    res.send('HELLO');
}


rest.use('/dict', dict);
rest.use('/auth', auth);
rest.use('/', entity);
module.exports = rest;
