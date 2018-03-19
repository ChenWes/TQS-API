'use strict';
import orderControl from '../controllers/orderController';
import authControl from '../controllers/authController';

module.exports = (app) => {
    // order Routes
    app.route('/productionOrders/search')
        .get(authControl.loginRequired, orderControl.SearchOrder)        
};