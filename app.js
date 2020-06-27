const express = require('express');
const { reset } = require('nodemon');
const mongoose = require('mongoose');
require('dotenv').config();
// 

const userRoutes = require('./routes/user')

const app = express();

//db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log("database connected"))

app.use('/api', userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('server is running on ', port);
})