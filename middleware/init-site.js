var
    fs = require('fs'),
    path = require('path')

var {
    ROLE
} = require('../models/user');

exports.iniSite = function(req, res, next) {
    
    res.locals.MAINMENU = [
    {
        text: 'Bootstrap 5.2',
        url: '/developer/docs'
    }, {
        text: '4.x API',
        url: '/developer/express4xAPI'
    }, {
        text: 'news',
        url: '/a/index'
    }, {
        text: 'Admin',
        url: '/user/admin'
    }, {
        text: 'login',
        url: '/user/login'
    }, {
        text: 'Setting',
        url: '/setting/setting'
    }, {
        text: 'stardict',
        url: '/stardict'
    },{
        text: 'site',
        url: '/site'
    }, {
        text: 'download docs',
        url: '/site/downloadDdocs'
    }, {
        text: 'websocket',
        url: '/chats/websocket'
    }
    ]

    res.locals.config = JSON.parse(fs.readFileSync('./config/setting.json', 'utf8'));

    res.locals.title = "home"
        //res.locals.csrf = req.csrfToken()

    //#helper 
    //#helper for form
    res.locals.form = {}
    res.locals.form.url = req.url

    //:todo i18n
    req.t = function(str) {
        return str;
    }

    //:todo immulate login 
    if (req.session.user != null) {
        req.user = req.session.user
        res.user = req.session.user
    }
    req.isAuthenticated = function() {
        if (req.session.user == null)
            return false;
        return true;
    }

    req.ROLE = ROLE

    //SET LAYOUT DEFAULT
    res.locals.layout = 'layout.doc.ejs'
    if (req.url != '/')
        res.locals.layout = '../../../views/layout.doc.ejs'

    //OVER WRITE RENDER
    res.render = function render(view, options, callback) {
        var app = this.req.app;
        var done = callback;
        var opts = options || {};
        var req = this.req;
        var self = this;

        // support callback function as second arg
        if (typeof options === 'function') {
            done = options;
            opts = {};
        }

        // merge res.locals
        opts._locals = self.locals;

        // default callback to respond
        done = done || function(err, str) {
            if (err) return req.next(err);
            //console.log('--------------str');
            self.send(str);
        };
        //console.log('-----------layout',res.locals.layout )
        res.locals.view = app.get('views') + '/' + view
        var layout = res.locals.layout=='../views/layout'? 'layout.doc.ejs': res.locals.layout
            console.log('-----------layout',layout )
            // console.log('view',res.locals.view )
            // render
        app.render(layout, opts, done);
    }
};