const passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    userModel = require('../models/userModel');

passport.use('local', new localStrategy((username, password, done) => {
    userModel.findOne({
        username
    }, (err, user) => {
        // if (err) {
        //     return done(err);
        // }
        if (!user) {
            return done(null, false, {
                message: 'User account does not exist!!!.'
            });
        }
        if (user.password != password) {
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }
        return done(null, user);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    userModel.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.addUser = (user, result) => {
    userModel.addUser(user, (err, res) => {
        result(err, res);
    });
}

passport.getDetails = userModel.getDetails;

module.exports = passport;