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
    import { Disc3, Pause, Play } from "lucide-svelte";
    import ProgressBar from "./ProgressBar.svelte";

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

    $: trackTitle = config.label ? config.label : track?.title;
</script>

{#if error}
    <div
        class="p-4 rounded-xl shadow"
        style="background-color: rgba(var(--callout-error), 0.1);"
    >
        {error}
    </div>
{:else}
    <div
        class="flex flex-col gap-2 p-4 rounded-xl shadow"
        style="background-color: var(--background-primary-alt);"
    >
        <div class="flex items-center gap-2 track-header pb-4">
            <Disc3 />
            <div
                class="text-sm font-semibold"
                style="color: var(--text-normal);"
            >
                {trackTitle}
            </div>
            <button
                class="ml-auto rounded-xl transition mod-cta"
                on:click={togglePlay}
            >
                {#if $isPlaying}
                    <Pause />
                {:else}
                    <Play />
                {/if}
            </button>
        </div>

        {#if showProgress}
            <ProgressBar
                bind:value={$progressInfo.progress}
                max={$progressInfo.duration}
                onChange={(value) => track && seekTrack(track.id, value)}
            />
        {/if}
    </div>
{/if}

<style>
    .track-header {
        border-bottom: solid 1px var(--background-modifier-border);
    }
</style>
