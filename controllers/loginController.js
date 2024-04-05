const express = require("express");
const router = express.Router();
const users = require("../models/user");

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

function checkSessionAndPermissions(req, res, entryperm, permission) {
    if (checkSession(req, res)) {
        if (req.session.user.permission & (entryperm <= permission)) {
            return true;
        } else {
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

const GET_logout = function (req, res) {
    if (checkSession(req, res)) {
        req.session.destroy();
        res.redirect("/login");
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