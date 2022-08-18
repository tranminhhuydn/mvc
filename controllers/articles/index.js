var fs = require('fs');
var path = require('path');

// exports.before = function(req, res, next){
//   var id = req.params.site_id;
//   console.log('query',req.query)
//   console.log('req',req.url)

//   // var str = ''
//   // for(var i in req)
//   //     str+=i+'\n'
//   // fs.writeFileSync('./test.req.json', str, 'utf8'); 

//   if (!id) return next();
//   // pretend to query a database...
//   process.nextTick(function(){
//     req.user = db.users[id];
//     // cant find that user
//     if (!req.user) return next('route');
//     // found it, move on to the routes
//     next();
//   });
// }; 

exports.index = function (req,res) {
  var dir = path.join(__dirname, '../../', 'controllers');
  var verbose = true;
  var lists = []
  fs.readdirSync(dir).forEach(function(name){
    var file = path.join(dir, name)
    if (!fs.statSync(file).isDirectory()) return;
    
    if(name=='main') return;
    
    lists.push({name:name})
    //verbose && console.log('\n   %s:', name);
    //var obj = require(file)(socket);
  }) 
  //console.log(__dirname+'/index');
  
  res.render('index',{lists:lists})
};