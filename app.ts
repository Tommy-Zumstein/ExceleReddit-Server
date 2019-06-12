import * as express from 'express';
import * as bodyParser from 'body-parser';

const firebaseSDK = require('firebase');
const firebase = require('./firebase');
const cors = require('cors');
const UserRouter = require('./routes/users');

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.initializeFirebase();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();

    router.get('/', UserRouter);
    this.express.use(UserRouter);
    this.express.use('/', express.static(__dirname + '/angularSrc'));
  }

  initializeFirebase() {
    firebaseSDK.initializeApp(firebase.firebaseConfig);
  }
}

let server: any = new App().express;
server.listen(8080);

export { App };

