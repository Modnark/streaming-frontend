const { v4: uuidv4 } = require('uuid');

function quickError(message, status) {
    const quickError = new Error(message);
    quickError.status = status;
    return quickError;          
}

const hbsHelpers = {
    equals: (arg, arg2) => { return arg === arg2 },
    noteq: (arg, arg2) => { return arg !== arg2 },
    greater: (arg, arg2) => {return arg > arg2},
    lesser: (arg, arg2) => {return arg < arg2},
    p1: (arg) => {return arg + 1},
    m1: (arg) => {return arg - 1},
    for: (from, to, block) => {
        let incr = '';
        for(let i = from; i < to; i++)
            incr += block.fn(i);
        return incr; 
    },
    timeNowPassed: (cTime) => {
        const utcNow = Date.now() + (new Date().getTimezoneOffset() * 60 * 1000); 
        return utcNow >= cTime;
    },
    replaceIfWithin: (array, searchString, replacement) => {
        if (array.includes(searchString)) {
          return replacement;
        } else {
          return searchString;
        }
    },
    truncateStringElipsis: (inputString, maxLength) => {
        const realStr = String(inputString);
        if(realStr.length > maxLength)
            return String(inputString).substring(0, maxLength - 3) + '...';
        else
            return realStr;
    },
    removeHTML: (inputString) => {
        return String(inputString).replace(/<\/?[^>]+(>|$)/g, '');
    },
    formatDate: (inputDate) => {
        return helpers.formatDate(inputDate);
    },
    lenEq: (array, comparitor) => {
        return array.length === parseInt(comparitor);
    },
    lenNotEq: (array, comparitor) => {
        return array.length !== parseInt(comparitor, 10);
    },
    optionSelected: (v1, v2) => {
        return v1 === v2 ? 'selected' : '';
    }
}

function randomString() {
    return uuidv4().replace(/-/g, '').toUpperCase() + uuidv4().replace(/-/g, '').toUpperCase();
}

module.exports = {
    quickError,
    hbsHelpers,
    randomString
}