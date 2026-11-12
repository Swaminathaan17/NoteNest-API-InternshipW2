const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const origins = (process.env.CLIENT_ORIGIN || "*").split(",").map((item) => item.trim());

app.use(helmet());
app.use(cors({
  origin: origins.includes("*") ? "*" : origins,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => res.status(200).json({
  success: true,
  message: "NoteNest API is running",
  version: "1.0.0"
}));
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
