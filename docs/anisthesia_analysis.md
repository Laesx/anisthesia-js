# Anisthesia C++ Library Analysis

This document provides an overview of the `Anisthesia` C++ library's structure, purpose, and API, based on analysis of its header files and README.

## Purpose

Anisthesia is a native C++ library specifically designed for **media detection on Windows**. Its primary functions are:

1.  Detecting running media player applications and web browsers.
2.  Retrieving information about the media (e.g., file path, browser tab title, window title) currently being handled by these applications.

*Note: The library is currently marked as a "work in progress" in its README.*

## Core Concepts

### 1. Players (`player.hpp`)

-   **Definition:** Media sources are defined using the `Player` struct. Each `Player` represents a specific application (e.g., VLC, Chrome) that the library should monitor.
-   **Configuration:** Player definitions are typically loaded from an external configuration file (e.g., `data/players.anisthesia`) using `ParsePlayersFile` or `ParsePlayersData`.
-   **Attributes:** A `Player` definition includes:
    -   `name`: A human-readable name (e.g., "VLC media player").
    -   `type`: `PlayerType::Default` or `PlayerType::WebBrowser`.
    -   `executables`: A list of executable filenames associated with the player (e.g., `vlc.exe`).
    -   `windows`: A list of window class names or other identifiers.
    -   `window_title_format`: A format string potentially used for title matching (details unclear from headers alone).
    -   `strategies`: A list of detection `Strategy` enums to use for this player.

### 2. Detection Strategies (`player.hpp`)

Anisthesia employs different strategies to gather media information:

-   `Strategy::WindowTitle`: Likely involves inspecting the window title text for patterns or filenames.
-   `Strategy::OpenFiles`: May involve querying the operating system for files currently held open by the player's process. This is often more reliable for local media files.
-   `Strategy::UiAutomation`: Utilizes Windows UI Automation APIs to inspect UI elements (e.g., browser tab titles, specific controls within a player) for media information. This is crucial for web browsers and some complex players.

The specific strategies used for a player are defined in its `Player` configuration.

### 3. Media Information (`media.hpp`)

-   **`MediaInfo`:** Represents a single piece of information found about the media.
    -   `type`: `MediaInfoType` enum (e.g., `File`, `Tab`, `Title`, `Url`).
    -   `value`: The actual string value (e.g., `"C:\movies\my_video.mkv"`, `"My Video - YouTube - Google Chrome"`).
-   **`Media`:** Represents the overall media being played by a specific instance.
    -   `information`: A `std::vector<MediaInfo>` containing all pieces of information found for this media.
    -   `state`: `MediaState` enum (`Playing`, `Paused`, `Stopped`). *Currently unused.*
    -   `duration`, `position`: `media_time_t` (milliseconds). *Currently unused.*
-   **`media_proc_t`:** A function type (`std::function<bool(const MediaInfo&)>`) that can be passed to the detection function to filter accepted `MediaInfo` results *before* they are added to the final `Media` object.

### 4. Results (`win_platform.hpp`)

-   The primary detection function `anisthesia::win::GetResults` returns a `std::vector<anisthesia::win::Result>`.
-   **`Result`:** Contains the combined information for a detected player instance and its media.
    -   `player`: The matched `Player` configuration struct.
    -   `process`: Information about the detected process (`Process` struct with `id` (DWORD) and `name` (wstring)).
    -   `window`: Information about the associated window (`Window` struct with `handle` (HWND), `class_name` (wstring), `text` (wstring)).
    -   `media`: A `std::vector<Media>` containing information about all media items detected for this player instance.

## Main Workflow

1.  **Load Player Definitions:** Call `anisthesia::ParsePlayersFile` (or `ParsePlayersData`) to load the `std::vector<Player>` configurations. Handle potential parsing errors.
2.  **Define Media Filter (Optional):** Create a `media_proc_t` callback function if specific filtering of `MediaInfo` items is needed based on their type or value.
3.  **Perform Detection:** Call `anisthesia::win::GetResults`, passing the loaded players, the optional filter callback, and an empty `std::vector<Result>` to be populated. Handle potential errors.
4.  **Process Results:** Iterate through the populated `std::vector<Result>`. Each `Result` object provides details about a detected player instance and the media it's handling.

## Key Header Files

-   `anisthesia.hpp`: Main include file, pulls in the others.
-   `player.hpp`: Defines `Player`, `Strategy`, `PlayerType`, and parsing functions.
-   `media.hpp`: Defines `Media`, `MediaInfo`, `MediaState`, `MediaInfoType`, and `media_proc_t`.
-   `win_platform.hpp`: Defines Windows-specific structures (`Process`, `Window`, `Result`) and the main detection function `GetResults`.

## Dependencies

-   Requires Windows-specific headers (`windows.h`) and relies heavily on Windows APIs for its detection strategies (Process enumeration, Window enumeration, Open Files querying, UI Automation). It is **not** cross-platform.
