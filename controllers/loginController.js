const express = require("express");
const users = require("../models/user.js");

async function check_credentials(email, password) {
    try {
        const user = await users.findOne({ email: email });
        if (user && user.password === password) {
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function checkSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

function checkSessionAndPermissions(entryperm) {
    return function(req, res, next) {
        if (checkSession(req, res, next)) { // pass next to checkSession
            if (req.session.user && (entryperm <= req.session.user.permission)) {
                next();
            } else {
                res.status(403).send('Insufficient permissions');
                return false;
            }
        } else {
            res.status(401).send('Not authenticated');
            return false;
        }
    }
};

const GET_login = function (req, res) {
    if (req.session && req.session.user) {
        res.redirect("/");
    } else {
        res.render("login", { title: "Login" });
    }
};

const POST_login = async function (req, res) {
    console.log('Attempting to log in with email:', req.body.email);
    if (await check_credentials(req.body.email, req.body.password)) {
        console.log('Credentials are valid, trying to find user in database');
        try {
            const user = await users.findOne({ email: req.body.email });
            console.log('User found, setting session user:', user);
            req.session.user = user;
            console.log('Redirecting to home page');
            res.redirect("/");
        } catch (err) {
            console.log('Error occurred while finding user:', err);
            res.redirect("/login");
        }
    } else {
        console.log('Invalid credentials, redirecting to login page');
        res.redirect("/login");
    }
};

const GET_logout = function (req, res, next) {
    if (req.session && req.session.user) {
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.redirect("/login");
        });
    } else {
        res.redirect("/");
    }
};

module.exports = {
    checkSession,
    checkSessionAndPermissions,
    GET_login,
    POST_login,
    GET_logout
};