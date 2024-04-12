const users = require('../models/user');
const bcrypt = require('bcrypt');

// function: check_credentials
// Parameters: email, password
// Returns: boolean
// Description: This function checks if the user's credentials are valid by comparing the email and
// password to the values stored in the database.
// If the user with the given email exists and the password matches, the function returns true.
// Otherwise, the function returns false.
// Example: check_credentials('[email]', '[password]')
async function check_credentials(email, password) {
    const user = await users.findOne({ email });
    if (user) {
        const match = await bcrypt.compare(password, user.password);
        return match;
    }
    return false;
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
        if (typeof next === 'function') {
            next();
        } else {
            return true;
        }
            
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

module.exports = {
    check_credentials,
    checkSession,
    checkSessionAndPermissions
};