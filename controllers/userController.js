const express = require("express");
const users = require("../models/user.js");


// function: check_credentials
// Parameters: email, password
// Returns: boolean
// Description: This function checks if the provided email and password match a user in the database.
// If a user is found with the provided email and password, the function returns true.
// Otherwise, the function returns false.
// The function is asynchronous, so it returns a promise that resolves to a boolean value.
// Example: check_credentials('[email protected]', 'password123')
async function check_credentials(email, password) {
    const user = await users.findOne({ email });
    return user && user.password === password;
}

// function: checkSession
// Parameters: req, res, next
// Returns: void
// Description: This function checks if the user is logged in by checking 
// if the user object is present in the session.
// If the user is logged in, the function calls the next middleware function.
// If the user is not logged in, the function redirects the user to the login page.
// Example: checkSession(req, res, next)
function checkSession(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

// function: checkSessionAndPermissions
// Parameters: entryperm
// Returns: function
// Description: This function returns a middleware function that checks if the user is logged in and
//  has the required permissions to access a route.
// The middleware function takes the request, response, and next function as parameters.
// If the user is logged in and has the required permissions, the middleware calls the next function.
// If the user is not logged in or does not have the required permissions, the middleware redirects the user to the home page.
// Example: app.get('/admin', checkSessionAndPermissions(2), function(req, res) { ... });
function checkSessionAndPermissions(entryperm) {
    return function(req, res, next) {
        if (req.session.user && (entryperm <= req.session.user.permission)) {
            next();
        } else {
            res.redirect("/");
        }
    } 
};

// function: GET_login
// Parameters: req, res
// Returns: void
// Description: This function is called when the user navigates to the login page. It checks if the user is already logged in, and if so, redirects the user to the home page.
// If the user is not logged in, the function renders the login page with the title "Login".
// Example: GET_login(req, res)
function GET_login (req, res) {
    if (req.session && req.session.user) {
        res.redirect("/");
    } else {
        res.render("login", { title: "Login", permission: req.session.user.permission});
    }
};

// function: POST_login
// Parameters: req, res
// Returns: void
// Description: This function is called when the user submits the login form. 
// It checks if the user's credentials are valid by calling the check_credentials function.
// If the credentials are valid, the function finds the user in the database and sets the user object in the session.
// The function then redirects the user to the home page.
// If the credentials are invalid, the function redirects the user to the login page.
// Example: POST_login(req, res)
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

// function: GET_logout
// Parameters: req, res, next
// Returns: void
// Description: This function is called when the user navigates to the logout page. 
// It destroys the user's session and redirects the user to the login page.
// If the user is not logged in, the function redirects the user to the home page.
// Example: GET_logout(req, res, next)
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



// function: GET_register
// Parameters: req, res
// Returns: void
// Description: This function is called when the user navigates to the registration page. 
// It renders the registration page with the title "Register".
// If there is an error message or success message in the query parameters, 
// it is passed to the view to be displayed to the user.
function GET_register (req, res) {
    res.render('register', { title: 'Register', error: req.query.error, message: req.query.message, permission: req.session.user.permission });
};

// function: POST_register
// Parameters: req, res
// Returns: void
// Description: This function is called when the user submits the registration form. 
// It checks if the user already exists, and if not, creates a new user with the provided information.
// The user's password is stored as plain text, which is not secure. 
// In a real application, the password should be hashed before saving it to the database.
// The user's permissions are stored as an integer, where each bit represents a permission. 
// The permissions are as follows:
// 0 - can view schedule
// 1 - can create/edit schedule
// 2 - can create/edit users
// The permission level is set based on the user's role.
// If the user is successfully created, a success message is displayed to the user.
// If the user already exists, an error message is displayed.
// The user is then redirected back to the registration page.
// If there is an error, the error message is displayed to the user.
// The user is then redirected back to the registration page.
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



module.exports = {
    checkSession,
    checkSessionAndPermissions,
    GET_login,
    POST_login,
    GET_logout,
    GET_register,
    POST_register
};