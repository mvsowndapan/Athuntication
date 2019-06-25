const express = require('express'),
    mongoose = require('mongoose'),
    authenticate = require('./config/authenticate'),
    middleware = require('./config/middleware'),
    hbs = require('hbs'),
    app = express();

var port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Server Started in", process.env.NODE_ENV);
});

mongoose.connect('mongodb://localhost:27017/testdbs', {
    useNewUrlParser: true
}, (db) => {
    console.log("Databse Started");
});

app.disable('etag');

middleware(app);
app.use(express.static('public'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    if (!req.user) {
        res.redirect('/login');
    } else {
        authenticate.getDetails(req.user,(err,account) => {
            if(err) {
                throw err;
            } else {
                res.json(account);
            }
        });
        //res.render('dashboard');
    }
});

app.get('/register', (req, res) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('register');
    }
});

app.get('/login', (req, res) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

app.post('/login', authenticate.authenticate('local', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/');
});

app.post('/register', (req, res) => {
    console.log(req.body);
    authenticate.addUser(req.body, (err, user) => {
        if (err) {
            res.end('Registeration failed');
        } else {
            req.logIn(user, (err, done) => {
                if (err) {
                    throw err;
                } else {
                    res.redirect('/');
                }
            });
        }
    });
});