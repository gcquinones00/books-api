// services/books.service.js

let books = [
  { id: 1, title: "Harry Potter and the Prisoner of Azkaban", author: "J.K. Rowling", publish_date: "1999-07-08" },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", publish_date: "1937-09-21" },
  { id: 3, title: "Dune", author: "Frank Herbert", publish_date: "1965-08-01" },
];

function getAll(filters = {}) {
  // exact-match filtering on any of these fields if present in query string
  const allowed = ["id", "title", "author", "publish_date"];

  return books.filter((b) => {
    for (const key of allowed) {
      if (filters[key] === undefined) continue;

      // id query param comes in as string, compare safely
      if (key === "id") {
        if (String(b.id) !== String(filters.id)) return false;
      } else {
        if (String(b[key]) !== String(filters[key])) return false;
      }
    }
    return true;
  });
}

function getById(id) {
  return books.find((b) => b.id === id) || null;
}

function create({ title, author, publish_date }) {
  const nextId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;
  const newBook = {
    id: nextId,
    title,
    author,
    publish_date: publish_date ?? null,
  };
  books.push(newBook);
  return newBook;
}

function update(id, { title, author, publish_date }) {
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const updated = {
    ...books[idx],
    title,
    author,
    publish_date: publish_date ?? books[idx].publish_date ?? null,
  };

  books[idx] = updated;
  return updated;
}

function remove(id) {
  const idx = books.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const deleted = books[idx];
  books.splice(idx, 1);
  return deleted;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};