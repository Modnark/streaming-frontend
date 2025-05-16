const express = require('express');
const router = express.Router();
const registerValidator = require('../validators/register');
const pwHasher = require('../password');
const database = require('../database');
const db = database.db;
const Sequelize = require('sequelize');
const { randomString } = require('../helpers');
const auth = require('../session');
const { quickError } = require('../helpers');
const apiPath = '/api/auth/v1/register';

// Frontend
router.get('/register', auth.noAuth, async (req, res) => {
    res.send('no');
    //res.render('register', {title: 'Register'});
});

// API
router.post(apiPath, auth.noAuth, async(req, res, next) => {
    const reqBody = req.body;
    const testResult = registerValidator.test(reqBody);
    if(testResult.error !== undefined)
        return res.status(400).json({error: testResult.error});

    try {
        const hashedPassword = await pwHasher.hashPassword(reqBody.password);

        const userRes = await db.transaction(async (t) => {
            const user = await database.models.User.create({
                username: req.body.username,
                password: hashedPassword,
                streamKey: randomString(),
                publicStreamKey: randomString()
            });
            return user;
        });

        if(userRes) {
            await auth.startNewSession(req, userRes);
            return res.status(200).end();
        }

    } catch(error) {
        if(error instanceof Sequelize.UniqueConstraintError)
            return res.status(400).json({error: {details: [{message: 'Username is in use.'}]}});
        else {
            error.status = 500;
            next(error); // let the primary handler take care of it
        }
    }
});

router.all(apiPath, auth.noAuth, (req, res, next) => {
    return next(quickError('Method Not Allowed', 405));
});

module.exports = router;