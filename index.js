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
    getMediaResultsSync: () => { throw new Error("Native addon not loaded."); },
    getMediaResultsAsync: () => Promise.reject(new Error("Native addon not loaded."))
  };
}

// --- Function Definitions ---

/**
 * Synchronously detects running media players and retrieves media info.
 * @param {string} [playersConfigPath] - Optional path to the players.anisthesia configuration file. Defaults to the included file if omitted.
 * @returns {Array<object>} An array of detected media results.
 * @throws {Error} If the native addon is not loaded or an error occurs during detection.
 */
function getMediaResultsSync(playersConfigPath) {
  const configPath = playersConfigPath === undefined ? DEFAULT_CONFIG_PATH : playersConfigPath;
  if (typeof configPath !== 'string' || !configPath) {
    // This error should ideally not happen with the default, but good for validation if a path *is* provided
    throw new Error('Resolved playersConfigPath must be a non-empty string.');
  }
  return anisthesiaNative.getMediaResultsSync(configPath);
}

/**
 * Asynchronously detects running media players and retrieves media info.
 * @param {string} [playersConfigPath] - Optional path to the players.anisthesia configuration file. Defaults to the included file if omitted.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of detected media results.
 * @rejects {Error} If the native addon is not loaded or an error occurs during detection.
 */
function getMediaResultsAsync(playersConfigPath) {
  const configPath = playersConfigPath === undefined ? DEFAULT_CONFIG_PATH : playersConfigPath;
  if (typeof configPath !== 'string' || !configPath) {
    return Promise.reject(new Error('Resolved playersConfigPath must be a non-empty string.'));
  }
  return anisthesiaNative.getMediaResultsAsync(configPath);
}


// --- Exports ---

module.exports = {
  getMediaResultsSync,
  getMediaResultsAsync,
  getMediaResults: getMediaResultsAsync
};
