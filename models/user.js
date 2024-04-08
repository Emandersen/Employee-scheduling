const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    department: {type: String, required: true},
    preferences: {type: Array, required: false},
    // Permissions are stored as an integer, where each bit represents a permission.
    // The permissions are as follows:
    // 0 - can view schedule
    // 1 - can create/edit schedule
    // 2 - can create/edit users
    permission: {type: Number, required: true},
});

userSchema.pre("save", function (next) {
    const user = this;
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                throw saltError;
            } else {
                bcrypt.hash(password2, salt, function(hashError, hash) {
                    if (hashError) {
                        throw hashError;
                    }
                    
                    user.password = hash;
                    next();
                })
            }
        })
    } else {
        return next();
    }
})

module.exports = mongoose.model('User', userSchema);