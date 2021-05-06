import express = require('express');
import bodyParser = require('body-parser');
const auth = require('./authtorization')
const jsonparser = bodyParser.json();
import fs from "fs";
import multer from 'multer';

import { entityRepo } from './entity_repo';
import {pool} from './sql';
const entities = entityRepo;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname.split('.');
        const newName = originalname[0] + '_' + Date.now() + '.' + originalname[1];
        cb(null, newName);
    }
});

const fileFilter = (req, file, cb) => file && file.mimetype === 'image/jpeg' ? cb(null, true) : cb(null, false);

const upload = multer({ storage: storage, fileFilter });

const entity = express.Router();
entity.get('/', function(req, res){
    res.set('Content-Type', 'text/html'); 
    res.write('Эндпоинт для сущностей доступны следующие: <br>');
    Object.keys(entities).forEach( key => res.write(key + '<br>') );

    res.write('<p> Формат запроса GET /entity/{key} </p> <br>');
    res.write('<p> ex: GET ent/ent_services </p> <br>');
    res.end();

});

function concatFn(arrA, arrB){
    console.log('A:', arrA, 'B:', arrB);
    if( arrA && arrA.length && arrB && arrB.length ){
        let fine = [];
        for(let i = 0; i < arrA.length; i++){
            fine.push(`${arrA[i]} = ${arrB[i]}`);
        }
        return fine;
    }
    return [];
}

function concatLikeFn(arrA, arrB){
    console.log('A:', arrA, 'B:', arrB);
    if( arrA && arrA.length && arrB && arrB.length ){
        let fine = [];
        for(let i = 0; i < arrA.length; i++){
            fine.push(`${arrA[i]} LIKE "%${arrB[i]}%"`);
        }
        return fine;
    }
    return [];
}

