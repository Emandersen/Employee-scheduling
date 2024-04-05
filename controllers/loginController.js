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

function checkSession(req, res) {
    if (req.session.user) {
        return true;
    } else {
        return false;
    }
};

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
    if (checkSession(req, res)) {
        res.redirect("/");
    } else {
        res.render("login", { title: "Login" });
    };
};

const POST_login = async function (req, res) {
    if (await check_credentials(req.body.email, req.body.password)) {
        User.findByEmail(req.body.email, function(err, user) {
            if (err) {
                res.redirect("/login");
            } else {
                req.session.user = user;
            }
        });

        res.redirect("/");
    } else {
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