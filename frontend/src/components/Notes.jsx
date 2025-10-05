import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import "./Notes.css";


function Notes({ paperId, token, currentUser }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch notes for the paper
  useEffect(() => {
    if (!paperId) return;
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/papers/${paperId}/notes`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setNotes(res.data.reverse());
      } catch (err) {
        console.error(err);
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [paperId, token]);

  // Add a new note
  const handleAddNote = async () => {
    if (!currentUser || !token) {
      toast.info("Please log in to add a note!");
      return;
    }
    if (!newNote.trim()) {
      toast.error("Note cannot be empty!");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/api/papers/${paperId}/notes`,
        { text: newNote.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([res.data, ...notes]);
      setNewNote("");
      toast.success("Note added!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add note");
    }
  };

  // Delete a note
  const handleDelete = async (noteId, authorId) => {
    if (!currentUser || currentUser._id !== authorId) {
      toast.error("You are not allowed to delete this note!");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/papers/${paperId}/notes/${noteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(notes.filter((n) => n._id !== noteId));
      toast.success("Note deleted!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div className="notes-section">
      <h3 className="notes-heading">Notes</h3>

      <textarea
        className="note-input"
        placeholder="Write your note here..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
      <button className="add-note-btn" onClick={handleAddNote}>
        Add Note
      </button>

      <div className="notes-list">
        {loading && <p className="msg">Loading notes...</p>}
        {!loading && notes.length === 0 && <p className="msg">No notes yet.</p>}
        {!loading &&
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <p className="note-text">{note.text}</p>
              <div className="note-footer">
                <span className="note-author">
                  @{note.createdBy?.name || "Unknown"}
                </span>
                {currentUser && currentUser._id === note.createdBy?._id && (
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDelete(note._id, note.createdBy._id)}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Notes;
