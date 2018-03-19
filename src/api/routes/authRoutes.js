'use strict';
import authControl from '../controllers/authController';

module.exports = (app) => {
    // user auth
    app.route('/auth/get_token')
        .post(authControl.getToken);

    app.route('/auth/refresh_token')
        .post(authControl.loginRequired, authControl.refreshToken);
};