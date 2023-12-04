const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const passport = require("passport");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users').router;
const entryRouter = require('./routes/entry');

const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load env variables 
dotenv.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add passport to app
app.use(session({
	secret: '12w3erfghmjytr4e32wsedfgbn', 
	resave: true, 
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/entry', entryRouter);

// Connect to database 
mongoose.connect('mongodb+srv://admin:Rutvi%401903@cluster0.zin9ppd.mongodb.net/Webapp').then(() => {
	console.log("DB connected successfully");
}).catch((error) => {
	console.log(error)
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

module.exports = app;