function createEntity(req, res, next){
    console.log('createEntity body:', req.body);
    if( req.body ){
        //проверка наличия сущности в системе
        if( !!entities[req.params.id] && !!entities[req.params.id].db_name ){
            const db = entities[req.params.id].db_name;
            const reqKeys = entities[req.params.id].fields.filter(f => !!f.required);
            const fields = entities[req.params.id].fields;
            const data = req.body;

            if( !reqKeys.every(r => !!data[r.key]) ) {
                res.end('не полные данные в запросе');
                console.log('не полные данные в запросе');
                return;
            }

            if( !Object.keys(data).every(r => !!fields.find(f => f.key === r ))) {
                res.end('в запросе присутствут неизвестные поля');
                console.log('в запросе присутствут неизвестные поля');
                return;
            }

            let valArr = Object.keys(data).map(datakey => {
                const targetReq = fields.find(r => r.key === datakey);
                if(!targetReq) return `"${data[datakey]}"`;
                return targetReq.type === 'string' || targetReq.type === 'text' ? `"${data[datakey]}"` : data[datakey];
            });

            let existArr = concatFn( Object.keys(data), valArr );
            //console.log('existArr: ', existArr);

            const q = `INSERT INTO \`${ db }\` (\`${ Object.keys(data).join('\`, \`') }\`) VALUES ( ${ valArr.join(',') } )`;
            const qi = existArr.join(', ');
            const qf = q + ' ON DUPLICATE KEY UPDATE ' + qi;
            console.log('qf: ', qf);


            pool.query(qf, (err, result)=> {
                if(err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                res.send(JSON.stringify({
                    result,
                    data
                }));
                next();
            });

        } else {
            res.end('не удалось определить сущность');
            console.log('не удалось определить сущность');
        }
    }
}

function deleteEntity(req, res, next){
    console.log('delete middle', req.body);
    if( req.body ){
        //проверка наличия сущности в системе
        if( !!entities[req.params.id] && !!entities[req.params.id].db_name ){
            const db = entities[req.params.id].db_name;
            const id = (req.params?.eid && +req.params?.eid) || req?.body?.id;

            const qd = `DELETE FROM \`${ db }\` WHERE \'id\' = ${id}`;
            console.log('delete q: ', qd);

            if(!!id){
                pool.query(qd, (err, result)=> {
                    if(err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }
                    res.send(JSON.stringify({
                        result,
                        text:`Запись с id = ${id} удалена`
                    }));

                    next();

                });
            } else {
                res.status(500);
                res.send(JSON.stringify({
                    error: 'Не передан ID удаляемой сущности',
                }));
            }
            console.log('delete q: ', qd);



        } else {
            res.end('не удалось определить сущность');
        }
    }
}

async function queryEntity( req, res, next ){
    const token = auth.getToken(req);
    const uid = await auth.getUserIdByToken(token)
    if(!uid) {
        res.status(401);
        res.send([]);
        return
    }
    console.log('ent repo config: ', entities, ' url params: ', req.params);
    if( !!entities[req.params.id] && !!entities[req.params.id].db_name ){
        const db = entities[req.params.id].db_name;
        const fields = entities[req.params.id].fields;
        const fk = entities[req.params.id].fk;
        const eid = req.params.eid;

        let limit = !!req.query.skip && Number(req.query.skip)  || '20';

        // проработать логику поиска типа поля запроса

        let searchParamsKeys = Object.keys(req.query).filter(k =>
            !( k === 'skip' || k === 'limit' ) &&
            ( fields.some(f => f.key === k) && fields.find(f => f.key === k).type === 'id' )
        );

        let searchParamsValue = searchParamsKeys.map( k => req.query[k] );

        let conSearchParams = concatFn( searchParamsKeys, searchParamsValue );

        let searchStringKeys = Object.keys(req.query).filter(k =>
            !( k === 'skip' || k === 'limit' ) &&
            ( fields.some(f => f.key === k) && fields.find(f => f.key === k).type === 'string' )
        );

        let searchStringValue = searchStringKeys.map(k => `${req.query[k]}` );
        let conSearchStrings = concatLikeFn( searchStringKeys, searchStringValue );

        console.log('ent q:', req.query, 'ids:', searchParamsKeys, searchParamsValue, 'str:', searchStringKeys, searchStringValue);

        // если спросили что то лишнее хотя с новой логикой сюда не попадуть те запросы которых нет в репозитории доступных
        if( !Object.keys(req.query).every(r => !!( r === 'skip' || r === 'limit' ) || !!fields.find(f => f.key === r ))) {
            res.status(500);
            res.end('в запросе поиска присутствуют неизвестные поля');
            console.warn('в запросе поиска присутствуют неизвестные поля');
            return;
        }

        let likeStr = conSearchStrings.length && conSearchStrings.join(' AND ');
        let whereStr = conSearchParams.length && conSearchParams.join(' AND ');

        let limstr = `${ !!req.query.skip ? ' LIMIT ' + limit + ' OFFSET ' + req.query.skip  :'' }`;

        let q: string;

        //link fk for parent table
        if( fk ){
            //searching keys
            let s_str = fk.restrictors.map(r => fk.db + '.' + r.key).join(', ');
            //restrictor statements
            let r_str = fk.restrictors.map(r => fk.db + '.' + r.key + ' LIKE "' + r.value + '"').join(', ');
            //target fields db
            let t_str = fk.target.map(t => fk.db + '.' + t).join(', ');


            q = `SELECT 
                ${db}.*, 
                ${fk.db}.id as _id, 
                ${s_str}, 
                ${t_str} 
                FROM ${db} 
                INNER JOIN ${fk.db} 
                ON ${db}.${fk.key} = ${fk.db}.id 
                WHERE ${r_str} 
                ${ eid ? `AND ${db}.id = ${eid}` : ``} 
                ${whereStr ? 'AND ' + whereStr : ''} 
                ${likeStr ? ' AND ' + likeStr : ''} 
                ${limstr}`;
        } else
            q = `SELECT 
                * 
                FROM \`${ db }\` 
                ${ eid ? `WHERE id = ${ eid }` : ``}
                ${(whereStr && !eid) ? 'WHERE ' + whereStr : ''} 
                ${likeStr ? ( whereStr ? ' AND ' : ' WHERE ') + likeStr : ''} 
                ${limstr}`;

        console.log('q:', q);

        pool.query(q, (err, result)=> {
            if(!!err) {
                res.status(500);
                res.send(JSON.stringify(err));
            } else{
                res.send(result);
            }

        });
    } else {
        res.send([]);
        console.log('сущность не определена');
    }
}

function checkUploadsFS(req, res, next) {
    if(!fs.existsSync('uploads')){
        console.log('folder upload not exist, creating...');
        fs.mkdirSync('uploads');
    } else {
        console.log('folder upload exist');
    }
    
    console.log('FS:', ...fs.readdirSync('./'));

    next();
}

function uploadFile( req, res, next ) {
    if(
        (req.file && req.file.mimetype === 'image/jpeg') ||
        (req.file && req.file.mimetype === 'image/jpg')
    ){

        let fields = ['filename', 'folder', 'type'];
        let values = [`"${req.file.filename}"`, `"uploads"`, `"${req.file.mimetype}"`];

        let meta = req.body && JSON.parse(req.body.meta);

        let {title = 'Без названия', description = 'Без описания'} = meta;
        console.log('meta:', meta);

        let q = `INSERT INTO \`${ 'files' }\` (\`${ fields.join('\`, \`') }\`) VALUES ( ${ values.join(',') } )`;

        console.log('save file in db: ', q);
        pool.query(q, (error , result) => {
            if(error) {
                res.status(500);
                res.send(error);
                return;
            }
            if(result && result.insertId){
                let qi = `INSERT INTO \`${ 'images' }\` ( \`file_id\`, \`title\`, \`description\`) VALUES ( ${result.insertId}, "${title}", "${description}" )`;
                console.log('qi:', qi);
                pool.query(qi, (err, _result) => {
                    if(err) {
                        res.status(500);
                        res.send(err);
                        return;
                    }

                    res.status(201);
                    res.send({status: 'Файл загружен успешно, id: ' + result.insertId, file: {id: _result.insertId}});
                });
            }
        });


    } else {
        console.error('error: ', 'Ошибка типа файла. Поддерживаются только: jpeg', 'file: ', req.file);
        res.status(500);
        res.send({error: 'Ошибка типа файла. Поддерживаются только: jpeg'});
    }
}

function downloadFile( req, res, next ){
    const id = req.params.id;

    //SELECT `images`.*, files.id as fid, files.filename FROM `images`, files WHERE images.id = 2 AND files.id = images.file_id
    //SELECT `images`.*, files.id as fid, files.filename, files.type FROM `images` INNER JOIN files ON images.file_id = files.id WHERE files.type LIKE "%image%" AND images.id = 2

    if(!id) {
        res.status(500);
        res.send({error: 'не передан ID файла'});
    }

    let q = `SELECT * FROM \`files\` WHERE \`id\` = ${id}`;
    console.log('dl file: ', id, 'q: ', q);


    pool.query(q, function (error, result) {
        if(error){
            res.status(500);
            res.end({error});
        }

        res.send(result);
    });

}

entity.get('/:id', queryEntity);
entity.get('/file/:id', downloadFile);
entity.get('/:id/:eid', queryEntity);
entity.post('/file', checkUploadsFS, upload.single('photo'), uploadFile);
entity.delete('/:id/:eid', jsonparser, deleteEntity);
entity.post('/:id', jsonparser, createEntity, function(req, res){
    res.end('post done');
});

module.exports = entity;
