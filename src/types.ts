// src/types.ts
export interface KenkuItem {
	title: string;
	id: string;
}

export type KenkuSound = KenkuItem;

export interface KenkuTrack extends KenkuItem {
	duration: number;
	progress: number;
}

export type KenkuPlaylist = KenkuItem;
export type KenkuSoundboard = KenkuItem;

export interface KenkuFMState {
	playing: boolean;
	track: KenkuTrack;
	playlist: KenkuItem;
}
