const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// Import routes
const notificationRoutes = require("./src/routes/Notification");

// Import Services
const updateShopRating = require("./src/services/shop/updateRating");
const updateDishRating = require("./src/services/dish/updateRating");
const notifyOrderPlaced = require("./src/services/order/notifyNew");
const notifyOrderStatusChanged =
require("./src/services/order/notifyStatusChanged");
const sendUserWelcomeMail = require("./src/services/user/sendWelcomeMail");
const deleteUser = require("./src/services/user/delete");

// Import config
const CONFIG = require("./src/config/config");

admin.initializeApp();
const app = express();
app.use(cors({origin: true}));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(CONFIG.PATH_API, notificationRoutes());

module.exports = {
  api: functions.https.onRequest(app),
  updateShopRating,
  updateDishRating,
  notifyOrderPlaced,
  notifyOrderStatusChanged,
  sendUserWelcomeMail,
  deleteUser,
};
