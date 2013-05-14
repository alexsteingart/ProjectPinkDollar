
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');
  
var app = module.exports = express();
var server = http.createServer(app);

// Configuration


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' } ));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes

app.get('/', routes.index);
app.get('/calendar', routes.calendar);
app.get('/calendar/:asOfDate', routes.calendar);
app.post('/getNewObject', routes.getNewObject);
app.post('/getDBObject', routes.getDBObject);
app.post('/doEditObject', routes.doEditObject);
server.listen(3000);
console.log("Express server listening on in %s mode", app.get("env"));


