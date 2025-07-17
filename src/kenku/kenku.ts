// src/utils/kenku.ts
import { Notice, requestUrl } from "obsidian";
import {
	tracks,
	playlists,
	sounds,
	soundboards,
	currentState,
	settings,
} from "../stores/kenkuStore";
import { get } from "svelte/store";
import type { KenkuItem, KenkuFMState } from "../types";
import KenkuFMRemotePlugin from "../main";
import { Plugin } from "obsidian";

export async function initKenkuData() {
	console.log("[Kenku] Loading Kenku FM Tracks...");

	try {
		const { tracks: t, playlists: p } = await requestUrl(
			`${get(settings).hostname}/v1/playlist`,
		).json;
		tracks.set(t);
		playlists.set(p);
		console.log(`[Kenku] Loaded ${t.length} tracks`);

		const { sounds: s, soundboards: sb } = await requestUrl(
			`${get(settings).hostname}/v1/soundboard`,
		).json;
		sounds.set(s);
		soundboards.set(sb);
		console.log(`[Kenku] Loaded ${s.length} sounds`);
	} catch (e) {
		new Notice("Failed to load Kenku FM data\nIs Kenku Remote running?");
	}
}

export async function getKenkuState(): Promise<KenkuFMState> {
	try {
		const state = await requestUrl(
			`${get(settings).hostname}/v1/playlist/playback`,
		).json;
		currentState.set(state);
		return state as KenkuFMState;
	} catch (e) {
		new Notice("Failed to get playback state");
		throw e;
	}
}

export async function resumePlayback() {
	try {
		await requestUrl({
			url: `${get(settings).hostname}/v1/playlist/playback/play`,
			method: "PUT",
		});
	} catch (e) {
		new Notice("Failed to resume playback");
		throw e;
	}
}

export async function pausePlayback() {
	try {
		await requestUrl({
			url: `${get(settings).hostname}/v1/playlist/playback/pause`,
			method: "PUT",
		});
	} catch (e) {
		new Notice("Failed to pause playback");
		throw e;
	}
}

export async function playTrack(id: string, restart = false) {
	const { playing, track } = await getKenkuState();

	if (id === track?.id && playing) {
		return;
	}

	if (id === track?.id && !restart) {
		await resumePlayback();
		return;
	}

	await requestUrl({
		url: `${get(settings).hostname}/v1/playlist/play`,
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});
}

export async function seekTrack(id: string, to: number) {
	const { track } = await getKenkuState();

	if (id !== track?.id) {
		return;
	}

	const flooredTo = Math.min(Math.floor(to), track.duration);

	await requestUrl({
		url: `${get(settings).hostname}/v1/playlist/playback/seek`,
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ to: flooredTo }),
	});
}

export async function playSound(id: string) {
	await requestUrl({
		url: `${get(settings).hostname}/v1/soundboard/play`,
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id }),
	});
}

export function getTrackById(id: string): KenkuItem | undefined {
	let result: KenkuItem | undefined;
	tracks.update((t) => {
		result = t.find((track) => track.id === id);
		return t;
	});
	return result;
}
