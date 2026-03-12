import { useState, useEffect } from 'react';

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');

  // Fetch notes when page loads
  useEffect(() => {
    fetch('http://localhost:4000/api/notes')
      .then(r => r.json())
      .then(setNotes);
  }, []);

  // Add a new note
  const addNote = async () => {
    if (!text.trim()) return;
    const res = await fetch('http://localhost:4000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const note = await res.json();
    setNotes([note, ...notes]);
    setText('');
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>📝 My Notes App</h1>
      <div>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a note..."
          style={{ width: '75%', padding: '8px', fontSize: '16px' }}
        />
        <button
          onClick={addNote}
          style={{ padding: '8px 16px', marginLeft: '8px', fontSize: '16px' }}
        >
          Add
        </button>
      </div>
      <ul style={{ marginTop: '20px' }}>
        {notes.map(n => (
          <li key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            {n.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;