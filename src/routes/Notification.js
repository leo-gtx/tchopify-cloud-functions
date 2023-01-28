/* eslint-disable */
const express = require('express');
const NotificationMiddleware = require('../middlewares/Notification');

const NotificationRoutes = (app)=>{
    const router = express.Router();
    router.route('/notification/new-order-placed')
    .post(NotificationMiddleware.sendWhatsappNewOrderPlaced);

    return router;
}
module.exports = NotificationRoutes;