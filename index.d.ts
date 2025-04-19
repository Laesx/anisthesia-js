// Type definitions for anisthesia-js

declare module 'anisthesia-js' {

  /** Represents the type of media information detected. */
  export type MediaInfoType = 'File' | 'Tab' | 'Title' | 'Url' | 'Unknown';

  /** Represents the playback state of the media (currently unused by Anisthesia). */
  export type MediaState = 'Playing' | 'Paused' | 'Stopped' | 'Unknown';

  /** Represents the type of player detected. */
  export type PlayerType = 'Default' | 'WebBrowser';

  /** Represents the detection strategy used. */
  export type Strategy = 'WindowTitle' | 'OpenFiles' | 'UiAutomation' | 'Unknown';

  /** Detailed information about a piece of media data. */
  export interface MediaInfo {
    type: MediaInfoType;
    value: string;
  }

  /** Information about the media being played. */
  export interface Media {
    state: MediaState; // Currently always 'Unknown' from the native side
    duration: number; // Milliseconds (currently unused by Anisthesia)
    position: number; // Milliseconds (currently unused by Anisthesia)
    information: MediaInfo[];
  }

  /** Information about the detected player application. */
  export interface Player {
    name: string;
    type: PlayerType;
    strategies: Strategy[];
    // Potentially add other fields if exposed: executables, windows, window_title_format
  }

  /** Information about the detected process. */
  export interface Process {
    id: number; // Process ID (PID)
    name: string; // Process executable name
  }

  /** Information about the detected window. */
  export interface Window {
    handle: number; // Window handle (HWND as number)
    className: string; // Window class name
    text: string; // Window title text
  }

  /** Represents a single detected media result. */
  export interface DetectionResult {
    player: Player;
    process: Process;
    window: Window;
    media: Media[];
  }

  /**
   * Synchronously detects running media players and retrieves media info.
   * @param [playersConfigPath] Optional path to the players.anisthesia configuration file. Defaults to the included file if omitted.
   * @returns An array of detected media results.
   * @throws If the native addon is not loaded or an error occurs during detection.
   */
  export function getMediaResults(playersConfigPath?: string): DetectionResult[];

  /**
   * Synchronously retrieves a list of player names defined in the configuration file.
   * Parses the specified or default configuration file and returns an array
   * containing the names of all defined players and browsers.
   *
   * @param [configPath] Optional path to the players.anisthesia configuration file. Defaults to the included file if omitted.
   * @returns An object containing two arrays: 'players' (for default players) and 'browsers' (for web browsers).
   * @throws If the native addon is not loaded or an error occurs during parsing.
   */
  export function getPlayerList(configPath?: string): { players: string[]; browsers: string[] };

}
