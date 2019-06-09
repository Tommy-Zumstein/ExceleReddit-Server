const firebase = require('./firebase');

var admin = require('firebase-admin');

var fbAdmin = admin.initializeApp({
    credential: admin.credential.cert(firebase.firebaseDB),
    databaseURL: firebase.firebaseURL,
});

class Auth {
    constructor() {
        this.fbAdmin = admin.initializeApp({
            credential: firbaseSDK.credential.cert(firebase.firebaseDB),
            databaseURL: firebase.databaseURL,
        });
    }

    static verifyToken(req, res, next) {

        var idToken;

        if (req.headers && req.headers.id_token) {
            idToken = req.headers.id_token.split(' ')[1]

        } else {
            console.log('ERROR: request missing token');
            res.status(401).json({ error: "Token missing from header" });
            return;
        }

        // check firebase
        fbAdmin.auth().verifyIdToken(idToken)
            .then(function (decodedToken) {
                let uid = decodedToken.uid;
                fbAdmin.auth().getUser(uid)
                    .then(function (userRecord) {
                        next();
                    })
                    .catch(function () {
                        console.log('ERROR: Could not match firebase user to token uid');
                        res.status(400).json({ error: "No matching firebase user" });
                        return;
                    });

            }).catch(function (error) {
                console.log('ERROR: Invalid or expired token');
                res.status(401).json({ error: "Invalid firebase token" });
                return;
            });
    }
}

module.exports = Auth;
