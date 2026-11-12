const mongoose = require("mongoose");
const Note = require("../models/Note");

const validateFields = (body, partial = false) => {
  const keys = Object.keys(body);
  if (keys.some((key) => !["title", "content"].includes(key))) return "Only title and content can be changed";
  if (!partial && (!("title" in body) || !("content" in body))) return "Title and content are required";
  if (!keys.length) return "At least one field is required";
  if ("title" in body && (typeof body.title !== "string" || !body.title.trim() || body.title.trim().length > 120)) {
    return "Title must be a non-empty string of at most 120 characters";
  }
  if ("content" in body && (typeof body.content !== "string" || body.content.trim().length > 20000)) {
    return "Content must be a string of at most 20000 characters";
  }
  return null;
};

const createNote = async (req, res, next) => {
  try {
    const error = validateFields(req.body);
    if (error) return res.status(400).json({ success: false, message: error });
    const note = await Note.create({
      title: req.body.title.trim(),
      content: req.body.content.trim(),
      user: req.user.id
    });
    return res.status(201).json({ success: true, note });
  } catch (error) { next(error); }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, count: notes.length, notes });
  } catch (error) { next(error); }
};

const getNote = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid note ID" });
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    return res.status(200).json({ success: true, note });
  } catch (error) { next(error); }
};

const updateNote = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid note ID" });
    const error = validateFields(req.body, true);
    if (error) return res.status(400).json({ success: false, message: error });
    const updates = {};
    if ("title" in req.body) updates.title = req.body.title.trim();
    if ("content" in req.body) updates.content = req.body.content.trim();
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    return res.status(200).json({ success: true, note });
  } catch (error) { next(error); }
};

const deleteNote = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid note ID" });
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    return res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) { next(error); }
};

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };
