import { type MarkdownPostProcessorContext, parseYaml } from "obsidian";
import KenkuTrackComponent from "../components/KenkuTrackComponent.svelte";

export interface KenkuFmTrackYaml {
	id: string;
	label?: string;
}

export const trackProcessor = async (
	source: string,
	el: HTMLElement,
	ctx: MarkdownPostProcessorContext,
) => {
	try {
		const config: KenkuFmTrackYaml = parseYaml(source);
		new KenkuTrackComponent({
			target: el,
			props: {
				config: config,
			},
		});
	} catch (e) {
		console.error(`Kenku FM button Error:\n${e}`);
	}
};
