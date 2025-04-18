#include <napi.h>
#include "anisthesia_wrapper.hpp" // We will create this next
// #include "worker.hpp" // Include later for async implementation

namespace anisthesia_js {

// Wrapper function for the synchronous NAPI call
Napi::Value GetMediaResultsSync(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    // 1. Validate input arguments (expecting one string: playersConfigPath)
    if (info.Length() != 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Expected 1 string argument: playersConfigPath").ThrowAsJavaScriptException();
        return env.Undefined();
    }

    // 2. Extract the config path
    std::string configPath = info[0].As<Napi::String>().Utf8Value();

    // 3. Call the C++ wrapper implementation (we'll write this in anisthesia_wrapper.cc)
    try {
        return anisthesia_js::GetResultsWrapped(env, configPath);
    } catch (const std::exception& e) {
        // Catch potential errors from the wrapper/Anisthesia and convert to JS errors
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return env.Undefined();
    } catch (...) {
        // Catch any other unexpected C++ exceptions
        Napi::Error::New(env, "An unknown error occurred in the native addon.").ThrowAsJavaScriptException();
        return env.Undefined();
    }
}

// Placeholder for the asynchronous NAPI call wrapper
Napi::Value GetMediaResultsAsync(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Promise::Deferred deferred = Napi::Promise::Deferred::New(env);

    // 1. Validate input arguments
     if (info.Length() != 1 || !info[0].IsString()) {
        deferred.Reject(Napi::TypeError::New(env, "Expected 1 string argument: playersConfigPath").Value());
        return deferred.Promise();
    }
    std::string configPath = info[0].As<Napi::String>().Utf8Value();

    // 2. Create and queue the AsyncWorker (to be implemented later in worker.cc/hpp)
    // Example structure:
    // auto* worker = new MediaDetectionWorker(env, deferred, configPath);
    // worker->Queue();
    // For now, reject the promise as it's not implemented
    deferred.Reject(Napi::Error::New(env, "Async function not yet implemented.").Value());


    return deferred.Promise();
}


// Module initialization function
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "getMediaResultsSync"),
                Napi::Function::New(env, GetMediaResultsSync));
    exports.Set(Napi::String::New(env, "getMediaResultsAsync"),
                Napi::Function::New(env, GetMediaResultsAsync));
    return exports;
}

// Register the module
NODE_API_MODULE(anisthesia_js, Init)

} // namespace anisthesia_js
