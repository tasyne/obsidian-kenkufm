import { requestUrl } from "obsidian";
import type {
	KenkuFMState,
	KenkuPlaylist,
	KenkuSound,
	KenkuSoundboard,
	KenkuTrack,
} from "../types";
import { settings } from "../stores/kenkuStore";
import { get } from "svelte/store";

export type Result<T> = {
	data: T | null;
	error: unknown | null;
};

const withResult = async <T>(fn: () => Promise<T>): Promise<Result<T>> => {
	try {
		const data = await fn();
		return { data, error: null };
	} catch (error) {
		return { data: null, error };
	}
};

export interface FetchPlaylistData {
	tracks: KenkuTrack[];
	playlists: KenkuPlaylist[];
}

export interface FetchSoundboardData {
	sounds: KenkuSound[];
	soundboards: KenkuSoundboard[];
}

export const fetchPlaylists = (): Promise<Result<FetchPlaylistData>> =>
	withResult(() =>
		requestUrl(`${get(settings).hostname}/v1/playlist`).then((res) => res.json),
	);

export const fetchSoundboards = (): Promise<Result<FetchSoundboardData>> =>
	withResult(() =>
		requestUrl(`${get(settings).hostname}/v1/soundboard`).then(
			(res) => res.json,
		),
	);

export const fetchPlaybackState = (): Promise<Result<KenkuFMState>> =>
	withResult(() =>
		requestUrl(`${get(settings).hostname}/v1/playlist/playback`).then(
			(res) => res.json,
		),
	);
