import { type App, SuggestModal } from "obsidian";
import { tracks } from "./stores/kenkuStore";
import { get } from "svelte/store";

interface Track {
	title: string;
	id: string;
}

export enum KenkuModalType {
	Sound = 0,
	Track = 1,
}

export class InsertTrackModal extends SuggestModal<Track> {
	tracks: Track[] = [];
	type: KenkuModalType;

	constructor(app: App, type: KenkuModalType = KenkuModalType.Track) {
		super(app);
		this.type = type;
	}

	// Returns all available suggestions.
	getSuggestions(query: string): Track[] {
		return get(tracks).filter((track) =>
			track.title.toLowerCase().includes(query.toLowerCase()),
		);
	}

	// Renders each suggestion item.
	renderSuggestion(track: Track, el: HTMLElement) {
		el.createEl("div", { text: track.title });
		el.createEl("small", { text: track.id });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(track: Track, evt: MouseEvent | KeyboardEvent) {
		const editor = this.app.workspace.activeEditor?.editor;
		if (editor) {
			const codeBlock = `\`\`\`kenkufm-track\n   id: ${track.id}\n\`\`\``;
			editor.replaceRange(codeBlock, editor.getCursor());
		}
	}
}
