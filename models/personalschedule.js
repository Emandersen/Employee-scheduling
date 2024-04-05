const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalSchema = new Schema({
      personal_id: { type: String, required: true },
      date: { type: date, required: true },
      workHours: { type: String, required: true, maxLength: 3 },
      startTime: { type: date, required: true },
      endTime: { type: date, required: true },
      role: { type: String, required: true },
      department: { type: String, required: true },
      location: { type: String, required: true },
      released: { type: Boolean, required: true }
    });

module.exports = mongoose.model("Personal Schedule", personalSchema);