module.exports = function (params) {

    var app = params.app;
    var express = require('express');
    var router = express.Router();
    var authController = require('../controllers/authController')({app: app});
    var chatController = require('../controllers/chatController')({app: app});

    router.get('/', function (req, res, next) {

        res.json({'message': 'Hello World!'});


    });

    /* handles the user login / authentication  */
    /* returns jwt bearer token to the client on login success */
    router.route('/login').post(
        authController.authenticate,
        authController.sendToken);

    //
    router.get('/rooms',
        authController.isAuthenticated,
        chatController.getRooms);

    router.post('/createroom',
        authController.isAuthenticated,
        authController.authorize('admin'),
        chatController.createRoom);

    /* Handles an auth check so the client app can check to see if the user is still authenticated, This will catch expired Tokens */
    router.route('/auth').get(authController.isAuthenticated, function(req, res){
        //res.sendStatus(200);
        res.json({user: req.user});
    });

    return router;
}



