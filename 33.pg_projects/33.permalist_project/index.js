import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Add your own pg database.
const db = new pg.Client({
  user: "",
  password: "",
  host: "",
  database: "",
  port: 5432
});
db. connect();

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM to_do_list");
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch(err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  try {
    await db.query("INSERT INTO to_do_list (title) VALUES ($1)", 
    [req.body.newItem]);
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  try {
    await db.query("UPDATE to_do_list SET title = $1 WHERE id = $2",
    [req.body.updatedItemTitle, req.body.updatedItemId]);
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  try {
    await db.query("DELETE FROM to_do_list WHERE id = $1",
    [req.body.deleteItemId]);
    res.redirect("/");
  } catch(err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
