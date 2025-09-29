import Paper from "../models/paper.js";

// Create a new paper
export const createPaper = async (req, res) => {
  try {
    const { title, authors, abstract, journal, year, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Minimal fix: handle stringified JSON arrays or comma-separated strings
    let authorsArray = [];
    if (authors) {
      if (typeof authors === "string" && authors.trim().startsWith("["))
        authorsArray = JSON.parse(authors);
      else
        authorsArray = authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
    }

    let tagsArray = [];
    if (tags) {
      if (typeof tags === "string" && tags.trim().startsWith("["))
        tagsArray = JSON.parse(tags);
      else
        tagsArray = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    }

    const paperData = {
      title,
      authors: authorsArray,
      abstract,
      journal,
      year,
      tags: tagsArray,
      user: req.user._id, // owner
    };

    // Add uploaded file if exists
    if (req.file) {
      paperData.fileUrl = req.file.path;
    }

    const paper = await Paper.create(paperData);
    res.status(201).json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPapers = async (req, res) => {
  try {
    const { tag, author, journal } = req.query;
    const filter = {};

    if (tag) filter.tags = { $in: [tag] };
    if (author) filter.authors = { $regex: author, $options: "i" };
    if (journal) filter.journal = { $regex: journal, $options: "i" };

    // Fetch papers as plain JS objects
    const papers = await Paper.find(filter).lean();

    // Minimal normalization: ensure authors are arrays
    const normalizedPapers = papers.map((p) => ({
      ...p,
      authors: Array.isArray(p.authors)
        ? p.authors
        : p.authors
        ? JSON.parse(p.authors)
        : [],
    }));

    res.status(200).json(normalizedPapers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a paper by ID
export const getPaperByIdPublic = async (req, res) => {
  try {
    const paper = await Paper.findOne({ id: req.params.id }).select("-__v");
    if (!paper) return res.status(404).json({ message: "Paper not found" });
    res.status(200).json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a paper
export const updatePaper = async (req, res) => {
  try {
    const paper = await Paper.findOne({ id: req.params.id });
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    if (paper.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, authors, abstract, journal, year, tags } = req.body;

    paper.title = title || paper.title;
    paper.abstract = abstract || paper.abstract;
    paper.journal = journal || paper.journal;
    paper.year = year || paper.year;

    // Minimal fix: parse authors
    if (authors) {
      if (typeof authors === "string" && authors.trim().startsWith("["))
        paper.authors = JSON.parse(authors);
      else
        paper.authors = authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
    }

    // Minimal fix: parse tags
    if (tags) {
      if (typeof tags === "string" && tags.trim().startsWith("["))
        paper.tags = JSON.parse(tags);
      else
        paper.tags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
    }

    // Update file if uploaded
    if (req.file) {
      paper.fileUrl = req.file.path;
    }

    const updatedPaper = await paper.save();
    res.status(200).json(updatedPaper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a paper
export const deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findOne({ id: req.params.id });
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    if (paper.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await paper.deleteOne();
    res.status(200).json({ message: "Paper removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ******************************** NOTE ROUTES ********************************

// Add Note
export const addNoteToPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { text } = req.body;

    const paper = await Paper.findOne({ id: paperId });
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const note = {
      text,
      createdBy: req.user._id,
    };

    paper.notes.push(note);
    await paper.save();
    res.status(201).json(paper.notes[paper.notes.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Notes
export const getNotesForPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const paper = await Paper.findOne({ id: paperId }).populate(
      "notes.createdBy",
      "name email"
    );
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    res.status(200).json(paper.notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Note
export const deleteNoteFromPaper = async (req, res) => {
  try {
    const { paperId, noteId } = req.params;
    const paper = await Paper.findOne({ id: paperId });
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const note = paper.notes.id(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await note.deleteOne();
    await paper.save();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
