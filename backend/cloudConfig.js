import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Keep original extension
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});

export { storage };
