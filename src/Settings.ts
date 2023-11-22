import {App, Notice, PluginSettingTab, Setting} from "obsidian";
import HistoriumPlugin from "./Main";
import {DEFAULT_SETTINGS} from "./Types";

function createSetting(containerEl: HTMLElement, name: string, desc: string, placeholder: string, callback: (value: string) => void, type: string = 'text') {
    const setting = new Setting(containerEl)
        .setName(name)
        .setDesc(desc);

    if (type === 'text') {
        setting.addText((text) =>
            text.setPlaceholder(placeholder).onChange(async (value) => {
                callback(value);
            }),
        );
    } else if (type === 'toggle') {
        setting.addToggle((toggle) =>
            toggle.setValue(placeholder === 'true').onChange(async (value) => {
                callback(value.toString());
            }),
        );
    }
}

export class HistoriumSettingTab extends PluginSettingTab {
	plugin: HistoriumPlugin;

	constructor(app: App, plugin: HistoriumPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();
		containerEl.createEl('h2', {text: 'Historium Settings'});

        createSetting(containerEl, 'Default timeline tag', 'Tag to specify which notes to include in the created timelines e.g. timeline for #timeline tag.', this.plugin.settings.timelineTag, async (value) => {
            this.plugin.settings.timelineTag = value;
            await this.plugin.saveSettings();
        });

        createSetting(containerEl, 'Era Suffix', 'Set custom eras for timelines such as "BC" or "AD"', this.plugin.settings.era.join(','), async (value) => {
            this.plugin.settings.era = value.split(',');
            await this.plugin.saveSettings();
        });

        createSetting(containerEl, 'Chronological Direction', 'When enabled, events will be sorted from old to new. Turn this setting off to sort from new to old.', this.plugin.settings.sortDirection.toString(), async (value) => {
            this.plugin.settings.sortDirection = value === 'true';
            await this.plugin.saveSettings();
        }, 'toggle');

        createSetting(containerEl, 'Display Note Preview On Hover', 'When enabled, linked notes will display as a pop up when hovering over an event in the timeline.', this.plugin.settings.notePreviewOnHover.toString(), async (value) => {
            this.plugin.settings.notePreviewOnHover = value === 'true';
            await this.plugin.saveSettings();
        }, 'toggle');

        createSetting(containerEl, 'Show Ribbon Button', 'Adds a icon to insert Yaml to create a timeline event', this.plugin.settings.showRibbonCommand.toString(), async (value) => {
            this.plugin.settings.showRibbonCommand = value === 'true';
            await this.plugin.saveSettings();
        }, 'toggle');

		containerEl.createEl('h3', {text: 'Customize Properties Keys'}).appendChild(
			createEl('p', {
				text: 'Specify the Property keys used to extract start dates, end dates, title, descriptions, images, and indicators for the timeline notes.',
				cls: 'setting-item-description',
			}),
		);

        createSetting(containerEl, 'Start Date Keys', 'Comma-separated list of frontmatter keys for start date. Example: start-date,fc-date', this.plugin.settings.frontmatterKeys.startDateKey.join(','), async (value) => {
            this.plugin.settings.frontmatterKeys.startDateKey = value.split(',');
            await this.plugin.saveSettings();
        });

        createSetting(containerEl, 'End Date Keys', 'Comma-separated list of frontmatter keys for end date.', this.plugin.settings.frontmatterKeys.endDateKey.join(','), async (value) => {
            this.plugin.settings.frontmatterKeys.endDateKey = value.split(',');
            await this.plugin.saveSettings();
        });

        createSetting(containerEl, 'Title Key', 'Frontmatter key to be used for title.', this.plugin.settings.frontmatterKeys.titleKey[0], async (value) => {
            this.plugin.settings.frontmatterKeys.titleKey = [value];
            await this.plugin.saveSettings();
        });

        createSetting(containerEl, 'Description Key', 'Frontmatter key to be used for description.', this.plugin.settings.frontmatterKeys.descriptionKey[0], async (value) => {
            this.plugin.settings.frontmatterKeys.descriptionKey = [value];
            await this.plugin.saveSettings();
        });

        new Setting(containerEl)
            .setName('Save Settings')
            .setDesc('Save the changes made to the settings.')
            .addButton((button) =>
                button.setButtonText('Save').onClick(async () => {
                    await this.plugin.saveSettings();
                    new Notice('Settings saved.');
                    this.display();
                }),
            );

        new Setting(containerEl)
            .setName('Reset Settings')
            .setDesc('Reset all settings to their default values.')
            .addButton((button) =>
                button.setButtonText('Reset').onClick(async () => {
                    this.plugin.settings = {...DEFAULT_SETTINGS};
                    await this.plugin.saveSettings();
                    new Notice('Settings reset to default.');
                    this.display();
                }),
            );
	}
}