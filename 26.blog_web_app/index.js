import express from "express";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentId = 1;
let posts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.get("/edit/:id", (req, res) => {
    let editPost = posts.find(post => post.id == req.params.id)
    console.log(editPost);
    res.render("edit.ejs", { post: editPost })
})

app.get("/view/:id", (req, res) => {
  let getPost = posts.find(post => post.id == req.params.id)
  res.render("view.ejs", { post: getPost });
});

app.get("/delete/:id", (req, res) => {
    let postIndex = posts.findIndex(post => post.id == req.params.id);
    posts.splice(postIndex, 1);
    res.redirect("/");
});

app.post("/new", (req, res) => {
  let newPost = {
    id: currentId,
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  currentId += 1;
  res.redirect("/");
});

app.post("/edit/:id", (req, res) => {
    let updatePost = {
        id: req.params.id,
        title: req.body.title,
        content: req.body.content
    }
    let postIndex = posts.findIndex(post => post.id == req.params.id);
    posts[postIndex] = updatePost 
    res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});


