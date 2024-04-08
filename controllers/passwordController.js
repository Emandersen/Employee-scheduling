//Do not use with out proper authication
//https://coderrocketfuel.com/article/store-passwords-in-mongodb-with-node-js-mongoose-and-bcrypt

const bcrypt = require("bcryptjs");

const userPassword = require("../models/user");

// async function GET_password_user(req, res) {
//     const code = await userPassword.find({password: req.session.user.password})
//     res.render('password', {title: 'Password', password: code})
// }

const password = userPassword.password;
const saltRounds = 10;

const password2 = password.toString();

bcrypt.genSalt(saltRounds, function (saltError, salt) {
    if (saltError) {
        throw saltError;
    } else {
        bcrypt.hash(password2, salt, function(hashError, hash) {
            if (hashError) {
                throw hashError;
            } else {
                console.log(hash);
                //Should show a lot of extra characters as the password
            }
        })
    }
})


// module.exports = {
//     GET_password_user
// }