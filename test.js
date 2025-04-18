'use strict';

const path = require('path');
const anisthesia = require('./index'); // Require the addon entry point

// Path to the sample configuration file
const configPath = path.join(__dirname, 'lib', 'anisthesia', 'data', 'players.anisthesia');
// const configPath = 'lib/anisthesia/data/players.anisthesia'; // Relative path might also work

console.log(`Attempting to load Anisthesia config from: ${configPath}`);

try {
  console.log("Calling getMediaResultsSync...");
  const results = anisthesia.getMediaResultsSync(configPath);

  console.log("\n--- Detection Results ---");
  if (results.length === 0) {
    console.log("(No running media players detected matching the config)");
  } else {
    console.log(JSON.stringify(results, null, 2));
  }
  console.log("-------------------------\n");
  console.log("Test completed successfully.");

} catch (error) {
  console.error("\n--- ERROR ---");
  console.error("Failed to run detection:", error);
  console.error("-------------\n");
  process.exitCode = 1; // Indicate failure
}
