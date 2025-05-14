const express = require('express');
const router = express.Router();
const { quickError } = require('../helpers');
const auth = require('../session');

const path = '/api/auth/v1/logout';

router.delete(path, auth.authOnly, async (req, res) => {
    req.session.destroy();
    return res.status(200).end();
});

router.all(path, auth.authOnly, async (req, res, next) => {
    return next(quickError('Method Not Allowed', 405));
});


module.exports = router;