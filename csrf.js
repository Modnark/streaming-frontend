const config = require('./config.json');

const { csrfSync } = require('csrf-sync');
const {
    invalidCsrfTokenError,
    generateToken,
    csrfSynchronisedProtection,
  } = csrfSync();

module.exports = {
    invalidCsrfTokenError,
    generateToken,
    csrfSynchronisedProtection,
}