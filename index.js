var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var session = require('express-session');
var bodyParser = require('body-parser');
var md5 = require('blueimp-md5');
var url = require('url');
var jwt = require('jwt-simple');    

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

var user = {
    username: "huynguyen",
    password: "123456"
};
var secret = "huy";

var checkSession = function (req, res, next) {
    if (req.session && req.session.user === "admin" && req.session.admin) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

app.get('/login', function (req, res) {
    //var query = url.parse(req.url).query;
    //console.log(query);
    //res.end(md5(query));
    var token = jwt.encode(user, secret);
    var decode = jwt.decode(token, secret);
    console.log(decode);
    res.end(token);
    //res.render('login');
});

app.post('/login', function (req, res) {
    var name = req.body.username;
    var pass = req.body.password;
    console.log(name);
    console.log(pass);
    if (user.username === name && user.password === pass) {
        req.session.user = "admin";
        req.session.admin = true;
        res.redirect('/');
    } else {
        alert("Tài khoản hoặc mật khẩu sai!");
    }
});

app.get('/', checkSession, function (req, res) {
    res.render('home');
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

server.listen(5000, function () {
    console.log("server is listening with port 5000");
});