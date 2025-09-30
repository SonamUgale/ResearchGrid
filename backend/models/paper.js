import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const paperSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  authors: [
    {
      type: String,
      trim: true,
    },
  ],
  abstract: {
    type: String,
  },
  journal: {
    type: String,
  },
  year: {
    type: Number,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notes: [noteSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

paperSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Paper = mongoose.model("Paper", paperSchema);
export default Paper;
