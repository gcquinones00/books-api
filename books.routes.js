// routes/books.routes.js
const express = require("express");
const router = express.Router();

const booksService = require("../services/books.service");

// helpers
function isBlank(v) {
  return v === undefined || v === null || String(v).trim() === "";
}

function parseIdOr400(req, res) {
  const raw = req.params.id;

  // Returns a 400 status code if id is not a number or blank/null
  if (isBlank(raw)) {
    res.status(400).json({ error: "id is required" });
    return null;
  }

  const id = Number(raw);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "id must be a number" });
    return null;
  }
  return id;
}

// This GET /books returns an array of book objects that involves optional URL query parameter to filter books
router.get("/", (req, res) => {
  const results = booksService.getAll(req.query);
  res.json(results);
});

// This GET /books/:id returns a single book for the given id URL path parameter
router.get("/:id", (req, res) => {
  const id = parseIdOr400(req, res);
  if (id === null) return;

  const book = booksService.getById(id);

  // Returns a 404 status code if the book is not found and it returns a value of null if book is not found
  if (!book) {
    return res.status(404).json(null);
  }

  res.json(book);
});

// This POST /books creates a single book
router.post("/", (req, res) => {
  const { title, author, publish_date } = req.body || {};

  // Returns a 400 status code if title or author are blank/null
  if (isBlank(title) || isBlank(author)) {
    return res.status(400).json({ error: "title and author are required" });
  }

  const newBook = booksService.create({
    title: String(title).trim(),
    author: String(author).trim(),
    publish_date: isBlank(publish_date) ? null : String(publish_date).trim(),
  });

  // Returns a 201 status code and the new book with an auto generated id field
  res.status(201).json(newBook);
});

// This PUT /books/:id updates a single book
router.put("/:id", (req, res) => {
  const id = parseIdOr400(req, res);
  if (id === null) return;

  const { title, author, publish_date } = req.body || {};

  // Returns a 400 status code if id, title, or author are blank/null
  if (isBlank(title) || isBlank(author)) {
    return res.status(400).json({ error: "title and author are required" });
  }

  const updated = booksService.update(id, {
    title: String(title).trim(),
    author: String(author).trim(),
    publish_date: isBlank(publish_date) ? null : String(publish_date).trim(),
  });

  if (!updated) {
    return res.status(404).json(null);
  }

  res.json(updated);
});

// This DELETE /books/:id deletes a single book
router.delete("/:id", (req, res) => {
  const raw = req.params.id;

  // Returns a 400 status code if id is blank/null
  if (isBlank(raw)) {
    return res.status(400).json({ error: "id is required" });
  }

  // and your deliverables include invalid-id scenario, so treat non-number as 400 too
  const id = Number(raw);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "id must be a number" });
  }

  const deleted = booksService.remove(id);

  if (!deleted) {
    return res.status(404).json(null);
  }

  // Returns a 200 with the deleted record
  res.status(200).json(deleted);
});

module.exports = router;