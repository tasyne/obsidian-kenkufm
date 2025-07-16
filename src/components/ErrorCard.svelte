<script lang="ts">
    import { InfoIcon } from "lucide-svelte";

    export let label: string = "Label";
</script>

<div
    class="flex flex-col gap-2 p-4 rounded-xl shadow"
    style="background-color: rgba(var(--callout-error), 0.2);"
>
    <!-- Header -->
    <div class="flex items-center gap-2">
        <InfoIcon />
        <div class="text-sm font-semibold" style="color: var(--text-normal);">
            {label}
        </div>

        <slot name="button" />
    </div>

    <slot />
</div>
