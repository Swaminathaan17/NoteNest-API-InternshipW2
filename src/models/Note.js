const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 1, maxlength: 120 },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
}, { timestamps: true });

noteSchema.index({ user: 1, updatedAt: -1 });
module.exports = mongoose.model("Note", noteSchema);
