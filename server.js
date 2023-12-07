/* eslint-disable no-console */
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// route
const { getAllCategories } = require('./src/categories/categoriesHandler');
const { getAllBooks } = require('./src/book/handler');

// Buat koneksi ke database
const connection = mysql.createConnection({
  host: '34.128.114.112',
  user: 'root',
  password: '123',
  database: 'buku_db',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/books', (req, res) => {
  connection.query('SELECT * FROM books', (err, results) => {
    if (err) {
      res.status(500);
      res.json({
        status: false,
        message: 'Error fetching books',
        data: [],
      });
      return;
    }

    const formattedResults = results.map((book) => {
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
      };
    });

    res.status(200);
    res.json({
      status: true,
      message: 'Books fetched successfully',
      data: formattedResults,
    });
  });
});

app.get("/tabel", (req, res) => {
  connection.query("SELECT * FROM books", (err, results) => {
    if (err) {
      res.send("Error fetching data");
      return;
    }
    let tableHtml =
      '<table border="1"><tr><th>ID</th><th>ISBN</th><th>Title</th><th>Author</th><th>Year</th><th>Action</th></tr>';
    results.forEach((book) => {
      tableHtml += `<tr><td>${book.id}</td><td>${book.ISBN}</td><td>${book.title}</td><td>${book.author}</td><td>${book.year}</td><td><a href="/edit-book/${book.id}">Edit</a> | <a href="/delete-book/${book.id}">Delete</a></td></tr>`;
    });
    tableHtml += "</table>";
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Books Table</title>
        </head>
        <body>
          <h1>Books Table</h1>
          ${tableHtml}
        </body>
        </html>
      `);
  });
});

// Menghapus buku dari database berdasarkan ID
app.delete("/delete-book/:id", (req, res) => {
  const bookId = req.params.id;
  connection.query(
    "DELETE FROM books WHERE id = ?",
    [bookId],
    (err, result) => {
      if (err) {
        res.json({
          status: false,
          message: "Error deleting book",
          data: {},
        });
        return;
      }
      res.json({
        status: true,
        message: "Book deleted successfully",
        data: {},
      });
    }
  );
});

// Menampilkan form untuk mengedit buku berdasarkan ID
app.get("/edit-book/:id", (req, res) => {
  const bookId = req.params.id;
  connection.query(
    "SELECT * FROM books WHERE id = ?",
    [bookId],
    (err, result) => {
      if (err || result.length === 0) {
        res.send("Book not found");
        return;
      }
      const book = result[0];
      res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Edit Book</title>
      </head>
      <body>
        <h1>Edit Book</h1>
        <form action="/update-book/${book.id}" method="post">
          <label for="ISBN">ISBN:</label><br>
          <input type="text" id="ISBN" name="ISBN" value="${book.ISBN}"><br>
          <label for="title">Title:</label><br>
          <input type="text" id="title" name="title" value="${book.title}"><br>
          <label for="author">Author:</label><br>
          <input type="text" id="author" name="author" value="${book.author}"><br>
          <label for="year">Year:</label><br>
          <input type="text" id="year" name="year" value="${book.year}"><br><br>
          <input type="submit" value="Update Book">
        </form>
      </body>
      </html>
    `);
    }
  );
});

// Meng-handle pembaruan buku ke database
app.post("/update-book/:id", (req, res) => {
  const bookId = req.params.id;
  const { ISBN, title, author, year } = req.body;
  connection.query(
    "UPDATE books SET ISBN = ?, title = ?, author = ?, year = ? WHERE id = ?",
    [ISBN, title, author, year, bookId],
    (err, result) => {
      if (err) {
        res.json({
          status: false,
          message: "Error updating book",
          data: {},
        });
        return;
      }
      res.json({
        status: true,
        message: "Book updated successfully",
        data: {
          id: bookId,
          ISBN: ISBN,
          title: title,
          author: author,
          year: year,
        },
      });
    }
  );
});

// Menampilkan form untuk menambahkan buku
app.get("/add-book-form", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Add Book</title>
    </head>
    <body>
      <h1>Add Book</h1>
      <form action="/add-book" method="post">
        <label for="ISBN">ISBN:</label><br>
        <input type="text" id="ISBN" name="ISBN"><br>
        <label for="title">Title:</label><br>
        <input type="text" id="title" name="title"><br>
        <label for="author">Author:</label><br>
        <input type="text" id="author" name="author"><br>
        <label for="year">Year:</label><br>
        <input type="text" id="year" name="year"><br><br>
        <input type="submit" value="Add Book">
      </form>
    </body>
    </html>
  `);
});

// Menambahkan buku ke database
app.post("/add-book", (req, res) => {
  const { ISBN, title, author, year } = req.body;
  connection.query(
    "INSERT INTO books (ISBN, title, author, year) VALUES (?, ?, ?, ?)",
    [ISBN, title, author, year],
    (err, result) => {
      if (err) {
        res.json({
          status: false,
          message: "Error adding book",
          data: {},
        });
        return;
      }
      res.json({
        status: true,
        message: "Book added successfully",
        data: {
          id: result.insertId,
          ISBN: ISBN,
          title: title,
          author: author,
          year: year,
        },
      });
    },
  );
});

app.get('/', (req, res) => {
  res.send('hello yobo');
});

// get all book categories
app.get('/categories', getAllCategories);
app.get('/books_dev', getAllBooks);

// Menjalankan server
const HOST = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';
const PORT = process.env.PORT || 5000;
app.listen(PORT, HOST, () => console.log(`Server is running on port ${PORT}`));
