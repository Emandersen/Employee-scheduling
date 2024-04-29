const express = require("express");
const bcrypt = require('bcrypt');
const { check_credentials, checkSession, checkSessionAndPermissions } = require("../functions/sessionHandler.js");
const User = require("../models/user");

const saltRounds = 10;

function GET_login(req, res) {
    if (req.session && req.session.user) {
        res.redirect("/");
    } else {
        res.render("login", { title: "Login" });
    }
};

async function POST_login(req, res) {
    if (await check_credentials(req.body.email, req.body.password)) {
        try {
            const user = await User.findOne({ email: req.body.email });
            req.session.user = user;
            res.redirect("/");
        } catch (err) {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

function GET_logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
};

function GET_register(req, res) {
    res.render('register', { title: 'Register', error: req.query.error, message: req.query.message });
};

async function POST_register(req, res) {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        res.redirect('/register?error=User already exists!');
        return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        department: req.body.department,
        preferences: req.body.preferences,
        permission: req.body.permission
    });

    await newUser.save();

    res.redirect('/register?message=User created successfully!');
};

async function GET_manage_users(req, res) {
    try {
        const accounts = await User.find({});
        res.render('manage_users', { title: 'Users', users: accounts });
    } catch (err) {
        console.error(err);
    }
};

async function GET_edit_user(req, res) {
    try {
        const user = await User.findOne({ email: req.params.email });
        res.render('edit_user', { title: 'Edit User', user: user });
    } catch (err) {
        console.error(err);
    }
};

async function POST_edit_user(req, res) {
    try {
        await User.findOneAndUpdate({ email: req.params.email }, { $set: req.body });
        res.redirect('/manage-users');
    } catch (err) {
        console.error(err);
    }
};

async function POST_delete_user(req, res) {
    try {
        await User.findOneAndDelete({ email: req.params.email });
        res.redirect('/manage-users');
    } catch (err) {
        console.error(err);
    }
};

async function POST_reset_password(req, res) {
    try {
        const hashedPassword = await bcrypt.hash("default123", saltRounds);
        await User.findOneAndUpdate({ email: req.params.email }, { password: hashedPassword });
        res.redirect('/manage-users');
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    checkSession,
    checkSessionAndPermissions,
    GET_login,
    POST_login,
    GET_logout,
    GET_register,
    POST_register,
    GET_manage_users,
    GET_edit_user,
    POST_edit_user,
    POST_delete_user,
    POST_reset_password
};