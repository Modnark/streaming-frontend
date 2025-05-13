const argon2 = require('argon2');

async function hashPassword(password) {
    try {
        return await argon2.hash(password);
    } catch(err) {
        throw err;
    }
}

async function testPassword(password, hash) {
    try {
        return await argon2.verify(hash, password);
    } catch(err) {
        throw err;
    }
}

module.exports = {
    hashPassword,
    testPassword
}