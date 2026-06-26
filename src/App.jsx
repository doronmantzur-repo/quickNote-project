import { Modal, Button } from "@mantine/core";
import { useState } from "react";
import { useEffect } from "react";
import "./styles.css";
import Note from "./Note";
import Select from "./Select";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  //handles the category in the add-note form
  const [newCategory, setNewCategory] = useState("");
  //handles the category in the selected note
  const [editCategory, setEditCategory] = useState("");

  const categoryColors = {
    home: "#ffb3b3",
    work: "#b3d1ff",
    shopping: "#b3ffb3",
    academy: "#ffe6b3",
  };

  useEffect(() => {
    const saved = localStorage.getItem("notes");

    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  function getFormattedDate() {
    const date = new Date();

    const formatted = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return formatted;
  }

  function updateLocalStorage(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function deleteNote(id) {
    const ok = window.confirm("Are you sure you want to delete your note?");
    if (!ok) return;
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
  }

  function addNote() {
    if (text.trim() === "") return;

    const newNote = {
      id: Date.now(),
      category: newCategory,
      created: getFormattedDate(),
      updated: null,
      title: title,
      content: text,
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    updateLocalStorage(updatedNotes);
    setText("");
    setTitle("");
    setNewCategory("");
  }

  function openNote(note) {
    setSelectedNote(note);
    setIsModalOpen(true);

    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
  }

  return (
    <div className="App">
      <div className="Form">
        <div className="add-note">
          <input
            id="title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            // value={person.name}
          />
          <Select onChange={setNewCategory} value={newCategory} />
          <textarea
            className="my-textarea"
            placeholder="Your note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button id="add-note" onClick={addNote}>
            Add
          </button>
        </div>
        <div className="notes">
          {notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onOpen={() => openNote(note)}
              onDropdownChange={(value) => {
                const updated = notes.map((n) =>
                  n.id === note.id ? { ...n, category: value } : n,
                );
                setNotes(updated);
                updateLocalStorage(updated);
              }}
              bcgColor={categoryColors[note.category]}
            />
          ))}
        </div>
      </div>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedNote?.title}
        centered
        size="auto"
        styles={{
          content: {
            backgroundColor: categoryColors[editCategory],
            padding: "20px",
            border: "2px solid black",
            borderRadius: "10px",
          },
          header: {
            backgroundColor: categoryColors[editCategory],
            // borderBottom: "2px solid black",
          },
          title: {
            color: "black",
            fontWeight: "bold",
            fontSize: "20px",
          },
        }}
      >
        <Select onChange={setEditCategory} value={editCategory} />
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid black",
            borderRadius: "5px",
          }}
        />

        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          style={{
            width: "100%",
            height: "150px",
            padding: "8px",
            border: "1px solid black",
            borderRadius: "5px",
            whiteSpace: "pre-wrap",
          }}
        />
        <Button
          color="blue"
          onClick={() => {
            const updated = notes.map((n) =>
              n.id === selectedNote.id
                ? {
                    ...n,
                    title: editTitle,
                    content: editContent,
                    category: editCategory,
                    updated: getFormattedDate(),
                  }
                : n,
            );

            setNotes(updated);
            updateLocalStorage(updated);
            setIsModalOpen(false);
          }}
        >
          Update
        </Button>
      </Modal>
    </div>
  );
}
