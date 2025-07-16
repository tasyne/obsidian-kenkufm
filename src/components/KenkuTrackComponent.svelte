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
    } from "../kenku/kenku";
    import { currentState, isKenkuConnected } from "../stores/kenkuStore";
    import { Disc3, CirclePlay, CirclePause, RefreshCw } from "lucide-svelte";
    import ProgressBar from "./ProgressBar.svelte";
    import ErrorCard from "./ErrorCard.svelte";
    import * as kenkuConnector from "../kenku/kenkuConnector";

    export let config: KenkuFmTrackYaml;

    let track: KenkuItem | undefined;
    let error: string = "";
    let showProgress: boolean = false;
    onMount(() => {
        showProgress = !!config.showProgress;

        track = getTrackById(config.id);
        if (!track) {
            error = "Unable to find track with that id";
        }
    });

    const isPlaying = derived(currentState, ($state) => {
        return $state?.playing && $state.track?.id === track?.id;
    });

    const isConnected = derived(isKenkuConnected, ($connected) => $connected);

    $: isConnecting = false;
    $: trackTitle = config.label ? config.label : track?.title;

    const attemptConnection = async () => {
        isConnecting = true;
        await kenkuConnector.connect();
        track = getTrackById(config.id);
        if (!track) {
            error = "Unable to find track with that id";
        } else {
            error = "";
        }
        isConnecting = false;
    };

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
</script>

{#if $isConnected}
    {#if error}
        <ErrorCard label={error} />
    {:else}
        <div
            class="flex flex-col gap-2 p-4 rounded-xl shadow"
            style="background-color: var(--background-primary-alt);"
        >
            <div class="flex items-center gap-2">
                <Disc3 />
                <div
                    class="text-sm font-semibold"
                    style="color: var(--text-normal);"
                >
                    {trackTitle}
                </div>
                <button
                    class="ml-auto rounded-md transition {$isPlaying
                        ? ''
                        : 'mod-cta'}"
                    on:click={togglePlay}
                >
                    {#if $isPlaying}
                        <CirclePause />
                    {:else}
                        <CirclePlay />
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
{:else}
    <ErrorCard label="Kenku FM not connected">
        <button
            slot="button"
            class="ml-auto rounded-md transition attempt-to-connect"
            style=""
            disabled={isConnecting}
            on:click={attemptConnection}
        >
            <RefreshCw />
        </button>
    </ErrorCard>
{/if}

<style>
    .attempt-to-connect {
        background-color: rgba(var(--callout-error), 0.4);
    }

    .attempt-to-connect:hover {
        background-color: rgba(var(--callout-error), 0.2);
    }
</style>
