import  HistoriumPlugin from './Main'
import {App, PluginSettingTab, Setting} from 'obsidian'

export class TimelinesSettingTab extends PluginSettingTab {
	plugin: HistoriumPlugin;

	constructor(app: App, plugin: HistoriumPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'Historium Settings'});

		new Setting(containerEl)
			.setName('Default timeline tag')
			.setDesc("Tag to specify which notes to include in the created timelines e.g. timeline for #timeline tag.")
			.addText(text => text
				.setPlaceholder(this.plugin.settings.timelineTag)
				.onChange(async (value) => {
					this.plugin.settings.timelineTag = value;
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
            .setName('Era Suffix')
            .setDesc('Set custom eras for timelines such as "BC" or "AD"')
            .addText(text => text
                .setPlaceholder(this.plugin.settings.era.join(','))
                .setValue(this.plugin.settings.era)
                .onChange(async (value) => {
                    this.plugin.settings.era = value.split(',');
                    await this.plugin.saveSettings();
                }));

		new Setting(containerEl)
			.setName('Chronological Direction')
			.setDesc('When enabled, events will be sorted from old to new. Turn this setting off to sort from new to old.')
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.sortDirection);
				toggle.onChange(async (value) => {
					this.plugin.settings.sortDirection = value;
					await this.plugin.saveSettings();
				})});

		new Setting(containerEl)
			.setName("Display Note Preview On Hover")
			.setDesc("When enabled, linked notes will display as a pop up when hovering over an event in the timeline.")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.notePreviewOnHover);
				toggle.onChange(async (value) => {
					this.plugin.settings.notePreviewOnHover = value;
					await this.plugin.saveSettings();
				})});

        new Setting(containerEl)
            .setName('Show Ribbon Button')
            .setDesc('Adds a icon to insert Yaml to create a timeline event')
            .addToggle((toggle) => {
                toggle.setValue(this.plugin.settings.showRibbonCommand)
                toggle.onChange(async (value) => {
                    this.plugin.settings.showRibbonCommand = value
                    await this.plugin.saveSettings()
                })});


		containerEl.createEl('h5', { text: "Customize Frontmatter Keys" }).appendChild(
			createEl("p", {
				text: "Specify the front matter keys used to extract start dates, end dates, and titles for the timeline notes. Defaults to 'start-date', 'end-date', and 'title'.",
				cls: "setting-item-description"
			}));

		new Setting(containerEl)
			.setName('Start Date Keys')
			.setDesc('Comma-separated list of frontmatter keys for start date. Example: start-date,fc-date')
			.addText(text => text
				.setPlaceholder(this.plugin.settings.frontmatterKeys.startDateKey.join(','))
				.onChange(async (value) => {
					this.plugin.settings.frontmatterKeys.startDateKey = value.split(',');
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('End Date Keys')
			.setDesc('Comma-separated list of frontmatter keys for end date.')
			.addText(text => text
				.setPlaceholder(this.plugin.settings.frontmatterKeys.endDateKey.join(','))
				.onChange(async (value) => {
					this.plugin.settings.frontmatterKeys.endDateKey = value.split(',');
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Title Key')
			.setDesc('Frontmatter key to be used for title.')
			.addText(text => text
				.setPlaceholder(this.plugin.settings.frontmatterKeys.titleKey[0])
				.onChange(async (value) => {
					this.plugin.settings.frontmatterKeys.titleKey = [value];
					await this.plugin.saveSettings();
				}));

        new Setting(containerEl)
            .setName('Description Key')
            .setDesc('Frontmatter key to be used for description.')
            .addText(text => text
                .setPlaceholder(this.plugin.settings.frontmatterKeys.descriptionKey[0])
                .onChange(async (value) => {
                    this.plugin.settings.frontmatterKeys.descriptionKey = [value];
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Image Key')
            .setDesc('Frontmatter key to be used for image.')
            .addText(text => text
                .setPlaceholder(this.plugin.settings.frontmatterKeys.imageKey[0])
                .onChange(async (value) => {
                    this.plugin.settings.frontmatterKeys.imageKey = [value];
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Indicator Key')
            .setDesc('Frontmatter key to be used for indicator.')
            .addText(text => text
                .setPlaceholder(this.plugin.settings.frontmatterKeys.indicatorKey[0])
                .onChange(async (value) => {
                    this.plugin.settings.frontmatterKeys.indicatorKey = [value];
                    await this.plugin.saveSettings();
                }));

	}
}