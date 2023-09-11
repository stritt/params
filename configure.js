const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let urls = [];

rl.question("Do you need to whitelist addtional domains (besides root)? y/n: ", (whitelist) => {
  if (whitelist === "y") {
      askForURL(whitelist);
    } else {
      rl.close()
    }
  });

function askForURL(whitelist) {
  rl.question(
    'Enter a domain to whitelist (or "done" to finish): ',
    (urlInput) => {
      if (urlInput.toLowerCase() !== "done") {
        urls.push(urlInput.trim());
        askForURL(whitelist); // Recursively ask for the next URL
      } else {
        rl.close()
      }
    }
  );
}

// function askForStyleEditing(allowDomain, urls) {
//   rl.question(
//     "Enable style editing via query params? y/n: ",
//     (styleEditing) => {
//       modifyScript(allowDomain, urls, styleEditing);
//       rl.close();
//     }
//   );
// }

function modifyScript(allowDomain, urls, styleEditing) {
  // Load the original script
  // let scriptContent = fs.readFileSync("script.js", "utf8");

  // Modify script based on the configurations
  // if (allowDomain === "y") {
    // Add party mode enabling code if required
    // (Given the provided script, no changes seem necessary for this option)
  // }

  if (urls.length > 0) {
    // Replace the placeholder whitelist with the provided URLs, comma separated
    scriptContent = scriptContent.replace(
      '["ENTERYOURURLHERE.COM"]',
      JSON.stringify(urls)
    );
  }

  // if (styleEditing === "y") {
    // Add style editing enabling code if required
    // (Again, based on the provided script, no specific changes seem necessary for this option)
  // }

  // Save the modified script
  fs.writeFileSync("script.js", scriptContent);
}
