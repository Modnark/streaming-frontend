const express = require('express');
const router = express.Router();
const database = require('../database');
const db = database.db;
const { quickError } = require('../helpers');
const path = '/watch/:channelId';

// Frontend
router.get(path, async (req, res, next) => {
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
            return res.render(
                'watch', 
                {
                    title: `Watching ${userRes.username}'s Stream`, 
                    channelId: req.params.channelId
                }
            );
        }

        return res.status(404).json({error: {details: [{message: 'Not Found'}]}});
    } catch(error) {
        next(error);
    }
});

router.all(path, (req, res, next) => {
    return next(quickError('Method Not Allowed', 405));
});

module.exports = router;