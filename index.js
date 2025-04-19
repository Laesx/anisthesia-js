'use strict';

const path = require('path');

// Default path to the included config file
const DEFAULT_CONFIG_PATH = path.join(__dirname, 'lib', 'anisthesia', 'data', 'players.anisthesia');

let anisthesiaNative = null;

try {
  // Load the native addon
  // The path is relative to the location of this index.js file
  anisthesiaNative = require('./build/Release/anisthesia-js.node');
} catch (err) {
  // Handle errors during loading (e.g., addon not built, architecture mismatch)
  console.error("Failed to load anisthesia-js native addon.");
  console.error("Ensure the addon has been built correctly ('npm install' or 'node-gyp rebuild').");
  console.error(err);
  // Provide dummy functions or re-throw based on desired behavior
  anisthesiaNative = {
    getMediaResults: () => { throw new Error("Native addon not loaded."); },
    getPlayerList: () => { throw new Error("Native addon not loaded."); }
  };
}

// --- Function Definitions ---

/**
 * hronously detects running media players and retrieves media info.
 * @param {string} [playersConfigPath] - Optional path to the players.anisthesia configuration file. Defaults to the included file if omitted.
 * @returns {Array<object>} An array of detected media results.
 * @throws {Error} If the native addon is not loaded or an error occurs during detection.
 */
function getMediaResults(playersConfigPath) {
  const configPath = playersConfigPath === undefined ? DEFAULT_CONFIG_PATH : playersConfigPath;
  if (typeof configPath !== 'string' || !configPath) {
    // This error should ideally not happen with the default, but good for validation if a path *is* provided
    throw new Error('Resolved playersConfigPath must be a non-empty string.');
  }
  return anisthesiaNative.getMediaResults(configPath);
}

/**
 * Synchronously retrieves a categorized list of player and browser names defined in the configuration file.
 * @param {string} [configPath] - Optional path to the players.anisthesia configuration file. Defaults to the included file if omitted.
 * @returns {{players: Array<string>, browsers: Array<string>}} An object containing two arrays: 'players' (for default players) and 'browsers' (for web browsers).
 * @throws {Error} If the native addon is not loaded or an error occurs during parsing.
 */
function getPlayerList(configPath) {
  // Use default path if configPath is undefined, otherwise use the provided path.
  // The native addon handles the case where configPath is explicitly null or an empty string if needed,
  // but we default to the standard config here if undefined is passed.
  const actualConfigPath = configPath === undefined ? DEFAULT_CONFIG_PATH : configPath;

  // The native addon now handles the logic for default path if null/undefined is passed,
  // but we still need to pass *something*. Let's pass the resolved path or null if the input was explicitly null.
  // The C++ side expects a string path. Let's ensure we pass the default if undefined.
  const pathToSend = configPath === undefined ? DEFAULT_CONFIG_PATH : configPath;

  // Validate that the path to send to native code is a string or null/undefined (which C++ handles)
  if (typeof pathToSend !== 'string' && pathToSend !== null && pathToSend !== undefined) {
      throw new Error('Optional configPath must be a string, null, or undefined.');
  }

  // Call the native function. The C++ side will use its default if pathToSend is null/undefined or handle the string path.
  // Correction: The C++ addon expects the path argument. Let's pass the resolved path.
  // The C++ addon wrapper `GetPlayerListSync` now explicitly handles undefined/null/string.
  return anisthesiaNative.getPlayerList(configPath); // Pass the original argument directly
}


// --- Exports ---

module.exports = {
  getMediaResults,
  getPlayerList
};
