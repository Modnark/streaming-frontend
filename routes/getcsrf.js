const express = require('express');
const router = express.Router();
const { generateToken } = require('../csrf');
const { quickError } = require('../helpers');

const path = '/api/auth/v1/getcsrf';

router.get(path, async (req, res) => {
    return res.json({token: generateToken(req, res, true)});
});

router.all(path, async (req, res, next) => {
    return next(quickError('Method Not Allowed', 405));
});

module.exports = router;