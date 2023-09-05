import type {TimelinesSettings, FrontmatterKeys} from './Types';
import {TimelineProcessor} from './Block';
import {MarkdownView, Plugin} from 'obsidian';
import {TimelinesSettingTab} from './Settings';
import {DEFAULT_FRONTMATTER_KEYS} from './Types'

const DEFAULT_SETTINGS: TimelinesSettings = {
	timelineTag: 'timeline',
	sortDirection: true,
	notePreviewOnHover: true,
	frontmatterKeys: DEFAULT_FRONTMATTER_KEYS,
	era: [' BC', ' AD'],
	showRibbonCommand: true
}

export default class  HistoriumPlugin extends Plugin {
	settings: TimelinesSettings;

    async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async insertTimelineYaml(frontmatterKeys: FrontmatterKeys) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (view) {
			const timelineProcessor = new TimelineProcessor();
			await timelineProcessor.insertTimelineYaml(frontmatterKeys, view);
		}
	}

    async addCommandToInsertTimelineYAML() {
        this.addCommand({
			id: 'insert-timeline-event-yaml',
			name: 'Insert Timeline Event YAML',
			callback: async () => {
				return await this.insertTimelineYaml(this.settings.frontmatterKeys);
			}
		});
    }

    async registerTimelineBlockProcessor(blockType: string, useVisTimeline: boolean) {
		this.registerMarkdownCodeBlockProcessor(blockType, async (source, el, ctx) => {
            const timelineProcessor = new TimelineProcessor();
            await timelineProcessor.run(source, el, this.settings, this.app.vault.getMarkdownFiles(), this.app.metadataCache, this.app.vault, useVisTimeline);
        });
    }

	async onload() {
		// Load message
		await this.loadSettings();
		console.log('Loaded Historium Plugin');
        
        this.addCommandToInsertTimelineYAML();
            if (this.settings.showRibbonCommand) {
                this.addRibbonIcon('calendar-range', 'Insert Timeline Event YAML', async () => {
                    await this.insertTimelineYaml(this.settings.frontmatterKeys);
                });
            }
            this.addCommand({
                id: "render-timeline",
                name: "Render Timeline",
                callback: async () => {
                    const proc = new TimelineProcessor();
                    let view = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (view) {
                        await proc.insertTimelineIntoCurrentNote(view, this.settings, this.app.vault.getMarkdownFiles(), this.app.metadataCache, this.app.vault);
                    }
                }
            });

        this.registerTimelineBlockProcessor('timeline', false);
        this.registerTimelineBlockProcessor('timeline-vis', true);

		this.addSettingTab(new TimelinesSettingTab(this.app, this));
	}

	onunload() {
		console.log('unloading plugin');
	}

}