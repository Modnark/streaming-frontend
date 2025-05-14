const express = require('express');
const router = express.Router();
const database = require('../database');
const db = database.db;
const auth = require('../session');
const { quickError } = require('../helpers');
const { randomString } = require('../helpers');
const apiPath = '/api/user/v1/resetkey';

// API
router.patch(apiPath, auth.authOnly, async (req, res, next) => {
    try {
        const newStreamKey = randomString();
        const userRes = await db.transaction(async(t) => {
            const user = await database.models.User.findOne({
                where: {
                    id: req.session.userId
                },
                transaction: t
            });

            if(user) {
                user.set({
                    streamKey: newStreamKey
                });

                user.save();
            }

            return user;
        });

        if(userRes) {
            
            return res.json({newKey: newStreamKey});
        }
        return res.status(400).json({error: {details: [{message: 'Unknown error'}]}});
    } catch(error) {
        next(error);
    }
});

router.all(apiPath, auth.noAuth, (req, res, next) => {
    return next(quickError('Method Not Allowed', 405));
});

module.exports = router;