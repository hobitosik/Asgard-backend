import express from 'express';

const dict = require('./dictionary_engine');
const auth = require('./authtorization');

let rest = express.Router();
rest.get('/', adminRootHandler);

function adminRootHandler(req, res){
    res.send('HELLO ADMIN ROOT');
}
rest.use('/dict', dict);
rest.use('/auth', auth);

module.exports = rest;
