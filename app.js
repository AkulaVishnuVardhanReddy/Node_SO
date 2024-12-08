const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./Routes/AuthRoutes");
const itemRoutes = require("./Routes/ItemRoutes");

const app = express();

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

app.listen(process.env.port, () => {
    console.log(`Server running on port ${process.env.port}`);
});
