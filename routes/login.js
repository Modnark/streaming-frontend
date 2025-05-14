const express = require('express');
const router = express.Router();
const loginValidator = require('../validators/login');
const pwHasher = require('../password');
const database = require('../database');
const db = database.db;
const auth = require('../session');
const { quickError } = require('../helpers');
const apiPath = '/api/auth/v1/login';

// Frontend
router.get('/login', auth.noAuth, async (req, res) => {
    res.render('login', {title: 'Login'});
});

// API
router.post(apiPath, auth.noAuth, async (req, res, next) => {
    const reqBody = req.body;
    const testResult = loginValidator.test(reqBody);
    if(testResult.error !== undefined)
        return res.status(400).json({error: testResult.error});

    try {
        const userRes = await db.transaction(async(t) => {
            const user = await database.models.User.findOne({
                where: {
                    username: reqBody.username
                },
                transaction: t
            });

            return user;
        });

        if(userRes) {
            const doesPasswordMatch = await pwHasher.testPassword(reqBody.password, userRes.password);
            if(doesPasswordMatch === true) {
                auth.startNewSession(req, userRes);
                return res.status(200).end();
            }
        }

        return res.status(400).json({error: {details: [{message: 'Invalid username or password.'}]}});
    } catch(error) {
        next(error);
    }
});

router.all(apiPath, auth.noAuth, (req, res, next) => {
    return next(quickError('Method Not Allowed', 405));
});

module.exports = router;