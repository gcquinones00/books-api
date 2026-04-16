// index.js
const express = require("express");
require("dotenv").config();

const { requireApiKey } = require("./middleware/auth.middleware");
const booksRoutes = require("./routes/books.routes");

const app = express();
app.use(express.json());

// It requires API key to protect for all routes
app.use(requireApiKey);

// routes
app.use("/books", booksRoutes);

// This booksApi will run the code after it matches from package.json
exports.booksApi = app;