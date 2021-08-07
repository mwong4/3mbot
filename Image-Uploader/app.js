/*
Author: Iamwaxy
Date Created: Aug 7, 2021
Purpose: Main file for 3mbot image uploader

Follow Tutorials: Traversy Media (https://www.youtube.com/watch?v=3f5Q9wDePzY)

npm run dev
*/

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


const app = express();

//Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

//Mongo URI
const mongoURI = 'mongodb+srv://Iamwaxy:U8wNC6KnqHnpgbev@3mbotc1.hnp3c.mongodb.net/3mbotDB?retryWrites=true&w=majority'; //Potential problem

//create mongodb connection
const conn = mongoose.createConnection(mongoURI);

//Init gfs
let gfs;

conn.once('open', () => {
    //Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

//Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

// @route GET /
// @desc Loads from
app.get('/', (req, res) => {
    res.render('index');
});

// @route POST /upload
// @desc Uploads file to DB
app.post('/upload', upload.single('file '), (req, res) => {
    res.json({ file: req.file });
});

const port = 5000;

app.listen(port, () => console.log(`Serevr started on port ${port}`));