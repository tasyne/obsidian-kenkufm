// src/stores/kenkuStore.ts
import { writable } from "svelte/store";
import type { KenkuItem, KenkuFMState } from "../types";

export const tracks = writable<KenkuItem[]>([]);
export const playlists = writable<KenkuItem[]>([]);
export const sounds = writable<KenkuItem[]>([]);
export const soundboards = writable<KenkuItem[]>([]);
export const currentState = writable<KenkuFMState | null>(null);
