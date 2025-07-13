import type KenkuFMRemotePlugin from "../main";
import { trackProcessor } from "./trackProcessor";

export const registerCodeBlockProcessors = (plugin: KenkuFMRemotePlugin) => {
	plugin.registerMarkdownCodeBlockProcessor("kenkufm-track", trackProcessor);
};
