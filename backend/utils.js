const mongoose = require('mongoose');

const MONGO_URL = `mongodb://mongo:${process.env.MONGODB_PORT || 27017}/${process.env.MONGODB_DATABASE || 'admin'}`;

const mongoOptions = {
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connectDb = () => mongoose.connect(MONGO_URL, mongoOptions);

module.exports = { connectDb };