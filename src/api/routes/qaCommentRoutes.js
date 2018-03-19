'use strict';
import qaCommentController from '../controllers/qaCommentController';
import authControl from '../controllers/authController';

module.exports = (app) => {
    // user Routes
    app.route('/qaComment')
        .get(authControl.loginRequired, qaCommentController.ListAllQAComment)
        .post(authControl.loginRequired, qaCommentController.CreateQAComment);

    app.route('/qaComment/:GetQACommentByType')
        .get(authControl.loginRequired, qaCommentController.GetQACommentByType)

    app.route('/qaComment/:size/:index')
        .get(authControl.loginRequired, qaCommentController.GetQACommentListPage);
};