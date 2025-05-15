const express = require('express');
const router = express.Router();
const database = require('../database');
const db = database.db;
const { quickError } = require('../helpers');
const apiPath = '/api/stream/v1/get-stream-id/:channelId';

// API
router.get(apiPath, async (req, res, next) => {
    try {
        const userRes = await db.transaction(async(t) => {
            const user = await database.models.User.findOne({
                where: {
                    id: req.params.channelId
                },
                transaction: t
            });

            return user;
        });

        if(userRes) {
            return res.json({streamId: userRes.publicStreamKey});
        }
        return res.status(400).json({error: {details: [{message: 'Unknown error'}]}});
    } catch(error) {
        next(error);
    }
});

router.all(apiPath, (req, res, next) => {
    return next(quickError('Method Not Allowed', 405));
});

module.exports = router;