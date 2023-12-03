const { Router } = require('express');
const { create, view, creatorView, signUp } = require('../controllers/eventController');
const { requireOrgAuth, requireUserAuth } = require('../middleware/authMiddleware');
const router = new Router()

router.get('/create', requireOrgAuth, (req, res) => {
    res.render('events/create')
});

router.post('/create', (req, res) => {
    create(req, res);
});

router.get('/viewall', (req, res) => {
    res.render('events/viewall');
});

router.get('/view/:eventId', (req, res) => {
    view(req, res);
});

router.post('/view/:eventId', requireUserAuth, (req, res) => {
    signUp(req, res);
});

router.get('/creatorview/:eventId', (req, res) => {
    creatorView(req, res);
});

module.exports = router;