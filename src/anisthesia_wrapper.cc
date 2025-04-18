#include "anisthesia_wrapper.hpp"
#include <napi.h>
#include <anisthesia.hpp> // Include the main Anisthesia header
#include <vector>
#include <string>
#include <stdexcept> // For throwing errors

namespace anisthesia_js {

// Helper function to convert std::wstring to Napi::String
Napi::String WStringToNapiString(Napi::Env env, const std::wstring& wstr) {
    // Assuming UTF-16 LE on Windows for std::wstring
    return Napi::String::New(env, reinterpret_cast<const char16_t*>(wstr.c_str()), wstr.length());
}

// Helper function to convert MediaInfoType enum to string
const char* MediaInfoTypeToString(anisthesia::MediaInfoType type) {
    switch (type) {
        case anisthesia::MediaInfoType::File: return "File";
        case anisthesia::MediaInfoType::Tab: return "Tab";
        case anisthesia::MediaInfoType::Title: return "Title";
        case anisthesia::MediaInfoType::Url: return "Url";
        case anisthesia::MediaInfoType::Unknown:
        default: return "Unknown";
    }
}

// Helper function to convert PlayerType enum to string
const char* PlayerTypeToString(anisthesia::PlayerType type) {
    switch (type) {
        case anisthesia::PlayerType::WebBrowser: return "WebBrowser";
        case anisthesia::PlayerType::Default:
        default: return "Default";
    }
}

// Helper function to convert Strategy enum to string
const char* StrategyToString(anisthesia::Strategy strategy) {
    switch (strategy) {
        case anisthesia::Strategy::WindowTitle: return "WindowTitle";
        case anisthesia::Strategy::OpenFiles: return "OpenFiles";
        case anisthesia::Strategy::UiAutomation: return "UiAutomation";
        default: return "Unknown";
    }
}


// Implementation of the wrapper function declared in the header
Napi::Value GetResultsWrapped(Napi::Env env, const std::string& configPath) {
    // 1. Load Player Definitions
    std::vector<anisthesia::Player> players;
    if (!anisthesia::ParsePlayersFile(configPath, players)) {
        throw std::runtime_error("Failed to parse players configuration file: " + configPath);
    }

    // 2. Define Media Filter (accept all for now)
    // Note: This lambda captures nothing [] because it doesn't need external context.
    // If filtering needed access to 'env' or other local vars, adjust capture clause.
    const auto media_proc = [](const anisthesia::MediaInfo&) {
        return true; // Accept all media info found
    };

    // 3. Perform Detection
    std::vector<anisthesia::win::Result> results;
    // Initialize COM for UI Automation strategy if needed (scoped)
    // Consider if Anisthesia handles this internally or if it should be done here.
    // Assuming Anisthesia handles COM init/uninit for now.
    if (!anisthesia::win::GetResults(players, media_proc, results)) {
        // Consider more specific error reporting if GetResults provides details
        throw std::runtime_error("Anisthesia failed to get results.");
    }

    // 4. Convert Results to Napi::Array
    Napi::Array napiResults = Napi::Array::New(env, results.size());
    for (size_t i = 0; i < results.size(); ++i) {
        const auto& result = results[i];
        Napi::Object napiResult = Napi::Object::New(env);

        // Convert Player info
        Napi::Object napiPlayer = Napi::Object::New(env);
        napiPlayer.Set("name", Napi::String::New(env, result.player.name));
        napiPlayer.Set("type", Napi::String::New(env, PlayerTypeToString(result.player.type)));
        // Convert strategies vector
        Napi::Array napiStrategies = Napi::Array::New(env, result.player.strategies.size());
        for(size_t s_idx = 0; s_idx < result.player.strategies.size(); ++s_idx) {
            napiStrategies.Set(s_idx, Napi::String::New(env, StrategyToString(result.player.strategies[s_idx])));
        }
        napiPlayer.Set("strategies", napiStrategies);
        // Add other player fields if needed (executables, windows, window_title_format)
        napiResult.Set("player", napiPlayer);


        // Convert Process info
        Napi::Object napiProcess = Napi::Object::New(env);
        napiProcess.Set("id", Napi::Number::New(env, static_cast<double>(result.process.id))); // DWORD to double
        napiProcess.Set("name", WStringToNapiString(env, result.process.name));
        napiResult.Set("process", napiProcess);

        // Convert Window info
        Napi::Object napiWindow = Napi::Object::New(env);
        // HWND might not be directly useful in JS, maybe convert to number or omit?
        // Let's convert to number (might be large)
        napiWindow.Set("handle", Napi::Number::New(env, reinterpret_cast<uintptr_t>(result.window.handle)));
        napiWindow.Set("className", WStringToNapiString(env, result.window.class_name));
        napiWindow.Set("text", WStringToNapiString(env, result.window.text));
        napiResult.Set("window", napiWindow);

        // Convert Media vector
        Napi::Array napiMediaArray = Napi::Array::New(env, result.media.size());
        for (size_t j = 0; j < result.media.size(); ++j) {
            const auto& media = result.media[j];
            Napi::Object napiMedia = Napi::Object::New(env);

            // Add state, duration, position (even if currently unused by Anisthesia)
            // napiMedia.Set("state", Napi::String::New(env, MediaStateToString(media.state))); // Need MediaStateToString helper
            napiMedia.Set("state", Napi::String::New(env, "Unknown")); // Placeholder
            napiMedia.Set("duration", Napi::Number::New(env, media.duration.count()));
            napiMedia.Set("position", Napi::Number::New(env, media.position.count()));

            // Convert MediaInfo vector
            Napi::Array napiInfoArray = Napi::Array::New(env, media.information.size());
            for (size_t k = 0; k < media.information.size(); ++k) {
                const auto& info = media.information[k];
                Napi::Object napiInfo = Napi::Object::New(env);
                napiInfo.Set("type", Napi::String::New(env, MediaInfoTypeToString(info.type)));
                napiInfo.Set("value", Napi::String::New(env, info.value));
                napiInfoArray.Set(k, napiInfo);
            }
            napiMedia.Set("information", napiInfoArray);
            napiMediaArray.Set(j, napiMedia);
        }
        napiResult.Set("media", napiMediaArray);

        // Add the result object to the main array
        napiResults.Set(i, napiResult);
    }

    return napiResults;
}

} // namespace anisthesia_js
