// src/stores/kenkuStore.ts
import { writable } from "svelte/store";
import type {
	KenkuFMState,
	KenkuPlaylist,
	KenkuTrack,
	KenkuSound,
	KenkuSoundboard,
} from "../types";
import type { ObsidianNoteConnectionsSettings } from "../settings/settings";
import { DEFAULT_SETTINGS } from "../settings/settings";

// settings
export const settings =
	writable<ObsidianNoteConnectionsSettings>(DEFAULT_SETTINGS);

// sound states
export const tracks = writable<KenkuTrack[]>([]);
export const playlists = writable<KenkuPlaylist[]>([]);
export const sounds = writable<KenkuSound[]>([]);
export const soundboards = writable<KenkuSoundboard[]>([]);
export const currentState = writable<KenkuFMState | null>(null);
export const isKenkuConnected = writable<boolean>(false);
