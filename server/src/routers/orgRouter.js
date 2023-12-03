const { Router } = require('express');
const { create, view, login, logout } = require('../controllers/orgController');
const Organization = require('../models/organization');
const router = new Router()

router.get('/create', (req, res) => {
    res.render('organizations/create')
});

router.post('/create', (req, res) => {
    create(req, res);
});

router.get('/login', (req, res) => {
    res.render('organizations/login')
});

router.post('/login', (req, res) => {
    login(req, res);
});

router.get('/viewall', async(req, res) => {
    let orgs = await Organization.find();
    res.render('organizations/viewall', { orgs : orgs });
});

router.get('/view/:orgId', (req, res) => {
    view(req, res);
});

router.get('/logout', (req, res) => {
    logout(req,res);
});

module.exports = router;