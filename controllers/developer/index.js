var
    fs = require('fs'),
    path = require('path')


exports.before = function(req, res, next) {
    next()
};
exports.add = function(req, res, next) {
    if (req.method == 'POST') {
        var {
            filename,
            content
        } = req.body
        filename = filename.trim().toLowerCase().replace(/\s+/g, '-')
        console.log(filename);
        fs.writeFileSync(__dirname + '/views/data/' + filename + '.md', content);
        return res.redirect('/developer/add')

    }
    res.locals.mainLayoutType = 'doc'
    res.locals.title = 'docs'

    res.locals.partialLeft = __dirname + '/views/partials/boostrap-v5-slider-left'

    res.render('add')
};

exports.docs = function(req, res, next) {


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
    if (req.query.v) {
        var val = req.query.v
        var p = /\/([0-9\.]+)\/([\w\-]+)\/([\w-\-]+)/g.exec(val)
        console.log(val)
        console.log(p)
        val = p[0]
        var version = p[1],
            chapter = p[2],
            page = p[3]
        console.log('   page: %s', page)
        console.log('   val: %s', val)
        if (fs.existsSync(__dirname + '/views/data/docs' + val + '.md')) {
            
            //const ghmd = require('github-markdown');
            var data = fs.readFileSync(__dirname + '/views/data/docs' + val + '.md');
            // const markdown = buffer.toString();
            // data = ghmd(markdown);
            fs.writeFileSync(__dirname + '/views/data/docs' + val + '.ejs', data.toString(), 'utf8');


            // var MarkdownIt = require('markdown-it'),
            //     md = new MarkdownIt();

            // var content = fs.readFileSync(__dirname + '/views/data/docs' + val + '.md','utf8');
            // var data = md.render(content)
            // fs.writeFileSync(__dirname + '/views/data/docs' + val + '.ejs', data, 'utf8');
            
            return res.render('/data/docs' + val)
        }
        req.flash('danger', req.t('file not found'))
        return res.redirect('/developer/add?v=' + req.query.v)
    }

    res.render('docs')
};

exports.express4xAPI = function(req, res, next) {
    res.locals.isDoc = true
    res.locals.mainLayoutType = 'doc'
    res.locals.title = 'express 4.x API'
    res.locals.partialLeft = __dirname + '/views/partials/express4xAPI-slider-left'
    res.render('express4xAPI')
};