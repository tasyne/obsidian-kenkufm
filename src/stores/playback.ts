import { writable } from "svelte/store";
import type { KenkuFMState } from "../utils/kenku";
import { KenkuController } from "../utils/kenku";

interface PlaybackStore {
	state: KenkuFMState | null;
	error: string | null;
}

const { subscribe, set } = writable<PlaybackStore>({
	state: null,
	error: null,
});

let intervalId: NodeJS.Timeout | undefined;

async function refresh() {
	try {
		const state = await KenkuController.getState();
		set({ state, error: null });
	} catch (err) {
		set({ state: null, error: "Failed to fetch playback state" });
	}
}

function startPolling(interval = 1000) {
	if (intervalId !== undefined) return;
	refresh();
	intervalId = setInterval(refresh, interval);
}

function stopPolling() {
	if (intervalId !== undefined) {
		clearInterval(intervalId);
		intervalId = undefined;
	}
}

export const playback = {
	subscribe,
	refresh,
	startPolling,
	stopPolling,
};
