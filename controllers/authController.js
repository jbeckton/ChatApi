/**
 * Created by jbeckton on 2/9/16.
 */
module.exports = function (params) {

    var app = params.app;
    var passport = require('passport');
    var localStrategy = require('passport-local');
    var jwtBearerStrategy = require('passport-http-jwt-bearer');
    var jwt = require('jsonwebtoken');
    var User = require('../models/user.js');

    var secret = 'SantaIsReal!!';
    // TODO: token options should be in a global config
    var jwtTokenOptions = {expiresIn: '1 day', audience: 'web', issuer: 'viawest'};


    // configuration for the passport jwtBearerStrategy strategy
    var jwtBearerStrategyConfig = {session: false};
    // configuration for the passport local strategy
    var localStrategyConfig = {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    };

    /* authenticate  */

    passport.use(new localStrategy(localStrategyConfig, function (req, username, password, done) {


            User.findOne({username: username}, function (err, user) {

                // did something blow up?
                if (err) {
                    return done(err);
                }

                // did we not find a user based on the username?
                if (!user) {
                    return done(null, false);
                }

                // Is the user account still enabled?
                if (!user.checkIsEnabled()) {
                    return done(null, false);
                }

                // verify the users password
                user.verifyPassword(password, function (verificationError, isMatch) {

                    if (verificationError) {
                        return done(verificationError);
                    }

                    // did password match?
                    if (!isMatch) {
                        return done(null, false);
                    }

                    return done(null, user.username);

                });

            });

        }
    ));

    /* isAuthenticated */

    passport.use(new jwtBearerStrategy(secret, jwtBearerStrategyConfig, function (token, done) {

            User.findOne({username: token.sub}, function (err, user) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }

                // Is the usser account still enabled?
                if (!user.checkIsEnabled()) {
                    return done(null, false);
                }

                return done(null, user.username, token);
            });


        }
    ));

    /* authorize */

    function authorize(role) {
        // This closure allows us to have access to the req, res and next while also passing in custom params
        return function (req, res, next) {


            User.findOne({username: req.user}, function (err, user) {

                // did something blow up?
                if (err) {
                    res.sendStatus(400);
                } else if (!user || !user.hasRole(role)) {
                    res.sendStatus(403);
                } else {
                    next();
                }

            });

        }

    };

    /*
     * sendToken
     * Generates a jwt token for the client to store and send on each request to the API.
     * After successful authentication then log the user in by creating a token sending it with the response.
     */

    function sendToken(req, res) {


        // store the user id in the token so when it comes back with a request we can auth the request
        jwtTokenOptions.subject = req.user;
        var jwtToken = jwt.sign({someProp: 'a value'}, secret, jwtTokenOptions);

        res.json({authToken: jwtToken, user: req.user});

    };


    return {
        authorize: authorize,
        sendToken: sendToken,
        authenticate: passport.authenticate('local'),
        isAuthenticated: passport.authenticate('jwt-bearer')
    }

}