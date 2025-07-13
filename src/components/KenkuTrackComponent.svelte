<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { KenkuFmTrackYaml } from "../processors/trackProcessor";
    import { KenkuController, type KenkuItem } from "../utils/kenku";

    export let config: KenkuFmTrackYaml;

    let isPlaying = false;
    let error: string = "";
    let track: KenkuItem | undefined;
    let interval: number;

    onMount(async () => {
        track = KenkuController.getTrackById(config.id);
        if (track === undefined) {
            error = "Unable to find track with that id";
            return;
        }

        // Initial check
        await updatePlayingState();

        // Start polling every second
        interval = window.setInterval(updatePlayingState, 1000);
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    async function updatePlayingState() {
        try {
            const state = await KenkuController.getState();
            isPlaying = state.playing && state.track.id === track?.id;
        } catch (err) {
            error = "Failed to get playback state";
        }
    }

    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            KenkuController.playTrack(config.id);
        } else {
            KenkuController.pause();
        }
    }
</script>

{#if error}
    <div class="p-4 rounded-xl shadow text-red-600 bg-red-200">
        {error}
    </div>
{:else}
    <div
        class="flex items-center gap-4 p-4 rounded-xl shadow"
        style="background-color: var(--background-primary-alt);"
    >
        <div class="text-lg font-semibold">
            {config.label ? config.label : track?.title}
        </div>

        <button
            class="ml-auto px-4 py-2 rounded-xl transition"
            on:click={togglePlay}
        >
            {#if isPlaying}
                ⏸ Pause
            {:else}
                ▶ Play
            {/if}
        </button>
    </div>
{/if}
