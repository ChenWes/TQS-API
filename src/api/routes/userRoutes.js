'use strict';
import userControl from '../controllers/userController';
import authControl from '../controllers/authController';

module.exports = (app) => {
    // user Routes
    app.route('/user')
        .get(authControl.loginRequired, userControl.ListAllUser)
        .post(userControl.CreateUser);

    // app.route('/user/:id')
    //     .get(authControl.loginRequired, userControl.GetSingleUser)
    //     .put(authControl.loginRequired, userControl.UpdateUser)
    //     .delete(authControl.loginRequired, userControl.DeleteUser);

    // app.route('/user/:size/:index')
    //     .get(authControl.loginRequired, userControl.GetUserListPage);
};