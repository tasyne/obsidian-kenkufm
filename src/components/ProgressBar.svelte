<script lang="ts">
    export let value = 0;
    export let max = 100;
    export let onChange: (val: number) => void = () => {};

    let internalValue = value;

    $: if (!dragging && value !== internalValue) {
        internalValue = value;
    }

    let dragging = false;

    function handleInput(event: Event) {
        internalValue = +(event.target as HTMLInputElement).value;
    }

    function handleChange() {
        dragging = false;
        onChange(internalValue);
    }

    function handleStart() {
        dragging = true;
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

    $: percent = (internalValue / max) * 100;
    $: sliderStyle = `background: linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${percent}%, var(--background-primary) ${percent}%, var(--background-primary) 100%)`;
</script>

<div class="flex flex-col gap-2 progress-container">
    <div class="flex justify-between text-xs mt-2">
        <span>{formatTime(internalValue)}</span>
        <span>{formatTime(max)}</span>
    </div>
    <input
        type="range"
        min="0"
        {max}
        value={internalValue}
        on:input={handleInput}
        on:change={handleChange}
        on:mousedown={handleStart}
        on:touchstart={handleStart}
        class="progress-bar-slider"
        style={sliderStyle}
    />
</div>

<style>
    .progress-container {
        border-top: solid 1px var(--background-modifier-border);
    }
    .progress-bar-slider {
        width: 100%;
        height: 8px;
        border-radius: 4px;
        outline: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
    }

    .progress-bar-slider::-webkit-slider-thumb {
        background: var(--color-accent);
        cursor: pointer;
        border: none;
    }

    .progress-bar-slider::-moz-range-thumb {
        background: var(--color-accent);
        cursor: pointer;
        border: none;
    }
</style>
