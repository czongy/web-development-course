import express from 'express';
import pg from 'pg';
import "dotenv/config";

const app = express()
const port = 3000;

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM books");
        const all_book = response.rows
        res.render("home.ejs", {books:all_book});
    } catch (err) {
        console.error(err);
    }
});

app.get("/add", (req, res) => {
    res.render("add.ejs");
});

app.get("/review/:id", async (req, res) => {
    try {
        const response = await db.query(`SELECT * FROM books WHERE id = ${req.params.id}`);
        const book = response.rows[0];
        res.render("review.ejs", {book: book});
    } catch (err) {
        console.error(err);
    }
});

app.post("/add", async (req, res) => {
    const data = req.body;
    try {
        db.query(`INSERT INTO books (isbn, title, author, date, rating, review)
                  VALUES ($1, $2, $3, $4, $5, $6)`, 
                  [data.isbn, data.title, data.author, data.date, data.rating, data.review]);
        res.redirect("/")
    } catch (err) {
        console.error(err);
    }
});

app.post("/delete", async (req, res) => {
    try {
        const response = await db.query("DELETE FROM books WHERE id = $1", [req.body.deleteId]);
        console.log(response);
        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});