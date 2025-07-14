<script lang="ts">
    import { onMount } from "svelte";
    import type { KenkuFmTrackYaml } from "../processors/trackProcessor";
    import { derived } from "svelte/store";
    import type { KenkuItem } from "../types";
    import {
        getTrackById,
        pausePlayback,
        playTrack,
        seekTrack,
    } from "../utils/kenku";
    import { currentState } from "../stores/kenkuStore";

    export let config: KenkuFmTrackYaml;

    let track: KenkuItem | undefined;
    let error: string = "";
    let showProgress: boolean = false;
    onMount(() => {
        track = getTrackById(config.id);
        showProgress = !!config.showProgress;
        if (!track) {
            error = "Unable to find track with that id";
        }
    });

    const isPlaying = derived(currentState, ($state) => {
        return $state?.playing && $state.track?.id === track?.id;
    });

    const progressInfo = derived(currentState, ($state) => {
        if (!$state) {
            return { progress: 0, duration: 1 };
        }

        const isThisTrack = $state.track?.id === track?.id;
        return isThisTrack
            ? {
                  progress: $state.track?.progress ?? 0,
                  duration: $state.track?.duration ?? 1,
              }
            : { progress: 0, duration: 1 };
    });

    function togglePlay() {
        if (track) {
            if ($isPlaying) {
                pausePlayback();
            } else {
                playTrack(track.id);
            }
        }
    }

    function formatTime(seconds: number): string {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        const pad = (n: number) => n.toString().padStart(2, "0");
        return hrs > 0
            ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
            : `${pad(mins)}:${pad(secs)}`;
    }
</script>

{#if error}
    <div class="p-4 rounded-xl shadow text-red-600 bg-red-200">
        {error}
    </div>
{:else}
    <div
        class="gap-4 p-4 rounded-xl shadow"
        style="background-color: var(--background-primary-alt);"
    >
        <div class="flex items-center gap-4">
            <div
                class="text-lg font-semibold"
                style="color: var(--text-normal);"
            >
                {config.label ? config.label : track?.title}
            </div>

            <button
                class="ml-auto px-4 py-2 rounded-xl transition"
                on:click={togglePlay}
            >
                {#if $isPlaying}
                    ⏸ Pause
                {:else}
                    ▶ Play
                {/if}
            </button>
        </div>

        {#if showProgress}
            <div class="track-progress-container mt-2 rounded">
                <div class="track-progress-background"></div>
                <div
                    class="track-progress-fill"
                    style="width: {($progressInfo.progress /
                        $progressInfo.duration) *
                        100}%"
                ></div>
                <input
                    type="range"
                    min="0"
                    max={$progressInfo.duration}
                    step="0.1"
                    value={$progressInfo.progress}
                    class="track-progress-input"
                    on:change={(e) => {
                        if (track) {
                            seekTrack(
                                track.id,
                                parseFloat(e.currentTarget.value),
                            );
                        }
                    }}
                />
            </div>
            <div class="track-progress-time flex justify-between text-xs mt-2">
                <span>{formatTime($progressInfo.progress)}</span>
                <span>{formatTime($progressInfo.duration)}</span>
            </div>
        {/if}
    </div>
{/if}

<style>
    .track-progress-container {
        position: relative;
        height: 0.5rem;
    }

    .track-progress-background {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 9999px;
        background-color: var(--background-primary);
        width: 100%;
        pointer-events: none;
    }

    .track-progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 9999px;
        background-color: var(--color-accent);
        pointer-events: none;
    }

    .track-progress-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 10;
    }
    .track-progress-time {
        color: var(--text-muted);
    }
</style>
