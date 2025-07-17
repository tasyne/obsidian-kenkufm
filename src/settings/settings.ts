import KenkuFMRemotePlugin from "../main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { settings } from "../stores/kenkuStore";
import { get } from "svelte/store";

export interface ObsidianNoteConnectionsSettings {
	hostname: string;
}

export const DEFAULT_SETTINGS: ObsidianNoteConnectionsSettings = {
	hostname: "http://127.0.0.1:3333",
};

export class KenkuSettingTab extends PluginSettingTab {
	plugin: KenkuFMRemotePlugin;

	constructor(app: App, plugin: KenkuFMRemotePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// hostname
		new Setting(containerEl)
			.setName("Kenku FM Remote URL")
			.setDesc("Kenku Remote server protocol, hostname, and port")
			.addText((text) =>
				text
					.setPlaceholder("http://127.0.0.1:3333")
					.setValue(get(settings).hostname)
					.onChange(async (value) => {
						settings.update((s) => {
							s.hostname = value;
							return s;
						});
					}),
			);
	}
}
