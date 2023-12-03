const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
let dbConnection;


const connectToDB = (cb) => {
    mongoose.connect(process.env.MONGODB_URI).then(
        () => {
            console.log("Connected to Database successfully");
            return cb();
        }
    ).catch(
        (err) => {
            console.log(err);
            return cb(err);
        }
    )
}
const getDB = () => dbConnection;

module.exports = {
    connectToDB,
    getDB
}