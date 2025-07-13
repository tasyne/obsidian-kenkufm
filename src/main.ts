import { Plugin } from "obsidian";
import { KenkuController } from "./utils/kenku";
import "virtual:uno.css";
import { InsertTrackModal } from "./modals";
import { registerCodeBlockProcessors } from "./processors";
import { playback } from "./stores/playback";

interface ObsidianNoteConnectionsSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianNoteConnectionsSettings = {
	mySetting: "default",
};

export default class KenkuFMRemotePlugin extends Plugin {
	settings!: ObsidianNoteConnectionsSettings;

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async onload() {
		await this.loadSettings();
		await KenkuController.init();
		registerCodeBlockProcessors(this);

		this.addCommand({
			id: "kenku-insert-track",
			name: "Insert Track",
			callback: () => {
				new InsertTrackModal(this.app).open();
			},
		});

		// this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf));

		// this.addRibbonIcon("dice", "Activate view", () => {
		// 	this.activateView();
		// });
	}

	onunload() {
		console.log("unloading plugin");
		playback.stopPolling();
	}

	// async activateView() {
	// 	this.app.workspace.detachLeavesOfType(VIEW_TYPE_EXAMPLE);

	// 	await this.app.workspace.getRightLeaf(false).setViewState({
	// 		type: VIEW_TYPE_EXAMPLE,
	// 		active: true,
	// 	});

	// 	this.app.workspace.revealLeaf(
	// 		this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE)[0],
	// 	);
	// }
}
