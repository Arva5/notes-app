const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Retry connecting to DB up to 10 times
async function connectWithRetry(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('✅ Connected to database');
      return;
    } catch (err) {
      console.log(`⏳ Waiting for DB... attempt ${i + 1}/${retries}`);
      await new Promise(res => setTimeout(res, 2000)); // wait 2 seconds
    }
  }
  throw new Error('❌ Could not connect to database after multiple attempts');
}

app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query(
      'INSERT INTO notes (text) VALUES ($1) RETURNING *', [text]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to DB first, then start server
connectWithRetry()
  .then(() => {
    app.listen(4000, () => console.log('🚀 Backend running on port 4000'));
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });