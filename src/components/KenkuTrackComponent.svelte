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

    function togglePlay() {
        if (track) {
            if ($isPlaying) {
                KenkuController.pause();
            } else {
                KenkuController.playTrack(config.id);
            }
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
            {#if $isPlaying}
                ⏸ Pause
            {:else}
                ▶ Play
            {/if}
        </button>
    </div>
{/if}
