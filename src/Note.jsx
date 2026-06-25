export default function Note({ note, onDelete, onOpen }) {
  const date = new Date();

  const formatted = date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="my-note" onClick={onOpen} style={{ cursor: "pointer" }}>
      <div className="note-top">
        <div
          className="note-delete"
          onClick={(e) => {
            e.stopPropagation(); // prevents modal from opening
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
        <div className="note-date">created: {formatted}</div>
      </div>
    </div>
  );
}
