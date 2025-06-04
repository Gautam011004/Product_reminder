const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

const db = mysql.createConnection({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'gQXaAXkdIKikTLPMRmTJeNYSRKhFkCxg',
  database: 'railway',
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'divyagautam326@gmail.com',
    pass: 'congoaruyvpuwnqu',
  },
});

app.post('/api/product', (req, res) => {
  const { dueDate, description } = req.body;

  if (!dueDate || !description) {
    return res.status(400).json({ error: 'Due date and description required' });
  }

  const id = Math.random().toString(36).substring(2, 10);

  const sql = 'INSERT INTO products (id, dueDate, description) VALUES (?, ?, ?)';
  db.query(sql, [id, dueDate, description], (err) => {
    if (err) {
      console.error('DB insert error:', err);
      return res.status(500).json({ error: 'Failed to save product in DB' });
    }

    const mailOptions = {
      from: 'divyagautam326@gmail.com',
      to: '2230169@kiit.ac.in',
      subject: `Product Due Date Notification: ID ${id}`,
      text: `Product Description: ${description}\nDue Date: ${dueDate}\nProduct ID: ${id}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ error: 'Failed to send email' });
      }
      console.log('Email sent:', info.response);
      return res.json({ id, message: 'Product saved in DB and email sent' });
    });
  });
});

app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
