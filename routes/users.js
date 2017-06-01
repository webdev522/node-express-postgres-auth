const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

// Register
router.post('/register', function(req, res, next){

    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, function(err, user) {
        if (user) {
            return res.json({success: false, msg: 'Username has already been taken'});
        } else {
            User.addUser(name, email, username, password, function(successValue, msgValue) {
                res.json({success: successValue, msg: msgValue});
            });
        }
    });
});

// Authenticate
router.post('/authenticate', function(req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, function(err, user) {
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        } else {
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (isMatch) {
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: 604800
                    });

                    res.json({
                        success: true,
                        token: 'JWT '+token,
                        user: {
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    });
                } else {
                    return res.json({success: false, msg: 'Wrong password'});
                }
            });
        }
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), function(req, res, next){
    res.json({user: req.user});
});


module.exports = router;
