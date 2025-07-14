<script lang="ts">
    import { onMount } from "svelte";
    import { playback } from "../stores/playback";
    import { KenkuController, type KenkuItem } from "../utils/kenku";
    import type { KenkuFmTrackYaml } from "../processors/trackProcessor";
    import { derived } from "svelte/store";

    export let config: KenkuFmTrackYaml;

    let track: KenkuItem | undefined;
    let error: string = "";
    onMount(() => {
        track = KenkuController.getTrackById(config.id);
        if (!track) {
            error = "Unable to find track with that id";
        }
    });
    // This will be reactive and track if the current playing track is this one
    const isPlaying = derived(playback, ($playback) => {
        return (
            $playback.state?.playing && $playback.state.track?.id === track?.id
        );
    });

    const progressInfo = derived(playback, ($playback) => {
        const current = $playback.state;
        const isThisTrack = current?.track?.id === track?.id;
        return isThisTrack
            ? {
                  progress: current?.track.progress ?? 0,
                  duration: current?.track?.duration ?? 1,
              }
            : { progress: 0, duration: 1 };
    });

    function togglePlay() {
        if (track) {
            if ($isPlaying) {
                KenkuController.pause();
            } else {
                KenkuController.playTrack(config.id);
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
        <div class="slider-container mt-2 rounded">
            <div class="slider-track"></div>
            <div
                class="slider-fill"
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
                class="slider-input"
                on:change={(e) => {
                    if (track) {
                        KenkuController.seekTrack(
                            track.id,
                            parseFloat(e.currentTarget.value),
                        );
                    }
                }}
            />
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>{formatTime($progressInfo.progress)}</span>
            <span>{formatTime($progressInfo.duration)}</span>
        </div>
    </div>
{/if}

<style>
    .slider-container {
        position: relative;
        height: 0.5rem;
    }

    .slider-track {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 9999px;
        background-color: var(--background-primary);
        width: 100%;
        pointer-events: none;
    }

    .slider-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-radius: 9999px;
        background-color: var(--color-accent);
        pointer-events: none;
    }

    .slider-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        z-index: 10;
    }
</style>
