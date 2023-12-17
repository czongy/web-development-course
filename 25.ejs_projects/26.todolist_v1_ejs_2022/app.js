const express = require("express");
const app = express();
const date = require(__dirname + "/date.js")

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req,res){
  const day = date.getDate();
  res.render("list", {listTitle: day, newListItems: items});
});

app.post("/", function(req,res) {
  const item1 = req.body.newItem
  if (req.body.list === "Work") {
    workItems.push(item1);
    res.redirect("/work");
  } else {
    items.push(item1);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
})

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
