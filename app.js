var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//watcher files
var txtListener = require('./helpers/nodeTemp');
var txtListener2 = require('./helpers/nodeNewTemp');
var xlsListener = require('./helpers/xlsNewTemplate');

//db conn
var mongo = require('./helpers/mongoConn');

var templateRouter = require('./routes/template.router');
var modelRouter = require('./routes/models.router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding, X-Auth-Token, content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/templates',templateRouter);
app.use('/models',modelRouter);
app.use("/",(req,res)=>{
  res.send({
    status : 200,
    message : "Success",
    data : "Welcome to Text to XML Conversion tool API's"
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen("4300",(err)=>{
  if(err){
    console.log("Error in opening application")
    console.log(err);
  } else {
    console.log("application started on port : 4300")
  }
})

module.exports = app;
