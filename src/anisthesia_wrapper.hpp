#pragma once

#include <napi.h>
#include <string>

namespace anisthesia_js {

/**
 * @brief Wraps the core Anisthesia detection logic and converts results to Napi::Value.
 *
 * This function parses the player configuration, calls Anisthesia's GetResults,
 * and translates the C++ result structures into JavaScript objects and arrays.
 *
 * @param env The Napi::Env environment.
 * @param configPath The path to the players.anisthesia configuration file.
 * @return Napi::Value An array containing the detected media results, or throws an error.
 */
Napi::Value GetResultsWrapped(Napi::Env env, const std::string& configPath);

/**
 * @brief Retrieves a list of player names defined in the configuration file.
 *
 * Parses the specified or default configuration file and returns an array
 * containing the names of all defined players and browsers.
 *
 * @param env The Napi::Env environment.
 * @param configPath The path to the players.anisthesia configuration file.
 * @return Napi::Value An array of strings containing player names, or throws an error.
 */
Napi::Value GetPlayerListWrapped(Napi::Env env, const std::string& configPath);

} // namespace anisthesia_js
