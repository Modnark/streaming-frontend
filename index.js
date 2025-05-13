const express = require('express');
const app = express();
const port = 9984;
const exphbs = require ('express-handlebars');
const database = require('./database');
const routes = require('./router');

// Setup handlebars
// Move this to its own file?
const hbs = exphbs.create({
    helpers: {
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
    },
    defaultLayout: 'main',
    extname: '.handlebars',
    
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

// Setup assets
app.use(express.static('content'));

// Setup router
routes(app);

// Handlebars init
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Website startup
const db = database.db;
db.sync().then(() => {
    app.listen(port, () => {
        console.log(`Streaming site running @ localhost:${port}`);
    });
});