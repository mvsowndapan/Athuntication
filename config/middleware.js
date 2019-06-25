const session = require('express-session'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongo')(session),
    authenticate = require('./authenticate'),
    bodyParser = require('body-parser');


module.exports = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(require('morgan')('dev'));
    app.use(session({
        secret: "yoganathanIsTheFounderOfUserInterfaceDesign",
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({
            mongooseConnection: mongoose.connection,
            collection: 'passportSessions'
        })
    }));
    app.use(authenticate.initialize());
    app.use(authenticate.session());
}