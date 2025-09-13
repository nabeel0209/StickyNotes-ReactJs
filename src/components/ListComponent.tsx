import "./ListComponent.css";
import React, { useState, useEffect } from "react";

function NotesComponent() {
  type Note = {
    id: number;
    content: string;
    x: number;
    y: number;
  };

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("stickyNotes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      content: "",
      x: 100,
      y: 100,
    };

    setNotes([...notes, newNote]);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleDrag = (
    id: number,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();

    // Find the note element
    const noteElement = (e.target as HTMLElement).closest(
      ".note"
    ) as HTMLElement;
    if (!noteElement) return;

    const rect = noteElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const onMouseMove = (moveEvent: MouseEvent) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === id
            ? {
                ...note,
                x: moveEvent.clientX - offsetX,
                y: moveEvent.clientY - offsetY,
              }
            : note
        )
      );
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      <span>Project : Sticky Notes - React.Js</span>
      <button className="add-note" onClick={addNote}>
        + Add Note
      </button>
      <div className="notes-container">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note"
            style={{ left: note.x, top: note.y }}
          >
            <button className="delete" onClick={() => deleteNote(note.id)}>
              ×
            </button>
            <textarea
              value={note.content}
              onChange={(e) => {
                setNotes(
                  notes.map((n) =>
                    n.id === note.id ? { ...n, content: e.target.value } : n
                  )
                );
              }}
            />
            <button
              className="move-icon"
              onMouseDown={(e) => handleDrag(note.id, e)}
            >
              ☰
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default NotesComponent;
