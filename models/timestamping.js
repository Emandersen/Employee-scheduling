const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeStamp = new Schema({
    email: { type: String, required: true },
    verified: { type: Boolean, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: false }
});

module.exports = mongoose.model("TimeStamp", timeStamp);
