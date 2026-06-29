import { Modal, Button } from "@mantine/core";
import { useEffect, useState, useRef  } from "react";
import "./styles.css";
import Note from "./Note";
import Select from "./Select";

export default function App() {
  const textAreaRef = useRef(null);

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilterdtNotes] = useState(notes);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const [filter, setFilter] = useState("");
  const [categoryfilter, setCategoryFilter] = useState("");
  const [filterChecked, setIsChecked] = useState(false);

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

  useEffect(() => {
    if (textAreaRef.current) {
      const ta = textAreaRef.current;
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, [text]);

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
    applyFilters(filter, categoryfilter);
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

  function applyFilters(newFilter = filter, newCategory = categoryfilter) {
    let result = notes;

    if (filterChecked) {
      if (newFilter) {
        result = result.filter(
          (n) =>
            n.title.toLowerCase().includes(newFilter.toLowerCase()) ||
            n.content.toLowerCase().includes(newFilter.toLowerCase()),
        );
      }

      if (newCategory) {
        result = result.filter((n) => n.category === newCategory);
      }
    }

    setFilterdtNotes(result);
  }

  function updateFilter(isChecked) {
    if (isChecked === false) {
      setCategoryFilter("");
      setFilter("");
      setNotes(notes);
    } else {
      applyFilters(filter, categoryfilter);
    }
  }

  return (
    <div className="App">
      <div className="Form">
        <div className="add-note">
          <input
            id="title-input"
            placeholder="Title"
            value={title}
            disabled={filterChecked}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            onChange={setNewCategory}
            value={newCategory}
            disabled={filterChecked}
          />
          <textarea
            ref={textAreaRef}
            className="my-textarea"
            placeholder="Your note..."
            value={text}
            disabled={filterChecked}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button id="add-note" disabled={filterChecked} onClick={addNote}>
            Add
          </button>
          <div className="horizontal-line"></div>
          <div className="my-filter">
            <input
              type="checkbox"
              checked={filterChecked}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setIsChecked(isChecked);
                updateFilter(isChecked);
              }}
            />
            <input
              id="filter-input"
              placeholder="Filter..."
              value={filter}
              readOnly={!filterChecked}
              onChange={(e) => {
                setFilter(e.target.value);
                applyFilters(e.target.value, categoryfilter);
              }}
            />
            <Select
              value={categoryfilter}
              disabled={!filterChecked}
              onChange={(value) => {
                setCategoryFilter(value);
                applyFilters(filter, value);
              }}
            />
          </div>
        </div>
        <div className="notes">
          {(filterChecked ? filteredNotes : notes).map((note) => (
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
        <Select
          onChange={setEditCategory}
          value={editCategory}
          disabled={false}
        />
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
            applyFilters(filter, categoryfilter);
            setIsModalOpen(false);
          }}
        >
          Update
        </Button>
      </Modal>
    </div>
  );
}