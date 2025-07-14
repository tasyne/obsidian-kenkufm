// src/types.ts
export interface KenkuItem {
	title: string;
	id: string;
}

export interface KenkuTrack extends KenkuItem {
	duration: number;
	progress: number;
}

export interface KenkuFMState {
	playing: boolean;
	track: KenkuTrack;
	playlist: KenkuItem;
}
