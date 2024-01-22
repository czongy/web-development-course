const express = require("express");
const app = express();
app.use(express.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  var num1 = Number(req.body.num1);
  var num2 = Number(req.body.num2);

  var result = num1 + num2;

  res.send("Result is " + result);
});

app.get("/bmicalculator", function(req, res) {
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmicalculator", function(req, res) {
  var num1 = Number(req.body.weight);
  var num2 = Number(req.body.height);

  var result = num1 / (num2 * num2) * 10000;

  res.send("Your BMI is " + result.toFixed(1));
});

app.listen(3000, function() {
  console.log("Server 3000 started.");
});
