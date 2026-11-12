require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  await connectDB();
  app.listen(PORT, () => console.log(`NoteNest API running on port ${PORT}`));
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
