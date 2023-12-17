/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from "inquirer";
import qr from "qr-image";
import { writeFile, createWriteStream } from "node:fs";

inquirer
  .prompt([
    {
      name: "url",
      message: "Please enter the URL to convert into QR code image: ",
    },
  ])
  .then((answers) => {
    var input = answers.url;
    var qr_png = qr.image(input);
    qr_png.pipe(createWriteStream("qr_code.png"));
    writeFile("URL.txt", input, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });