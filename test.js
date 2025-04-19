'use strict';

const path = require('path');
const anisthesia = require('./index'); // Require the addon entry point

// Path to the sample configuration file
const configPath = path.join(__dirname, 'lib', 'anisthesia', 'data', 'players.anisthesia');
// const configPath = 'lib/anisthesia/data/players.anisthesia'; // Relative path might also work

console.log(`Default config path: ${path.join(__dirname, 'lib', 'anisthesia', 'data', 'players.anisthesia')}`);
console.log(`Custom config path example: ${configPath}`); // Keep the specific path example for clarity

// --- Test with Default Config ---
try {
  console.log("\nCalling getMediaResultsSync() with default config...");
  const resultsDefault = anisthesia.getMediaResultsSync(); // Call without argument

  console.log("\n--- Detection Results (Default Config) ---");
  if (resultsDefault.length === 0) {
    console.log("(No running media players detected matching the default config)");
  } else {
    console.log(JSON.stringify(resultsDefault, null, 2));
  }
  console.log("------------------------------------------\n");

} catch (error) {
  console.error("\n--- ERROR (Default Config) ---");
  console.error("Failed to run detection with default config:", error);
  console.error("--------------------------------\n");
  process.exitCode = 1; // Indicate failure
}

// --- Test with Explicit Config Path (Optional, keep for comparison/testing) ---
try {
  console.log(`\nCalling getPlayerListSync() default conf...`); // Update log message to reflect the correct function
  const resultsExplicit = anisthesia.getPlayerListSync(); // Call without explicit argument

  console.log("\n--- Detection Results (Default Config) ---");
  if (resultsExplicit.length === 0) {
    console.log("(No running media players detected matching the default config)");
  } else {
    console.log(JSON.stringify(resultsExplicit, null, 2));
  }
  console.log("-------------------------------------------\n");

} catch (error) {
  console.error("\n--- ERROR (Default Config) ---");
  console.error("Failed to run detection with default config:", error);
  console.error("---------------------------------\n");
  process.exitCode = 1; // Indicate failure
}


// --- Test with Explicit Config Path (Optional, keep for comparison/testing) ---
// try {
//   console.log(`\nCalling getMediaResultsSync("${configPath}")...`);
//   const resultsExplicit = anisthesia.getMediaResultsSync(configPath); // Call with explicit argument

//   console.log("\n--- Detection Results (Explicit Config) ---");
//   if (resultsExplicit.length === 0) {
//     console.log("(No running media players detected matching the explicit config)");
//   } else {
//     console.log(JSON.stringify(resultsExplicit, null, 2));
//   }
//   console.log("-------------------------------------------\n");

// } catch (error) {
//   console.error("\n--- ERROR (Explicit Config) ---");
//   console.error("Failed to run detection with explicit config:", error);
//   console.error("---------------------------------\n");
//   process.exitCode = 1; // Indicate failure
// }
