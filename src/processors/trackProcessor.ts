import { type MarkdownPostProcessorContext, Notice, parseYaml } from "obsidian";
import KenkuTrackComponent from "../components/KenkuTrackComponent.svelte";

export interface KenkuFmTrackYaml {
	id: string;
	label?: string;
	showProgress?: boolean;
}

export const trackProcessor = async (
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
) => {
	el.parentElement?.addClass("mt-2");

	try {
		const config: KenkuFmTrackYaml = parseYaml(source);
		new KenkuTrackComponent({
			target: el,
			props: {
				config: config,
			},
		});
	} catch (e) {
		new Notice("Failed to parse yaml and create kenku track component");
	}
};
