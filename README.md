# Persistent Tabs for Obsidian

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/frapaoli/obsidian-persistent-tabs?style=for-the-badge&sort=semver)](https://github.com/frapaoli/obsidian-persistent-tabs/releases/latest)
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22persistent-tabs%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An Obsidian plugin that saves currently open tabs when closing the application and restores them when reopening it.

## How it Works

The plugin works automatically in the background:

1.  **Saving:** When Obsidian is about to close (or when the plugin is unloaded), it records a list of the currently open Markdown files, including their view state (like scroll position, reading/editing mode).
2.  **Restoring:** When Obsidian starts up and the plugin loads, it reads the saved list and attempts to reopen each file in a new tab, restoring its previous state as closely as possible.

## Features

*   **Automatic Operation:** No commands needed, it works passively.
*   **Saves Open Tabs:** Remembers which Markdown files were open.
*   **Restores Tabs on Startup:** Reopens the previously saved tabs when Obsidian launches.
*   **Preserves View State:** Attempts to restore scroll position and view mode (live preview, reading, source mode) for each tab. *Note: State restoration depends on Obsidian's API capabilities.*
*   **Graceful Handling:** If a file saved in the tabs list has been deleted or renamed before the next launch, the plugin will simply skip restoring that tab and log a message (check Developer Console).
*   **Simple Settings:** Includes an option to manually clear the saved tab data if needed.

## Installation

### From Obsidian Community Plugins (Recommended)

1.  Open Obsidian's `Settings`.
2.  Navigate to `Community plugins`.
3.  Ensure "Restricted mode" is **off**.
4.  Click `Browse` community plugins.
5.  Search for "Persistent Tabs".
6.  Click `Install`.
7.  Once installed, click `Enable`.

### Manual Installation

1.  Download the latest `main.js`, `manifest.json`, and `styles.css` (if available) from the [Releases page](https://github.com/frapaoli/obsidian-persistent-tabs/releases/latest) of this repository.
2.  Go to your Obsidian vault's configuration folder: `YourVault/.obsidian/`.
3.  Navigate into the `plugins` subfolder.
4.  Create a new folder named `persistent-tabs`.
5.  Copy the downloaded `main.js` and `manifest.json` (and `styles.css` if present) into the `persistent-tabs` folder.
6.  Restart Obsidian.
7.  Go to `Settings` -> `Community plugins`, find "Persistent Tabs" and enable it.

## Usage

Once installed and enabled, the plugin works automatically!

*   Open the notes you want to work with in different tabs.
*   Close Obsidian.
*   Reopen Obsidian.
*   Your previously opened tabs should reappear.

## Settings

You can access the plugin settings via `Settings` -> `Community Plugins` -> `Persistent Tabs` -> `Options` (cog icon).

*   **Saved Tab Data (Read-only):** Shows the raw JSON data of the currently saved tabs. Useful for debugging.
*   **Clear Saved Tabs:** If you encounter issues with tab restoration (e.g., errors, unwanted tabs), you can use this button to clear the saved list. The list will be repopulated the next time Obsidian closes cleanly.

## Compatibility

*   **Required Obsidian Version:** 1.0.0 or higher (as specified in `manifest.json`).

## Known Issues / Limitations

*   Restoration accuracy depends on Obsidian's API. While view mode and scroll position are usually restored, complex states or states from other plugins might not be fully captured.
*   If Obsidian crashes instead of closing cleanly, the tab state might not be saved correctly for that session.
*   Restoring a very large number of tabs might introduce a slight delay during Obsidian startup.
*   Only tested with standard Markdown views. Behaviour with highly customized views or complex plugins interacting with tabs is not guaranteed.

## Contributing / Issues

Found a bug or have a feature request? Please open an issue on the [GitHub repository](https://github.com/frapaoli/obsidian-persistent-tabs/issues).

Contributions via Pull Requests are welcome!

## Author

Created by [@frapaoli](https://github.com/frapaoli)

## License

This plugin is released under the [MIT License](LICENSE).