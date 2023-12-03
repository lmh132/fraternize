const { Router } = require('express');
const { userView, orgView } = require('../controllers/mainController')
const cookieParser = require('cookie-parser')
const router = new Router()

router.use(cookieParser());

router.get('/', (req, res) => {
    if(res.locals.user){
        userView(req, res);
    }else if(res.locals.org){
        orgView(req, res);
    }else{
        res.render('home');
    }
});

router.get('/login', (req, res) => {
    res.render('loginRedirect')
});

router.get('/signup', (req, res) => {
    res.render('signupRedirect')
});
module.exports = router;