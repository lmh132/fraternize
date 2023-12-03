//imports
const express = require('express');
const cookieParser = require('cookie-parser');
const { checkUser, checkOrg } = require('./middleware/authMiddleware');
const mainRouter = require('./routers/mainRouter');
const orgRouter = require('./routers/orgRouter');
const eventRouter = require('./routers/eventRouter');
const userRouter = require('./routers/userRouter');
const { connectToDB, getDB } = require('./db');

//variables
const app = express();
let db;
const port = process.env.port || 3000;

//view engine
app.set("view engine", "ejs");
app.set("views", "src/views");

//middleware
app.use(express.json());
app.use(cookieParser());
app.get('*', checkUser);
app.get('*', checkOrg);
app.use('/', mainRouter);
app.use('/organizations', orgRouter);
app.use('/events', eventRouter);
app.use('/users', userRouter);

//app.listen(port, () => {console.log(`Server started on ${port}`)});

connectToDB((err) => {
    if(!err){
        app.listen(port, () => {console.log(`Server started on ${port}`)});
        db = getDB();
    }
});