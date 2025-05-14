const express = require('express');
const app = express();
const config = require('./config.json');
const exphbs = require ('express-handlebars');
const database = require('./database');
const routes = require('./router');
const helmet = require('helmet');
const { csrfSynchronisedProtection } = require('./csrf');
const session = require('express-session');
const { sessionData } = require('./session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const { hbsHelpers } = require('./helpers');

// Provides minor additional security
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', '*']
        }
    })
);

// Setup handlebars
// Move this to its own file?
const hbs = exphbs.create({
    helpers: hbsHelpers,
    defaultLayout: 'main',
    extname: '.handlebars',
    
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
});

// Setup assets
app.use(express.static('static'));

// Setup router
routes(app);

// Handlebars init
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Body parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Database setup
const db = database.db;
const sessionStore = new SequelizeStore({
    db: db,
    table: 'Session',
});

app.use(cookieParser(config.security.cookieSecret));

app.use(session({
    name: 'session',
    secret: config.security.sigKey,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: config.server.mode === 'prod',
        sameSite: 'strict'
    },
}));

app.use(sessionData);

// CSRF setup
app.use(csrfSynchronisedProtection);

// Website startup
db.sync().then(() => {
    app.use((req, res, next) => {
        const notFoundError = new Error('Not Found');
        notFoundError.status = 404;  
        next(notFoundError);
    });

    // TODO: Make a real error page
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            error: {
                details: [{message: err.message || 'Internal Server Error'}]
            }
        });
    });

    app.listen(config.server.port, () => {
        console.log(`Streaming site running @ localhost:${config.server.port}`);
    });
});