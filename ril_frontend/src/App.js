import React, { useState } from 'react';

function App() {
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:5000/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate, description }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(`Product created with ID: ${data.id}. Email sent successfully.`);
        setDueDate('');
        setDescription('');
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Product Due Date Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Due Date:</label><br />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Product Description:</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ width: '100%' }}
          />
        </div>

        <button type="submit" style={{ marginTop: 15 }} disabled={loading}>
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>

      {response && <p style={{ marginTop: 20 }}>{response}</p>}
    </div>
  );
}

export default App;
