const express = require('express');
const router = express.Router();
const auth = require('../session');
const helpers = require('../helpers');
const database = require('../database');
const db = database.db;

router.get('/settings', auth.authOnly, async (req, res, next) => {
    const userRes = await db.transaction(async(t) => {
        const user = database.models.User.findOne({
            where: {
                id: req.session.userId
            },
            transaction: t
        });

        return user;
    });

    if(userRes) {
        return res.render('settings', {title: 'Settings', streamKey: userRes.streamKey});
    }

    return next(helpers.quickError('Internal Server Error', 500));
});

module.exports = router;