const express = require('express');
const router = express.Router();
const superVisor = require('../models/supervisor');

router.get('/:email/:name/:pass', (req, res) => {

    superVisor.addSupervisor(req.params)
        .then(user => {
            res.json(user)
        })
        .catch(err => res.json(err));

});

router.get('/:email/:pass', (req, res) => {
    superVisor.loginSupervisor(req.params)
        .then(hash => {
            req.session.userId = hash._id;
            res.json(hash);
        })
        .catch(err => res.json(err))
});

router.get('/profile', [requiresLogin,allSession], function (req, res) {
    if (res.locals.valid) {
        res.json({ user: "sessions" })
    } else {
        res.json({ status: false })
    }
})

router.get('/destroy', (req, res) => {
    req.session.destroy(err => {
        if (err) res.json({ status: "not destroyed" })
        else res.json({ status: "destroyed" })
    })
})


function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        res.locals.valid = true
        return next();
    } else {
        res.locals.valid = false
        return next();
    }
}

module.exports = router;