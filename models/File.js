const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },

  encryptedFileName: {
    type: String,
    required: true
  },

  filePath: {
    type: String,
    required: true
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  keywords: {
    type: [String],
    default: []
  },

  uploadDate: {
    type: Date,
    default: Date.now
  },
  storedFileName: {
  type: String,
},
});

module.exports = mongoose.model("File", fileSchema);