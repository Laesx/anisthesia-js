{
  "targets": [
    {
      "target_name": "anisthesia-js",
      "sources": [
        "src/addon.cc",
        "src/anisthesia_wrapper.cc",
        # Add Anisthesia source files here
        "lib/anisthesia/src/matroska.cpp",
        "lib/anisthesia/src/player.cpp",
        "lib/anisthesia/src/util.cpp",
        "lib/anisthesia/src/win_open_files.cpp",
        "lib/anisthesia/src/win_platform.cpp",
        "lib/anisthesia/src/win_strategies.cpp",
        "lib/anisthesia/src/win_ui_automation.cpp",
        "lib/anisthesia/src/win_util.cpp",
        "lib/anisthesia/src/win_windows.cpp"
      ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")",
        "node_modules/node-addon-api", # Explicitly add path
        "lib/anisthesia/include"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "10.7"
      },
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1 # /EHsc
        }
      },
      "conditions": [
        ['OS=="win"', {
          "libraries": [
            "-lOle32.lib",
            "-lOleAut32.lib",
            "-lShlwapi.lib", # Needed for PathMatchSpecW used in win_util.cpp
            "-lPropsys.lib"  # Needed for PSGetPropertyKeyFromName used in win_ui_automation.cpp
          ],
          "defines": [
            "UNICODE",
            "_UNICODE"
          ],
          "msvs_settings": {
            "VCCLCompilerTool": {
              "AdditionalOptions": [ "/std:c++17" ] # Anisthesia might require C++17 features
            }
          }
        }]
      ]
    }
  ]
}
