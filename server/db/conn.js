const mongoose = require('mongoose');

const DB = process.env.ATLAS_URI;

mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connection successful");
}).catch(() => { console.log("connection failed !")});
