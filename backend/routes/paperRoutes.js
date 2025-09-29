import express from "express";
import multer from "multer";
import { storage } from "../cloudConfig.js"; // Import storage
import { protect } from "../middleware/authMiddleware.js";

import {
  addNoteToPaper,
  getNotesForPaper,
  deleteNoteFromPaper,
  createPaper,
  getAllPapers,
  getPaperByIdPublic,
  updatePaper,
  deletePaper,
} from "../controllers/paperController.js";

const router = express.Router();
const upload = multer({ storage }); // Initialize Multer

// Root route
router
  .route("/")
  .get(getAllPapers) // Public
  .post(protect, upload.single("file"), createPaper); // Private, optional file

// Single paper route
router
  .route("/:id")
  .get(getPaperByIdPublic) // Public
  .put(protect, upload.single("file"), updatePaper) // Private, optional file
  .delete(protect, deletePaper); // Private

// ---------- Notes Routes ----------
router
  .route("/:paperId/notes")
  .post(protect, addNoteToPaper) // Add note
  .get(getNotesForPaper); // Get all notes

router.route("/:paperId/notes/:noteId").delete(protect, deleteNoteFromPaper); // Delete note

export default router;
