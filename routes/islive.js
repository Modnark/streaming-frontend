const express = require('express');
const router = express.Router();
const database = require('../database');
const db = database.db;
const { quickError } = require('../helpers');
const threshold = 5 * 1000;
const config = require('../config.json');
const path = require('path');
const fs = require('fs/promises');
const apiPath = '/api/user/v1/get-live-status/:channelId';

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
            const publicStreamKey = userRes.publicStreamKey;
            
            try {
                const filePath = path.join(config.server.streamStorage, `${publicStreamKey}_dat.m3u8`);
                const mTime = (await fs.stat(filePath)).mtimeMs;
                const delta = Date.now() - mTime;
                return res.json({live: delta < threshold});
            } catch(error) {
                if(error) {
                    if(error.code === 'ENOENT') {
                        return res.json({live: false});
                    }
                }
            }
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