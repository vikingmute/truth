
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , users = require('./usermodel');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', {
	layout: false
});
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'nodebook',
  key: 'userdb',
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: 'userdb'
  })
}));
app.use(flash());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(require('stylus').middleware(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*app.get('/', routes.index);
app.get('/users', user.list);*/
var testObj = {"title":"not so good",
"name":"the king of viking",
"books":[{"title":"viking stuff 1"},
{"title":"catcher in the rye"}],
"message":"a hello from viking"};
app.get('/',function(req,res){
  testObj.useremail = req.session.useremail;
  res.render("index",testObj);
})

app.get('/signup',function(req,res){
  testObj.useremail = req.session.useremail;
  testObj.info = req.flash('info');
	res.render("signup",testObj);
})
app.post('/signup',users.addUser);

app.get('/login',function(req,res){
  testObj.useremail = req.session.useremail;
  testObj.info = req.flash('info');
  res.render("login",testObj);
})
app.get('/logout',function(req,res){
  req.session.useremail = null;
  res.redirect('/');
})
app.get('/upload',function(req,res){
  testObj.useremail = req.session.useremail;
  testObj.info = req.flash('info');
  res.render("upload",testObj);
})
app.post('/login',users.userLogin);
/*app.post('/signup',function(req,res){
  res.send(req.body);

});*/
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
