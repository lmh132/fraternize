const { Router } = require('express');
const cookieParser = require('cookie-parser')
const { signup, login, logout } = require('../controllers/userController')
const router = new Router()

router.use(cookieParser());

router.get('/signup', (req, res) => {
    res.render('users/signup')
});

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/signup', (req, res) => {
    signup(req, res);
});

router.post('/login', (req, res) => {
    login(req, res);
});

router.get('/logout', (req, res) => {
    logout(req,res);
})

module.exports = router;