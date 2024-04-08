const userModel = require('../models/user.js');
const express = require('express');
const router = express.Router();

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
        res.redirect('/register?error=User already exists');
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
    GET_register,
    POST_register
};