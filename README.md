# anisthesia-js

Node.js wrapper for the [Anisthesia](https://github.com/erengy/anisthesia) C++ media detection library.

**This library is for Windows only.**

It detects running media players and web browsers and retrieves information about the currently playing media based on a configuration file.

## Requirements

-   Node.js
-   Node-gyp build tools (Python, C++ Build Tools for Visual Studio)

## Installation

```bash
# If published to npm:
# npm install anisthesia-js

# For local development/use:
npm install
```

This will install dependencies and build the native addon.

## Usage

You need a `players.anisthesia` configuration file. A sample is included in the original Anisthesia library (`lib/anisthesia/data/players.anisthesia`).

```javascript
const path = require('path');
const anisthesia = require('anisthesia-js'); // Or require('./index') if local

// Example using the default config path included with the library:
// Synchronous
try {
  const results = anisthesia.getMediaResultsSync(); // No argument needed for default
  console.log("Results (Default Config):", JSON.stringify(results, null, 2));
} catch (error) {
  console.error("Sync Error (Default Config):", error);
}

// Asynchronous (Recommended)
anisthesia.getMediaResultsAsync() // No argument needed for default
  .then(results => {
    console.log("Async Results (Default Config):", JSON.stringify(results, null, 2));
  })
  .catch(error => {
    console.error("Async Error (Default Config):", error);
  });

// Example specifying a custom config path:
const customConfigPath = '/path/to/your/custom/players.anisthesia';
anisthesia.getMediaResults(customConfigPath).then(results => {
   console.log("Results (Custom Config):", JSON.stringify(results, null, 2));
});
```

### API

#### `getMediaResultsSync([playersConfigPath])`
-   `playersConfigPath` (string, optional): Path to the `players.anisthesia` configuration file. Defaults to the one included in `lib/anisthesia/data/` if omitted.
-   Returns: `DetectionResult[]` - An array of detected media results.
-   Throws: Error if the addon fails to load or detection fails.

#### `getMediaResultsAsync([playersConfigPath])` / `getMediaResults([playersConfigPath])`
-   `playersConfigPath` (string, optional): Path to the `players.anisthesia` configuration file. Defaults to the one included in `lib/anisthesia/data/` if omitted.
-   Returns: `Promise<DetectionResult[]>` - A promise resolving with an array of detected media results.
-   Rejects: Error if the addon fails to load or detection fails.


### Result Structure (`DetectionResult`)

```typescript
interface DetectionResult {
  player: {
    name: string;
    type: 'Default' | 'WebBrowser';
    strategies: ('WindowTitle' | 'OpenFiles' | 'UiAutomation' | 'Unknown')[];
  };
  process: {
    id: number; // PID
    name: string;
  };
  window: {
    handle: number; // HWND
    className: string;
    text: string; // Window Title
  };
  media: {
    state: 'Playing' | 'Paused' | 'Stopped' | 'Unknown'; // Currently always 'Unknown'
    duration: number; // Milliseconds (currently unused)
    position: number; // Milliseconds (currently unused)
    information: {
      type: 'File' | 'Tab' | 'Title' | 'Url' | 'Unknown';
      value: string;
    }[];
  }[];
}
```
