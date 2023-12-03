const Organization = require('../models/organization');
const Event = require('../models/event');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const maxAge = 24*60*60
function createToken(id){
    return jwt.sign({ id }, 'ORGANIZER', { expiresIn : maxAge});
}

function handleErrors(err){
    console.log(err.message, err.code);
    let errors = { name : '', affiliation : '' };

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
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

async function create(req, res){
    const { name, affiliation, email, password } = req.body;
    try{
        const org = await Organization.create({ 'name' : name, 
                                            'affiliation' : affiliation,
                                            'email' : email,
                                            'password' : password,
                                            'events' : []});
        const token = createToken(org._id);
        res.cookie('jwt', token, { httpOnly : true, maxAge : maxAge*1000 });
        res.status(201).json({ org : org._id });
    }catch(err){
        console.log(err.message);
        res.status(400).send("Error, org not created");
    }
}

async function login(req, res){
    const { email, password } = req.body;
    try{
        const org = await Organization.login(email, password);
        const token = createToken(org._id);
        res.cookie('jwt', token, { httpOnly : true, maxAge : maxAge*1000 });
        res.status(201).json({ org : org._id });
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

function decode(str){
    if(str){
        return str.replace("%20", " ");
    }else{
        return null;
    }
}

async function view(req, res){
    let id = req.params.orgId;
    let temp = await Organization.findById(id);
    let selected = await temp.populate({ path : 'events' });
    res.render('organizations/viewone', { selected : selected });
}

function logout(req, res){
    res.cookie('jwt', '', { maxAge : 1 });
    res.redirect('/');
}

module.exports = {
    create,
    view,
    login,
    logout
}