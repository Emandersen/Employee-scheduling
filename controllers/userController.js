const express = require("express");
const users = require("../models/user");
const { check_credentials, checkSession, checkSessionAndPermissions } = require("../functions/sessionHandler.js");



// Login and logout functionality
function GET_login (req, res) {
    if (req.session && req.session.user) {
        res.redirect("/");
    } else {
        res.render("login", { title: "Login"});
    }
};

async function POST_login (req, res) {
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

function GET_logout (req, res, next) {
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


// Register functionality

function GET_register (req, res) {
    res.render('register', { title: 'Register', error: req.query.error, message: req.query.message });
};


async function POST_register (req, res) {
    // Check if the user already exists
    const user = await users.findOne({ email: req.body.email });
    if (user) {
        res.redirect('/register?error=User already exists!');
        return;
    }

    // Create the user
    const newUser = new users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password, // Remember to hash the password before saving it
        role: req.body.role,
        department: req.body.department,
        preferences: req.body.preferences,
        permission: req.body.permission
    });


    await newUser.save();

    res.redirect('/register?message=User created successfully!');
};


// User management functionality
async function GET_manage_users (req, res) {
    try {
        const accounts = await users.find({});
        res.render('manage_users', { title: 'Users', users: accounts});
    } catch (err) {
        console.log(err);
    }
};

async function GET_edit_user(req, res) {
    try {
        const user = await users.findOne({ email: req.params.email });
        res.render('edit_user', { title: 'Edit User', user: user });
    } catch (err) {
        console.log(err);
    }
};

async function POST_edit_user(req, res) {
    try {
        await users.findOneAndUpdate({ email: req.params.email }, { $set: req.body });
        res.redirect('/manage-users');
    } catch (err) {
        console.log(err);
    }
};

async function POST_delete_user(req, res) {
    try {
        await users.findOneAndDelete({ email: req.params.email });
        res.redirect('/manage-users');
    } catch (err) {
        console.log(err);
    }
};

async function POST_reset_password(req, res) {
    try {
        await users.findOneAndUpdate({ email: req.params.email }, { password: "default123" });
        res.redirect('/manage-users');
    } catch (err) {
        console.log(err);
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