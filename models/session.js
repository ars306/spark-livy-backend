const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  createdby: { type: String },
  sessionId: { type: Number, required: true },
});

module.exports = mongoose.model("Session", sessionSchema);
