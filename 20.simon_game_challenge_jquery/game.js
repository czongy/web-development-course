var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;

$(document).keydown(function() {
  if (!started) {
    nextSequence();
    started = true;
  }
});

//User Pattern
$(".btn").click(function() {
  var userChosenColour = this.id//$(this).attr("id");
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColour = buttonColours[randomNumber];
  userClickedPattern = [];

  //Game Pattern
  gamePattern.push(randomChosenColour);
  $("#" + randomChosenColour).fadeOut(100).fadeIn(100);
  var gameAudio = new Audio("sounds/" + randomChosenColour + ".mp3");
  gameAudio.play();

  //h1 Text
  level++;
  $("#level-title").text("Level " + level);

}

function playSound(name) {
  var userAudio = new Audio("sounds/" + name + ".mp3");
  userAudio.play();
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function() {
        nextSequence();
      }, 1000);
    }
  } else {
    var wrongAudio = new Audio("sounds/wrong.mp3");
    wrongAudio.play();
    gameOver();
    startOver();
  }
}

function gameOver() {
  $("body").addClass("game-over");
  setTimeout(function() {
    $("body").removeClass("game-over");
  }, 200);
  $("#level-title").text("Game Over, Press Any Key to Restart");
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}
