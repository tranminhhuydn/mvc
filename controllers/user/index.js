var fs = require('fs');
var path = require('path');

exports.before = function(req, res, next) {
    res.locals.title = 'User'

    
    next();
};

exports.index = function(req, res) {
    res.render('index')
};
exports.login = function(req, res) {
    //POST
    //if (Object.keys(req.body).length != 0) {
    if (req.method=='POST') {
        var {
            email,
            password
        } = req.body
        if (email == 'admin@gmail.com' && password == '12345') {
            req.body.role = 'manager'
            req.session.user = req.body

            req.flash('success', req.t('Login success full'))
            return res.redirect('/user')
        }
        req.flash('danger', req.t('Login unsuccess full'))
        return res.redirect(res.locals.form.url)
    }
    //GET
    if (req.session.user != null) {
        req.flash('danger', req.t('You are ready login'))
        return res.redirect('/user')
    }
    res.locals.title = req.t('User-login')
    return res.render('login')
};

exports.logout = function(req, res) {
    req.session.user = null
    req.flash('success', req.t('User logout'))
    return res.redirect('/user')
};

exports.test = function(req, res) {
    res.locals.title = req.t('User-test access ')
    return res.render('login')
};
exports.admin = function(req, res) {
    res.locals.title = req.t('User-test access admin')
    return res.render('login')
};