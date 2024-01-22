randDice();

function randDice() {
  var rand1 = "";
  var rand2 = "";

  //Dice Value (1-6)
  rand1 = Math.ceil(Math.random() * 6);
  rand2 = Math.ceil(Math.random() * 6);

  //Difference between the two dice value
  diff = rand1 - rand2;

  imgDice1(rand1);
  imgDice2(rand2);
  imgTitle(diff);
}

//Player 1 Dice Image
function imgDice1(diceNum) {
  var imgSource1 = "images/dice" + diceNum + ".png";
  document.querySelector(".playerone img").setAttribute("src", imgSource1);
}

//Player 2 Dice Image
function imgDice2(diceNum) {
  var imgSource2 = "images/dice" + diceNum + ".png";
  document.querySelector(".playertwo img").setAttribute("src", imgSource2);
}

//Results
function imgTitle(winner) {
  if (winner === 0) {
    document.querySelector("#title h1").innerHTML = "Draw!";
  } else if (winner > 0) {
    document.querySelector("#title h1").innerHTML = "🚩 Player 1 Wins!";
  } else {
    document.querySelector("#title h1").innerHTML = "Player 2 Wins! 🚩";
  }
}
