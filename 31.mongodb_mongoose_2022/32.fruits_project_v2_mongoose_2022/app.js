const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/FruitsDB");
}

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit ({
  rating: 10,
  review: "Pretty as a fruit"
});

// fruit.save();

const peopleSchema = new mongoose.Schema ({
  name: String,
  age: Number,
  favouriteFruit: fruitSchema
});

const People = mongoose.model("People", peopleSchema);

const pear = new Fruit ({
  name: "Pear",
  rating: 9,
  review: "Pretty as a fruit"
});

pear.save();

const people = new People ({
  name: "John",
  age: 37
});

// people.save();

// const kiwi = new Fruit ({
//   name: "Kiwi",
//   rating: 6,
//   review: "OOkay lah"
// });
//
// const orange = new Fruit ({
//   name: "Orange",
//   rating: 3,
//   review: "cool lah"
// });
//
// const banana = new Fruit ({
//   name: "Banana",
//   rating: 6,
//   review: "yellow lah"
// });

// Fruit.insertMany([kiwi,orange,banana], function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Success");
//   }
// });

People.updateOne({name: "John"}, {favouriteFruit: pear}, function(err, peoples){
  if (err) {
    console.log(err);
  } else {
    console.log(peoples);
  }
});

Fruit.find(function(err, fruits){
  if (err) {
    console.log(err);
  } else {
    mongoose.connection.close();
    fruits.forEach(function(fruitsname){
      console.log(fruitsname.name);
    });
  }
});
