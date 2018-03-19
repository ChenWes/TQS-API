'use strict';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Config from 'config-lite';
import jwt from 'jsonwebtoken';
import jwtEncode from './api/common/jwtBasicSetting';
import { logger } from './api/common/logger';

let app = express();
let config = Config(__dirname);

logger.info('------------------------------------------------------------>');
logger.info('TQS API Server Current Config:', config);

/* CORS */
app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

	if (req.method == 'OPTIONS') {
		res.send(200);/*让options请求快速返回*/
	}
	else {
		next();
	}
});

/* Basic Setting */
// app.use(logger('dev'));
app.use(bodyParser.json({ "limit": "10000kb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* get token */
app.use((req, res, next) => {
	let token = req.body.token || req.query.token || req.headers.authorization;
	if (token) {
		logger.info(`call API[${req.url}] with token:${token}`);
		jwt.verify(token, jwtEncode.encode, (err, decode) => {
			if (err) {
				req.user = undefined;
			} else {
				req.user = decode;
			}
			next();
		});
	} else {
		req.user = undefined;
		next();
	}
})

/* routes */
let userRoutes = require('./api/routes/userRoutes');
userRoutes(app);

let authRoutes = require('./api/routes/authRoutes');
authRoutes(app);

let orderRoutes = require('./api/routes/orderRoutes');
orderRoutes(app);

let qaCommentRoutes = require('./api/routes/qaCommentRoutes');
qaCommentRoutes(app);

/* Not Found */
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
})

/* Handling Error */
app.use((err, req, res, next) => {
	logger.error(`call API [${req.url}] , Server Error : ${err.message}`);
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500).end();
});

/* Start Server */
if (module.parent) {
	module.exports = app;
} else {
	app.listen(config.port, () => {
		logger.info(`TQS API Server Started On:${config.port} `);
	});
}