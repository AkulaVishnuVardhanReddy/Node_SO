const pool = require("../config/db");

const createItem = async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO items(name, description, users_id) VALUES($1, $2, $3) RETURNING *",
            [name, description, req.user.userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM items WHERE users_id = $1", [req.user.userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateItem = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            "UPDATE items SET name = $1, description = $2 WHERE id = $3 AND users_id = $4 RETURNING *",
            [name, description, id, req.user.userId]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteItem = async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query("DELETE FROM items WHERE id = $1 AND users_id = $2", [id, req.user.userId]);
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createItem, getItems, updateItem, deleteItem };
