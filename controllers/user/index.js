var fs = require('fs');
var path = require('path');

    
exports.before = function(req, res, next) {
    res.locals.title = 'User'
    next();
};

exports.index = function(req, res) {
    let token = req.cookies['session-token'];
    res.render('index',{user:token})
};
exports.login = function(req, res) {
    //POST
    if (req.method=='POST') {
        let token = req.body.token;
        token.role = 'manager'
        req.session.user = token
        res.cookie('session-token', token);
        return res.send('success')
    }
    //GET
    if (req.method=='GET') {
        if (req.session.user != null || req.cookies['session-token']!=null) {
            req.flash('danger', req.t('You are ready login'))
            return res.redirect('/user')
        }
        res.locals.title = req.t('User-login')
        return res.render('login2')
    }
};

exports.logout = function(req, res) {
    res.clearCookie('session-token');
    req.session.user = null
    return res.redirect('/')
};

exports.test = function(req, res) {
    res.locals.title = req.t('User-test access ')
    return res.render('login')
};
exports.admin = function(req, res) {
    res.locals.title = req.t('User-test access admin')
    return res.render('login')
};