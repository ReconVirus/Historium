import {type HistoriumSettings, type FrontmatterKeys, DEFAULT_SETTINGS} from './Types';
import {TimelineProcessor} from './Block';
import {insertTimelineYaml} from './Frontmatter';
import {HistoriumSettingTab} from './Settings';
import {MarkdownView, Plugin} from 'obsidian';

export default class HistoriumPlugin extends Plugin {
	settings: HistoriumSettings;

	loadSettings = async () => {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	};

	saveSettings = async () => {
		await this.saveData(this.settings);
	};

	createTimelineProcessor = () => new TimelineProcessor();

	insertTimelineYaml = async (frontmatterKeys: FrontmatterKeys) => {
		try {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view) {
				await insertTimelineYaml(frontmatterKeys, view);
			}
		} catch (error) {
			console.error('Error inserting timeline Yaml:', error);
		}
	};

	processTimeline = async (source: string, el: HTMLElement, useVisTimeline: boolean) => {
		try {
			const timelineProcessor = this.createTimelineProcessor();
			await timelineProcessor.run(source, el, this.settings, this.app.vault.getMarkdownFiles(), this.app.metadataCache, this.app.vault, useVisTimeline);
		} catch (error) {
			console.error('Error processing timeline:', error);
		}
	};

	addCommands = () => {
		const commands = [
			{
				id: 'insert-timeline-event-yaml',
				name: 'Insert Timeline Event YAML',
				callback: () => {
					try {
						this.insertTimelineYaml(this.settings.frontmatterKeys);
					} catch (error) {
						console.error('Error executing command:', error);
					}
				},
			},
			{
				id: 'render-timeline',
				name: 'Render Timeline',
				callback: async () => {
					const proc = new TimelineProcessor();
					let view = this.app.workspace.getActiveViewOfType(MarkdownView);
					if (view) {
						await proc.insertTimelineIntoCurrentNote(view, this.settings, this.app.vault.getMarkdownFiles(), this.app.metadataCache, this.app.vault);
					}
				},
			},
		];
		for (const command of commands) {
			this.addCommand(command);
		}
		if (this.settings.showRibbonCommand) {
			this.addRibbonIcon('scatter-chart', 'Insert Timeline Event YAML', async () => {
				try {
					await this.insertTimelineYaml(this.settings.frontmatterKeys);
				} catch (error) {
					console.error('Error executing command:', error);
				}
			});
		}
	};

	registerProcessors = () => {
		this.registerMarkdownCodeBlockProcessor('timeline', (source, el) => this.processTimeline(source, el, false));
		this.registerMarkdownCodeBlockProcessor('timeline-vis', (source, el) => this.processTimeline(source, el, true));
	};

	onload = async () => {
		await this.loadSettings();
		console.log('Loaded Historium Plugin');

		this.addCommands();
		this.registerProcessors();

		this.addSettingTab(new HistoriumSettingTab(this.app, this));
	};

	onunload = () => {
		console.log('unloading plugin');
	};
}
