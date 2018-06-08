import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import db from './conf/db';
import student from './spMapping/studentSP';
import grade from './spMapping/gradeSP';


const app = express();
const pool = mysql.createPool(db.mysql);
const [PORT = 3000, HOST = `localhost`] = [process.env.PORT, process.env.CUSTOMVAR_HOSTNAME];


app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/*', function (req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

app.use('/', express.static(__dirname + '/views'));
// app.disable("etag");

// show index
app.route('/')
    .get((req, res) => {
        res.render('index');
    });

// API /searchGrade: Search everyone's grade in this course.
app.get('/searchGrade', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query(grade.search, [ req.query.stuName ], (err, result) => {
            res.send(result[0]);
            connection.release();
        });
    });
});

// API /studentList: Get all student
app.get('/studentList', (req, res) => {
    pool.getConnection((err, connection) => {
        connection.query(student.select, (err, result) => {
            res.send(result[0]);
            connection.release();
        });
    });
});

app.use((req, res, next) => {
    res.status(404).send('404!');
    next();
});


app.listen(PORT, () => console.log(`app started at http://${HOST}:${PORT}`));