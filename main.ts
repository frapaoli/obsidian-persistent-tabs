import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, TFile, ViewState } from 'obsidian';

// Interface for our plugin's settings
interface PersistentTabsSettings {
    savedTabs: SerializedLeaf[];
}

// Interface to store the necessary info about a leaf (tab)
// We store the ViewState which includes file path, view mode, scroll position etc.
interface SerializedLeaf {
    filePath: string | null; // Store path separately for easier lookup
    state: ViewState;
}

// Default settings
const DEFAULT_SETTINGS: PersistentTabsSettings = {
    savedTabs: [],
};

export default class PersistentTabsPlugin extends Plugin {
    settings: PersistentTabsSettings;
    restoring = false; // Flag to prevent saving during restore process

    async onload() {
        await this.loadSettings();

        // Add a setting tab (optional, but good practice)
        this.addSettingTab(new PersistentTabsSettingTab(this.app, this));

        // Use onLayoutReady to ensure the workspace is fully initialized
        this.app.workspace.onLayoutReady(async () => {
            await this.restoreTabs();
        });

        // Register the interval function to save tabs periodically and on unload
        // Using onunload is crucial for capturing the state just before closing
        this.register(this.saveTabs.bind(this)); // Bind 'this' context

        // Consider adding a command to manually save/restore if desired
        // this.addCommand({
        //  id: 'save-persistent-tabs',
        //  name: 'Save open tabs now',
        //  callback: () => this.saveTabs()
        // });
        // this.addCommand({
        //  id: 'restore-persistent-tabs',
        //  name: 'Restore saved tabs',
        //  callback: () => this.restoreTabs()
        // });
    }

    onunload() {
        // Ensure tabs are saved when the plugin is disabled or Obsidian closes
        // Check the flag to avoid saving an empty state if unload happens during restore
        if (!this.restoring) {
            this.saveTabs();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    getCurrentLeaves(): WorkspaceLeaf[] {
        // Support more view types for a better experience
        return [
            ...this.app.workspace.getLeavesOfType('markdown'),
            ...this.app.workspace.getLeavesOfType('canvas'),
            ...this.app.workspace.getLeavesOfType('pdf'),
            ...this.app.workspace.getLeavesOfType('image')
        ];
    }

    saveTabs() {
        // Don't save if we are in the middle of restoring tabs
        if (this.restoring) {
            return;
        }

        const leaves = this.getCurrentLeaves();
        const serializedLeaves: SerializedLeaf[] = [];

        leaves.forEach(leaf => {
            const viewState = leaf.getViewState();
            // Ensure we only save leaves that have a file associated with them
            if (viewState?.state?.file) {
                // Check if file exists before saving its state
                const filePath = viewState.state.file as string;
                const file = this.app.vault.getAbstractFileByPath(filePath);
                if (file instanceof TFile) {
                    serializedLeaves.push({
                    	filePath: filePath, // Store path explicitly
                        state: viewState
                    });
                }
            }
        });

        this.settings.savedTabs = serializedLeaves;
        this.saveSettings();
    }

    async restoreTabs() {
        if (!this.settings.savedTabs || this.settings.savedTabs.length === 0) {
            return;
        }

        this.restoring = true; // Set flag

        // Get current open file paths to avoid duplicates (optional, depends on desired behavior)
        const currentFiles = new Set(
             this.getCurrentLeaves()
                .map(leaf => leaf.getViewState()?.state?.file)
                .filter(file => !!file) // Filter out undefined/null paths
        );

        let restoredCount = 0;
        for (const savedLeaf of this.settings.savedTabs) {
            if (!savedLeaf.filePath) continue; // Skip if no path

            const file = this.app.vault.getAbstractFileByPath(savedLeaf.filePath);

            if (file instanceof TFile) {
                try {
                    // Create a new leaf for the tab
                    // 'tab' tries to open in the current group, 'split' creates a new split
                    const leaf = this.app.workspace.getLeaf('tab');
                    await leaf.openFile(file, { state: savedLeaf.state.state }); // Pass the inner state object
                    restoredCount++;
                } catch (error) {
                    console.error(`Persistent Tabs: Error restoring tab for ${savedLeaf.filePath}:`, error);
                }
            }
        }

        this.restoring = false; // Unset flag
    }
}

// Simple Settings Tab (Optional)
class PersistentTabsSettingTab extends PluginSettingTab {
    plugin: PersistentTabsPlugin;

    constructor(app: App, plugin: PersistentTabsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Persistent Tabs Settings' });

        // Example setting - maybe add options later?
        new Setting(containerEl)
            .setName('Saved Tab Data (Read-only)')
            .setDesc('Shows the raw data of tabs saved. Primarily for debugging.')
            .addTextArea(text => text
                .setValue(JSON.stringify(this.plugin.settings.savedTabs, null, 2))
                .setDisabled(true)
                .inputEl.rows = 8);

         new Setting(containerEl)
            .setName('Clear Saved Tabs')
            .setDesc('Manually clear the list of saved tabs. Use if restoration is causing issues.')
            .addButton(button => button
                .setButtonText('Clear Now')
                .setWarning() // Make it look slightly dangerous
                .onClick(async () => {
                    this.plugin.settings.savedTabs = [];
                    await this.plugin.saveSettings();
                    // Optionally refresh the display:
                    this.display();
                }));
    }
}