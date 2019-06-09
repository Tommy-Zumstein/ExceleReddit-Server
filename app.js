"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var firebaseSDK = require('firebase');
var firebase = require('./firebase');
var cors = require('cors');
var UserRouter = require('./routes/users');
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function App() {
        this.express = express();
        this.middleware();
        this.routes();
        this.initializeFirebase();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.express.use(cors());
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    };
    // Configure API endpoints.
    App.prototype.routes = function () {
        /* This is just to get up and running, and to make sure what we've got is
         * working so far. This function will change when we start to add more
         * API endpoints */
        var router = express.Router();
        router.get('/', UserRouter);
        this.express.use(UserRouter);
    };
    App.prototype.initializeFirebase = function () {
        firebaseSDK.initializeApp(firebase.firebaseConfig);
    };
    return App;
}());
exports.App = App;
var server = new App().express;
server.listen(8080);
