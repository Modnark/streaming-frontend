async function sessionData(req, res, next) {
    const loggedIn = req.session.loggedIn;

    if(loggedIn) {
        const userId = req.session.userId;
        const username = req.session.username;

        res.locals.loggedIn = loggedIn;
        res.locals.userId = userId;
        res.locals.username = username;
    }

    next();
}

async function startNewSession(req, user) {
    return new Promise(async (resolve, reject) => {
        try {
            req.session.loggedIn = true;
            req.session.userId = user.id;
            req.session.username = user.username;
            
            resolve();
        } catch(error) {
            reject(error);
        }
    });
}

function noAuth(req, res, next) {
    const loggedIn = req.session.loggedIn;
    if(loggedIn)
        return res.redirect('/');
    next();
}

function authOnly(req, res, next) {
    const loggedIn = req.session.loggedIn;
    if(!loggedIn)
        return res.redirect('/');
    else
        next();
}

module.exports = {
    sessionData,
    startNewSession,
    noAuth,
    authOnly
}