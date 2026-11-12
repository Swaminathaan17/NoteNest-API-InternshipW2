const express = require("express");
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/noteController");

const router = express.Router();
router.use(auth);
router.route("/").post(controller.createNote).get(controller.getNotes);
router.route("/:id").get(controller.getNote).patch(controller.updateNote).delete(controller.deleteNote);
module.exports = router;
