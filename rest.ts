import express from 'express';

const dict = require('./dictionary_engine');

let admin = express.Router();
admin.get('/', adminRootHandler);

function adminRootHandler(req, res){
    res.send('HELLO ADMIN ROOT');
}
admin.use('/dict', dict);
module.exports = admin;
