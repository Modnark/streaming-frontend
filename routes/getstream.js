const express = require('express');
const router = express.Router();
const database = require('../database');
const db = database.db;
const { quickError, getStreamFileName } = require('../helpers');
const path = require('path');
const config = require('../config.json');
const fs = require('fs/promises');

const apiPath = '/api/stream/v1/getstream/:channelid';

// API
router.get(apiPath, async (req, res, next) => {
    try {
        const userRes = await db.transaction(async(t) => {
            const user = await database.models.User.findOne({
                where: {
                    id: req.params.channelid
                },
                transaction: t
            });

            return user;
        });

        // Check if user exists
        if(userRes) {
            const streamName = getStreamFileName(userRes.username, userRes.userId);
            const filePath = path.join(config.server.streamStorage, `${streamName}_dat.m3u8`);
        
            // Make sure it exists
            try {
                await fs.access(filePath);
            } catch(error) {
                return next(quickError('Not Found', 404));
            }

            // Get ready to send it
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.setHeader('Content-Disposition', 'inline; filename="playlist.m3u8"');

            // Send it
            const data = await fs.readFile(filePath);
            return res.send(data);
        }

        // Fallback
        return res.status(404).json({error: {details: [{message: 'Not Found'}]}});
    } catch(error) {
        console.log(error);
        next(error);
    }
});

router.all(apiPath, (req, res, next) => {
    return next(quickError('Method Not Allowed', 405));
});

module.exports = router;