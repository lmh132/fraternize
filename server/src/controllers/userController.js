const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const maxAge = 24*60*60
function createToken(id){
    return jwt.sign({ id }, 'ATTENDEE', { expiresIn : maxAge});
}

function handleErrors(err){
    console.log(err.message, err.code);
    let errors = { email : '', password : '' };

    if(err.message === "incorrect email"){
        errors.email = "An account associated with that email does not exist";
    }

    if(err.message === "incorrect password"){
        errors.password = "The password you entered is incorrect";
    }

    if(err.code === 11000){
        errors.email = "Email is already associated with an account"
        return errors
    }

    if(err.message.includes('User validation failed')){
        //console.log(err.message);
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

async function signup(req, res){
    try{
        const user = await User.create(req.body);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly : true, maxAge : maxAge*1000 });
        res.status(201).json({ user : user._id });
    }catch (err){
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }
}

async function login(req, res){
    const { email, password } = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly : true, maxAge : maxAge*1000 });
        res.status(201).json({ user : user._id });
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

function logout(req, res){
    res.cookie('jwt', '', { maxAge : 1 });
    res.redirect('/');
}

module.exports = {
    signup,
    login,
    logout
}