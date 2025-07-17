import { Plugin } from "obsidian";
import "virtual:uno.css";
import { InsertTrackModal } from "./modals";
import { registerCodeBlockProcessors } from "./processors";
import * as kenkuConnector from "./kenku/kenkuConnector";
import { isKenkuConnected, settings } from "./stores/kenkuStore";
import { DEFAULT_SETTINGS } from "./settings/settings";
import { KenkuSettingTab } from "./settings/settings";

export default class KenkuFMRemotePlugin extends Plugin {
	async loadSettings() {
		const loadedData = await this.loadData();
		if (loadedData) {
			settings.set(loadedData);
		} else {
			settings.set(DEFAULT_SETTINGS);
		}
	}

	async onload() {
		await this.loadSettings();
		registerCodeBlockProcessors(this);
		this.addCommand({
			id: "kenku-insert-track",
			name: "Insert Track",
			callback: () => {
				new InsertTrackModal(this.app).open();
			},
		});

		await kenkuConnector.connect();

		// subscribe to the settings store and save updates
		settings.subscribe((settings) => {
			this.saveData(settings);
		});

		this.addSettingTab(new KenkuSettingTab(this.app, this));

		// this.registerView(VIEW_TYPE_EXAMPLE, (leaf) => new ExampleView(leaf));

		// this.addRibbonIcon("dice", "Activate view", () => {
		// 	this.activateView();
		// });
	}

	onunload() {
		kenkuConnector.stopPolling();
		isKenkuConnected.set(false);
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
