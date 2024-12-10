const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./Routes/AuthRoutes");
const itemRoutes = require("./Routes/ItemRoutes");

const app = express();

const passport = require('passport');
const cors = require('cors');
require('./config/passport');

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());


app.use("/auth", authRoutes);
app.use("/items", itemRoutes);

app.listen(process.env.port, () => {
    console.log(`Server running on port ${process.env.port}`);
});
