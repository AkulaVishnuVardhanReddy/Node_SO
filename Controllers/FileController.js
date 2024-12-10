const pool = require('../config/db');


exports.uploadFile = async (req, res) => {
    const { originalname, size, buffer } = req.file;

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
};

exports.getAllFiles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM files');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

exports.deleteFile = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM files WHERE id = $1 RETURNING *', [id]);

        if (!result.rows[0]) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.status(200).json({ message: 'File deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete file' });
    }
};
