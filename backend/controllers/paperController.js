import Paper from "../models/paper.js";

export const createPaper = async (req, res) => {
  try {
    const { title, authors, abstract, journal, year, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Convert comma-separated strings to arrays
    const authorsArray = authors
      ? authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean)
      : [];
    const tagsArray = tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

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

    console.log("Filter applied:", filter);

    const papers = await Paper.find(filter);
    console.log("Papers found:", papers);

    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaperByIdPublic = async (req, res) => {
  try {
    const paper = await Paper.findOne({ id: req.params.id }).select("-__v");

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    res.status(200).json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    // Convert authors/tags to arrays if provided
    if (authors) {
      paper.authors = authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
    }
    if (tags) {
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

//************************************NOTE ROUTES*********************************** */

// Add Note to Paper
export const addNoteToPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { text } = req.body;

    // Use findOne with UUID instead of findById
    const paper = await Paper.findOne({ id: paperId });
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const note = {
      text,
      createdBy: req.user._id,
    };

    paper.notes.push(note);
    await paper.save();

    // Return the newly added note (last in array)
    res.status(201).json(paper.notes[paper.notes.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Notes for Paper
export const getNotesForPaper = async (req, res) => {
  try {
    const { paperId } = req.params;

    // Use findOne with UUID instead of findById
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

// Delete Note from Paper
export const deleteNoteFromPaper = async (req, res) => {
  try {
    const { paperId, noteId } = req.params;

    // Use findOne with UUID instead of findById
    const paper = await Paper.findOne({ id: paperId });
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const note = paper.notes.id(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Only the creator can delete
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await note.deleteOne(); // remove the embedded subdocument
    await paper.save();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
