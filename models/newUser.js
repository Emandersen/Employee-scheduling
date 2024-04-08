const userModel = require("./models/user.js");

module.exports = {
    createANewUser: function(firstName, lastName, email, password, role, department, preferences, permission, callback) {
        const newUserDBDocument = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            role: role,
            department: department,
            preferences: preferences,
            permission: permission
        })

        newUserDBDocument.save(function(error) {
            if (error) {
                callback({error: true})
            } else {
                callback({success: true})
            }
        })
    }
}

module.exports = {
    loginUser: function(firstName, lastName, email, password, role, department, preferences, permission, callback) {
        userModel.findone({email: email}).exec(function(error, user) {
            if (error) {
                callback({error: true})
            } else if (!user) {
                callback({error: true})
            } else {
                user.comparePassword(password, function(matchError, isMatch) {
                    if (matchError) {
                        callback({error: true})
                    } else if (!isMatch) {
                        callback({error: true})
                    } else {
                        callback({success: true})
                    }
                })
            }
        })
    }
}