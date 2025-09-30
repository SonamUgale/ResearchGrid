import express from "express";
import multer from "multer";
import { storage } from "../cloudConfig.js";
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
const upload = multer({ storage });

// Root route
router
  .route("/")
  .get(getAllPapers)
  .post(protect, upload.single("file"), createPaper);

// Single paper route
router
  .route("/:id")
  .get(getPaperByIdPublic)
  .put(protect, upload.single("file"), updatePaper)
  .delete(protect, deletePaper);

// *************** Notes Routes **************
router
  .route("/:paperId/notes")
  .post(protect, addNoteToPaper)
  .get(getNotesForPaper);

router.route("/:paperId/notes/:noteId").delete(protect, deleteNoteFromPaper);

export default router;
