const mongoose = require("mongoose");

const Config = mongoose.Schema;

// name: "my-session",
//             executorMemory: "1G",
//             executorCores: 1,
//             numExecutors: 1,
//             driverMemory: "1G",

const configSchema = new Config({
  createdby: { type: String },
  name: { type: String, required: true },
  executorMemory: { type: String, required: true },
  executorCores: { type: Number, required: true },
  numExecutors: { type: Number, required: true },
  driverMemory: { type: String, required: true },
});

module.exports = mongoose.model("Config", configSchema);
