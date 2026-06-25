import { Modal, Button } from "@mantine/core";
import { useState } from "react";
import "./styles.css";
import Note from "./Note";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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

  function deleteNote(id) {
    const ok = window.confirm("Are you sure you want to delete your note?");
    if (!ok) return;
    setNotes(notes.filter((note) => note.id !== id));
  }

  function addNote() {
    if (text.trim() === "") return;

    const newNote = {
      id: Date.now(),
      created: getFormattedDate(),
      updated: null,
      title: title,
      content: text,
    };

    setNotes([...notes, newNote]);
    console.log(notes);
    setText("");
    setTitle("");
  }

  function openNote(note) {
    setSelectedNote(note);
    setIsModalOpen(true);

    setEditTitle(note.title);
    setEditContent(note.content);
  }

  return (
    <div className="App">
      <div className="Form">
        <div className="add-note">
          <input
            id="title-input"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            // value={person.name}
          />
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
            backgroundColor: "yellow",
            padding: "20px",
            border: "2px solid black",
            borderRadius: "10px",
          },
          header: {
            backgroundColor: "yellow",
            // borderBottom: "2px solid black",
          },
          title: {
            color: "black",
            fontWeight: "bold",
            fontSize: "20px",
          },
        }}
      >
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
                ? { ...n, title: editTitle, content: editContent, updated: getFormattedDate() }
                : n,
            );

            setNotes(updated);
            setIsModalOpen(false);
          }}
        >
          Update
        </Button>
      </Modal>
    </div>
  );
}
