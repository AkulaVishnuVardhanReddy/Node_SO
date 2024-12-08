const express = require("express");
const { createItem, getItems, updateItem, deleteItem } = require("../Controllers/ItemsController");
const authenticateToken = require("../MiddleWares/AuthenticateToken");

const router = express.Router();

router.post("/", authenticateToken, createItem);
router.get("/", authenticateToken, getItems);
router.put("/:id", authenticateToken, updateItem);
router.delete("/:id", authenticateToken, deleteItem);

module.exports = router;
