require('dotenv').config();
const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = require('./auth/routes');
const mongoString = process.env.DATABASE_URL;
const authorization = require('./auth/auth');
var http = require('http');


const option = {
    socketTimeoutMS: 30000
}
mongoose.connect(mongoString, option);
const database = mongoose.connection;

database.on('error',(error)=>{
    console.log(error);
})
database.once('connected', ()=>{
    console.log('Database Connected');
})

const app = express();
let corsOption = {
    origin: '*'
};
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static('uploads'));
app.use(authorization);
app.use((req, res, next)=>{
    if(req.url == '/api/auth/login' || req.url.includes('/api/auth/') || req.url.includes('/api/customer/'))
    {
      next();
    }
    else
    {
      if (req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization, 'hotel-secret-key', function(err, decode) {
          if (err) req.user = undefined;
          req.user = decode;
          next();
        });
      } else {
        req.user = undefined;
        res.status(401).json({ message: 'Authentication failed. Invalid Token.' });
      }
    }
});
http.createServer(app).listen(3000, () => {
    console.log(`Server Started at ${3000}`)
    app.use('/api', router)
})