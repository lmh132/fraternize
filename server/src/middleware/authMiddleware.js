const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Organization = require('../models/organization');

function requireUserAuth(req, res, next){
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'ATTENDEE', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/users/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/users/login');
    }
}

function requireOrgAuth(req, res, next){
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'ORGANIZER', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/organizations/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/organizations/login');
    }
}

function checkUser(req, res, next){
    //console.log('getting user');
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'ATTENDEE', async(err, decodedToken) => {
            if(err){
                res.locals.user = null;
                next();
            }else{
                //console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}

function checkOrg(req, res, next){
    //console.log('getting org');
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'ORGANIZER', async(err, decodedToken) => {
            if(err){
                res.locals.org = null;
                res.locals._org = null;
                next();
            }else{
                //console.log(decodedToken);
                let temp = await Organization.findById(decodedToken.id);
                let org = await temp.populate({ path : 'events' });
                //console.log(org);
                res.locals.org = org;
                res.locals._org = JSON.stringify(temp);
                //console.log('org found');
                next();
            }
        });
    }else{
        res.locals.org = null;
        res.locals._org = null;
        next();
    }
}

module.exports = {
    requireUserAuth,
    requireOrgAuth,
    checkUser,
    checkOrg
}