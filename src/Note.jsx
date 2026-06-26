import Select from "./Select";

export default function Note({
  note,
  onDelete,
  onOpen,
  onDropdownChange,
  bcgColor,
}) {
  const isUpdated = note.updated != null;
  return (
    <div
      className="my-note"
      onClick={onOpen}
      style={{
        cursor: "pointer",
        backgroundColor: bcgColor,
      }}
    >
      <div className="note-top">
        <Select
          onChange={(value) => {
            // e.stopPropagation();
            onDropdownChange(value);
          }}
          value={note.category}
        />
        <div
          className="note-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          style={{ cursor: "pointer" }}
        >
          X
        </div>
      </div>
      <div className="note-body">
        <div className="note-title">{note.title}</div>
        <div className="note-content">{note.content}</div>
      </div>
      <div className="note-bottom">
        <div className="note-date">created: {note.created}</div>
        {isUpdated && <div className="note-date">updated: {note.updated}</div>}
      </div>
    </div>
  );
}
