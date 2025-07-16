import { requestUrl } from "obsidian";
import type {
	KenkuFMState,
	KenkuPlaylist,
	KenkuSound,
	KenkuSoundboard,
	KenkuTrack,
} from "../types";
const BASE_URL = "http://127.0.0.1:3333/v1";

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
	withResult(() => requestUrl(`${BASE_URL}/playlist`).then((res) => res.json));

export const fetchSoundboards = (): Promise<Result<FetchSoundboardData>> =>
	withResult(() =>
		requestUrl(`${BASE_URL}/soundboard`).then((res) => res.json),
	);

export const fetchPlaybackState = (): Promise<Result<KenkuFMState>> =>
	withResult(() =>
		requestUrl(`${BASE_URL}/playlist/playback`).then((res) => res.json),
	);
