const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const pgpool = require('../config/database.js');

module.exports.getUserById = function(id, callback){
    pgpool.query('SELECT * FROM users WHERE id=$1', [id], function(err, result) {
        if (err) {
            return callback(err, false);
        }
        const user = result.rows[0];
        if (user) {
            return callback(null, user);
        } else {
            return callback(null, false);
        }
    });
};

module.exports.getUserByUsername = function(username, callback){

    pgpool.query('SELECT * FROM users WHERE username=$1', [username], function(err, res) {
        if(err) throw err;

        if (res.rows.length > 0) {
            callback(null, res.rows[0]);
        } else {
            callback('no exist', null);
        }
    });
};

module.exports.addUser = function(name, email, username, password, callback){

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash){
            if(err) {
                callback(false, 'Password can not be decrypted!');
            } else {
                pgpool.query("INSERT INTO users(name, email, username, password) values($1, $2, $3, $4)", [name, email, username, hash], function(err, result) {
                    if (err) {
                        callback(false, 'Failed to register user');
                    } else {
                        callback(true, 'User registered');
                    }
                });
            }
        });
    });

};

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
};
