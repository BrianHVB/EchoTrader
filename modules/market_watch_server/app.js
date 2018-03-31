const createError = require('http-errors');
const express = require('express');
const path = require('path');
const appRoot = require('app-root-path');
const cookieParser = require('cookie-parser');

const winston = require(`${appRoot}/config/winston`);
const morgan = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const config = require('./config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan(config.logging.morgan.format, {
	stream: winston.stream
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	//log the error in winston
	let msg = `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;
	winston.error(msg);

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

winston.debug('app.js loaded');

module.exports = app;



