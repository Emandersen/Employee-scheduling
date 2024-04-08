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
        if (req.session.user && (entryperm <= req.session.user.permission)) {
            next();
        } else {
            res.redirect("/");
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



// function: GET_register
// Parameters: req, res
// Returns: void
// Description: This function is called when the user navigates to the registration page. It renders the registration page with the title "Register".
// If there is an error message or success message in the query parameters, it is passed to the view to be displayed to the user.
const GET_register = function (req, res) {
    res.render('register', { title: 'Register', error: req.query.error, message: req.query.message });
};

// function: POST_register
// Parameters: req, res
// Returns: void
// Description: This function is called when the user submits the registration form. It checks if the user already exists, and if not, creates a new user with the provided information.
// The user's password is stored as plain text, which is not secure. In a real application, the password should be hashed before saving it to the database.
// The user's permissions are stored as an integer, where each bit represents a permission. The permissions are as follows:
// 0 - can view schedule
// 1 - can create/edit schedule
// 2 - can create/edit users
// The permission level is set based on the user's role.
// If the user is successfully created, a success message is displayed to the user.
// If the user already exists, an error message is displayed.
// The user is then redirected back to the registration page.
// If there is an error, the error message is displayed to the user.
// The user is then redirected back to the registration page.
const POST_register = async function (req, res) {
    // Check if the user already exists
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
        res.redirect('/register?error=User already exists!');
        return;
    }

    // Create the user
    const newUser = new userModel({
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



module.exports = {
    checkSession,
    checkSessionAndPermissions,
    GET_login,
    POST_login,
    GET_logout,
    GET_register,
    POST_register
};