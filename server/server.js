const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());

dotenv.config({path: './config.env'});
const PORT = process.env.PORT;

app.use(express.json());

//linking router files
app.use(require('./router/auth'));

//connection to database
require('./db/conn');

//users collection model
const User = require('./model/userSchema');

//concept of middleware
// const middleware = (req, res, next) => {
//     console.log("hello middleware !");
//     next();
// }

app.get('/', (req, res) => {
    res.send("hello from server !");
});

// app.get('/about', middleware, (req, res) => {
//     console.log("hello about !")
//     res.send("hello from about page !");
// })

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})