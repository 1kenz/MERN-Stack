const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheme = new Schema({
  categoryName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "created",
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  deletedDate: {
    type: Date,
  },
});

module.exports = Category = mongoose.model("Category", schema);
