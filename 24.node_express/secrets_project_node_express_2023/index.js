//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
const password = "admin";
app.use(express.urlencoded({extended:true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/check", function(req, res) {
    if (req.body.password == password) {
        res.sendFile(__dirname + "/public/secret.html");
    } else {
        res.sendFile(__dirname + "/public/index.html");
    }
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});