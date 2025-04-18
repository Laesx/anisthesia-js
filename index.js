'use strict';

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
    getMediaResultsSync: () => { throw new Error("Native addon not loaded."); },
    getMediaResultsAsync: () => Promise.reject(new Error("Native addon not loaded."))
  };
}

// --- Function Definitions ---

/**
 * Synchronously detects running media players and retrieves media info.
 * @param {string} playersConfigPath - Path to the players.anisthesia configuration file.
 * @returns {Array<object>} An array of detected media results.
 * @throws {Error} If the native addon is not loaded or an error occurs during detection.
 */
function getMediaResultsSync(playersConfigPath) {
  if (typeof playersConfigPath !== 'string' || !playersConfigPath) {
    throw new Error('playersConfigPath must be a non-empty string.');
  }
  // Potentially resolve the path relative to the CWD or make it absolute
  // depending on how the C++ part expects it. Let's assume absolute/relative for now.
  return anisthesiaNative.getMediaResultsSync(playersConfigPath);
}

/**
 * Asynchronously detects running media players and retrieves media info.
 * @param {string} playersConfigPath - Path to the players.anisthesia configuration file.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of detected media results.
 * @rejects {Error} If the native addon is not loaded or an error occurs during detection.
 */
function getMediaResultsAsync(playersConfigPath) {
  if (typeof playersConfigPath !== 'string' || !playersConfigPath) {
    return Promise.reject(new Error('playersConfigPath must be a non-empty string.'));
  }
  // Potentially resolve the path
  return anisthesiaNative.getMediaResultsAsync(playersConfigPath);
}


// --- Exports ---

module.exports = {
  getMediaResultsSync,
  getMediaResultsAsync,
  // Default export can be the async version for convenience
  getMediaResults: getMediaResultsAsync
};
