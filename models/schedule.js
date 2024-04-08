const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personalSchema = new Schema({
      email: { type: String, required: true },
      date: { type: Date, required: true },
      workHours: { type: Number, required: true, maxLength: 3 },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      role: { type: String, required: true },
      department: { type: String, required: true },
      location: { type: String, required: true },
      released: { type: Boolean, required: true }
    });

module.exports = mongoose.model("Personal Schedule", personalSchema);

