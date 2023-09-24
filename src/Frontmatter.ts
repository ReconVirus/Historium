import {FrontmatterKeys} from './Types';
import {FrontMatterCache, MarkdownView, Notice, TFile} from 'obsidian';

export function findMatchingFrontmatterKey(frontmatter: FrontMatterCache | null, keys: string[]) {
	for (const key of keys) {
		if (frontmatter && frontmatter[key]) {
			return frontmatter[key];
		}
	}
	return null;
}
export function getFrontmatterData(
	frontmatter: FrontMatterCache | null,
	frontmatterKeys: FrontmatterKeys,
	file: TFile,
): [string, string, string, string, string, string, string, string, string, string | null] {
	const startDate = findMatchingFrontmatterKey(frontmatter, frontmatterKeys.startDateKey);
	if (!startDate) {
		new Notice(`No date found for ${file.name}`);
		return ['', '', '', '', '', '', '', '', '', ''];
	}
	const noteTitle = findMatchingFrontmatterKey(frontmatter, frontmatterKeys.titleKey) ?? file.name.replace('.md', '');
	const noteDescription = frontmatter?.description;
	const noteImage = frontmatter?.image;
	const noteIndicator = findMatchingFrontmatterKey(frontmatter, frontmatterKeys.indicatorKey);
	const noteType = frontmatter['type'] ?? 'box';
	const noteColor = frontmatter['color'] ?? '';
	const notePath = '/' + file.path;
	const endDate = findMatchingFrontmatterKey(frontmatter, frontmatterKeys.endDateKey) ?? null;
	const noteGroup = frontmatter?.group;
	return [startDate, noteTitle, noteDescription, noteImage, noteIndicator, noteType, noteColor, notePath, endDate, noteGroup];
}
export async function insertTimelineYaml(frontmatterKeys: FrontmatterKeys, sourceView: MarkdownView) {
	const editor = sourceView.editor;
	if (!editor) return;
	let yaml = 'Tags: timeline\n';
	for (const key of Object.values(frontmatterKeys)) {
		yaml += `${key}:\n`;
	}
	yaml += 'type:\ncolor:\n';
	// Check if the current note already has a YAML header
	const firstLine = editor.getLine(0);
	if (firstLine === '---') {
		// If it does, add the new keys to the existing YAML header
		let frontmatterEnd = 1;
		while (frontmatterEnd <= editor.lastLine() && editor.getLine(frontmatterEnd) !== '---') {
			frontmatterEnd++;
		}
		// Add the new keys to the existing YAML header
		let existingYaml = editor.getRange({line: 0, ch: 0}, {line: frontmatterEnd, ch: 0});
		let newKeys = yaml.split('\n').filter((key) => !existingYaml.includes(key.split(':')[0]));
		editor.replaceRange(newKeys.join('\n') + '\n', {line: frontmatterEnd, ch: 0}, {line: frontmatterEnd, ch: 0});
	} else {
		// If not, insert the new YAML block at the beginning of the note
		yaml = '---\n' + yaml + '---\n';
		editor.replaceRange(yaml, {line: 0, ch: 0}, {line: 0, ch: 0});
	}
}
