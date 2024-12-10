const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./Routes/AuthRoutes");
const itemRoutes = require("./Routes/ItemRoutes");
const multer = require('multer');
const pool = require("./config/db")

const app = express();

const passport = require('passport');
const cors = require('cors');
require('./config/passport');

const storage = multer.memoryStorage();
const upload = multer({storage});

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());


app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

// Route to upload a file
app.post('/upload', upload.single('file'), async (req, res) => {
    const { originalname, size, buffer } = req.file;
    
    // Save file to PostgreSQL as BLOB
    try {
      const result = await pool.query(
        'INSERT INTO files (filename, size, file_data) VALUES ($1, $2, $3) RETURNING *',
        [originalname, size, buffer]
      );
      res.status(201).json({
        message: 'File uploaded successfully!',
        file: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  // Route to get all files
app.get('/files', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM files');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });
  
  

app.listen(process.env.port, () => {
    console.log(`Server running on port ${process.env.port}`);
});
