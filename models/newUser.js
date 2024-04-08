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
