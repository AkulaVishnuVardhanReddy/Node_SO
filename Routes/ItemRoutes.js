const express = require("express");
const { createItem, getItems, updateItem, deleteItem } = require("../Controllers/ItemsController");
const authenticateToken = require("../MiddleWares/AuthenticateToken");

const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');


const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.jwt_secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Forbidden' });
    }
};

router.get('/items', authenticate, async (req, res) => {
    const items = await pool.query('SELECT * FROM google_items WHERE google_users_id = $1', [
        req.user.id,
    ]);
    res.json(items.rows);
});

router.post('/items', authenticate, async (req, res) => {
    const { name, description } = req.body;
    const newItem = await pool.query(
        'INSERT INTO google_items (name, description, google_users_id) VALUES ($1, $2, $3) RETURNING *',
        [name, description, req.user.id]
    );
    res.json(newItem.rows[0]);
});

router.put('/items/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedItem = await pool.query(
        'UPDATE google_items SET name = $1, description = $2 WHERE id = $3 AND google_users_id = $4 RETURNING *',
        [name, description, id, req.user.id]
    );
    res.json(updatedItem.rows[0]);
});

router.delete('/items/:id', authenticate, async (req, res) => {
    await pool.query('DELETE FROM google_items WHERE id = $1 AND google_users_id = $2', [
        req.params.id,
        req.user.id,
    ]);
    res.json({ message: 'Item deleted' });
});


router.post("/", authenticateToken, createItem);
router.get("/", authenticateToken, getItems);
router.put("/:id", authenticateToken, updateItem);
router.delete("/:id", authenticateToken, deleteItem);

module.exports = router;
