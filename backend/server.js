import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import paperRoutes from "./routes/paperRoutes.js"; // <-- imported paper routes

configDotenv();

const app = express();
const port = process.env.PORT || 8080; // using 8080 as you mentioned

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/papers", paperRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("root working");
});

// Start server after DB connects
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
  });
