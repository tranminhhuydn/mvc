exports.before = function(req, res, next) {
    next()
};

exports.websocket = function(req, res, next) {
    res.locals.title = 'websocket'
    //res.locals.isDoc = true
    res.locals.partialRight = __dirname + '/views/partials/websocket-slider-right'
    //res.locals.layout = 'layout.doc.ejs'
    res.render('websocket')
};