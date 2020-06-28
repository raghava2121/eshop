const User = require('../models/user')
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    console.log(' req.body', req.body);
    const user = new User(req.body)
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        })
    })
};

exports.signin = (req, res) => {
    const { email, password } = req.body

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                err: 'User with email address doesnt exists. Please signup'
            })
        }
        // if user found makse sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(400).json({
                err: 'Email and Password dont match'
            })
        }
        // generate signed token with userid and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist th etoken as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 })
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } })

    })
}

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({ message: 'signout success!!' })
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    const user = req.profile && req.auth && req.profile._id == req.auth._id

    if (!user) {
        return res.status(403).json({
            error: 'Acceess Denied!'
        })
    }
    next();

};


exports.isAdmin = (req, res, next) => {

    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin role : Acceess Denied!'
        })
    }
    next();

};