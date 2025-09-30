import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddPaper.css";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

function AddPaper({ token, onNewPaper }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [journal, setJournal] = useState("");
  const [year, setYear] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !authors || !abstract) {
      toast.error("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append(
      "authors",
      JSON.stringify(authors.split(",").map((a) => a.trim()))
    );
    formData.append("abstract", abstract);
    formData.append("journal", journal);
    formData.append("year", year);

    formData.append(
      "tags",
      JSON.stringify(
        tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== "")
      )
    );
    if (file) formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/api/papers`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onNewPaper(res.data);
      toast.success("Paper added successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add paper");
    }
  };

  return (
    <div className="add-paper-wrapper">
      <h2>Add New Paper</h2>
      <form className="add-paper-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Authors"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          required
        />
        <textarea
          placeholder="Abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Journal"
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <label className="file-upload">
          {file ? file.name : "Click or drag to upload PDF"}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <button type="submit">Add New Paper</button>
      </form>
    </div>
  );
}

export default AddPaper;
