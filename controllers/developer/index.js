var
    fs = require('fs'),
    path = require('path'),
    rootDir = __dirname + '/views/dist/'
var sysConfig = require('dotenv').config()
//extract-zip //zip-folder //search-in-file //node-directory-search
var routeParam={}
exports.before = function(req, res, next) {
    next()
};
exports.setting = function(req, res, next) {
    var data = fs.readFileSync(__dirname+"/setting.default.json","utf8")
    data = JSON.parse(data)
    var
    setValue = (data,body,value,parent)=>{
        for(var key in data){
            //default value = false
            data[key].value = false
            if(body[key])
                data[key].value = true
            if(data[key].childs)
                data[key].childs =  setValue(data[key].childs,body,key)
        }
        return data
    }

    if (req.method == 'POST') {
        var {body} = req
        if(body.bycode)
            data = body.result
        
        if(!body.bycode){
            
            //set false for all
            //set true if in body
            data = setValue(data,body)
            data = JSON.stringify(data,null,"\t")
        }
        fs.writeFileSync(__dirname + '/setting.default.json', data);
        
        return res.redirect('/developer/setting')

    }

    res.locals.mainLayoutType = 'doc'
    res.locals.title = 'docs config'

    res.locals.partialLeft = __dirname + '/views/partials/boostrap-v5-slider-left'
    //console.clear()
    //console.log(__dirname+"/setting.default.json");
    res.locals.setting = data
    res.locals.__dirname = __dirname
    res.render('setting')
}
exports.index = function(req, res, next) {
    var 
    val={
        //mainLayoutType:"doc",
        title: "docs home",
        //partialLeft: __dirname + '/views/partials/boostrap-v5-slider-left',
        testShow: req.t("test auto add original languge")
    }
    res.render('index',val)
}

exports.list = function(req, res, next) {
    //console.log(dir) 
    var dir = rootDir
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir)
    var 
    val={
        title: "list",
        subDir: '',
        list: fs.readdirSync(dir),
        path:path,
        sysConfig:sysConfig
    }
    if(req.params)
         req.query.d = req.params[0] 
    if(req.query.d) {
        val.mainLayoutType = "doc"
        val.partialLeft = __dirname + '/views/partials/list-slider-left'
        dir = dir +req.query.d+'/'
        val.subDir = req.query.d+'/'
        val.list = fs.readdirSync(dir)
    } 
    res.render('list',val)
}
exports.add = function(req, res, next) {
    var dir = rootDir
    res.locals.body = {filename:'',content:''}
    if(req.params)
        req.query.d = req.params[0] 
    if (req.query.d) {
        res.locals.body.filename = req.query.d
        var stat = fs.statSync(dir + res.locals.body.filename)
        //console.log()
        //return res.send(JSON.stringify(stat,null,"\t"))
        if (stat.isFile() && fs.existsSync(dir + res.locals.body.filename))
        res.locals.body.content = fs.readFileSync(dir + res.locals.body.filename)
    } 

    if (req.method == 'POST') {
        var {
            filename,
            content,
            overWrite,
        } = req.body
        filename = filename.trim().toLowerCase().replace(/\s+/g, '-')
        var arrStr = filename.split('/')
 
        // console.log("----------POST--------------");
        // console.log(arrStr);
        if(arrStr.length!=1){
            filename=arrStr.pop()
            dir = dir+arrStr.join('/')+'/'
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir)
        }
        var extname = path.extname(filename)
        if(!extname)
            filename+='.md'
        console.log(filename);
        if (!fs.existsSync(dir + filename )|| overWrite=='true'){ 
            fs.writeFileSync(dir + filename , content);
            req.flash('success', req.t('File has save'))
            return res.redirect('/developer/add')
        }
        req.flash('danger', req.t('This file already exists'))
        req.flash('hide', req.body)
        //res.locals.body = req.body
        return res.redirect('/developer/add')
    }
    res.locals.mainLayoutType = 'doc'
    res.locals.title = 'docs'

    res.locals.partialLeft = __dirname + '/views/partials/boostrap-v5-slider-left'

    res.render('add')
};
exports.view = function(req, res, next) {

    var dir = rootDir
    // app.engine('md', function(path, options, fn){
    //   fs.readFile(path, 'utf8', function(err, str){
    //     if (err) return fn(err);
    //     var html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name){
    //       return escapeHtml(options[name] || '');
    //     });
    //     fn(null, html);
    //   });
    // });

    // app.set('views', path.join(__dirname, 'views'));

    // // make it the default so we dont need .md
    // app.set('view engine', 'md');
    
    res.locals.mainLayoutType = 'doc'
    res.locals.title = 'docs'

    res.locals.partialLeft = __dirname + '/views/partials/boostrap-v5-slider-left'
    
    if(req.params)
        req.query.v = req.params[0]
    
    if (req.query.v) {
        var subDir = req.params[0].split('/')
        subDir.pop()
        subDir = subDir.join('/')
        res.locals.mainLayoutType = "doc"
        res.locals.partialLeft = __dirname + '/views/partials/list-slider-left'
        res.locals.list = fs.readdirSync(rootDir+subDir)
        res.locals.path = path
        res.locals.subDir = subDir+'/'

        var version,chapter,page, val = req.query.v
        var p = /\/([0-9\.]+)\/([\w\-]+)\/([\w-\-]+)/g.exec(val)
        console.log(val)
        console.log(p)
        if(p){
            val = p[0]
            version = p[1],
            chapter = p[2],
            page = p[3]
        }
        val = val[0]!='/'?'/'+val:val
        if (fs.existsSync(dir + val)) {
            
            return res.render('/dist' + val)

        }
        req.flash('danger', req.t('file not found'))
        return res.redirect('/developer/add/' + req.query.v)
    }
    //return res.send(JSON.stringify(req.params))
    res.render('view')
};

exports.express4xAPI = function(req, res, next) {
    res.locals.isDoc = true
    res.locals.mainLayoutType = 'doc'
    res.locals.title = 'express 4.x API'
    res.locals.partialLeft = __dirname + '/views/partials/express4xAPI-slider-left'
    res.render('express4xAPI')
};
