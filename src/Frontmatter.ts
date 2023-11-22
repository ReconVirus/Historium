import {FrontMatterCache, TFile, MarkdownView} from "obsidian";
import {FrontmatterKeys} from "./Types";
import {addYamlBlock} from "./Utils";

export function findMatchingFrontmatterKey(frontmatter: FrontMatterCache | null, keys: string[]): any {
    for (const key of keys) {
        if (frontmatter && frontmatter[key]) {
            return frontmatter[key];
        }
    }
    return null;
}

function getFrontmatterKey(frontmatter: FrontMatterCache | null, keys: string[]): any {
    const value = findMatchingFrontmatterKey(frontmatter, keys);
    return value;
}

export function getFrontmatterData(
    frontmatter: FrontMatterCache | null,
    frontmatterKeys: FrontmatterKeys,
    file: TFile,
	): [string, string, string, string, string, string, string, string, string | null, string | null] {
    const startDate = getFrontmatterKey(frontmatter, frontmatterKeys.startDateKey);
    const noteTitle = getFrontmatterKey(frontmatter, frontmatterKeys.titleKey) ?? file.name.replace('.md', '');
    const noteDescription = frontmatter?.description;
    const noteImage = frontmatter?.image;
    const noteIndicator = getFrontmatterKey(frontmatter, frontmatterKeys.indicatorKey);
    const noteType = frontmatter['type'] ?? 'box';
    const noteColor = frontmatter['color'] ?? '';
    const notePath = '/' + file.path;
    const endDate = getFrontmatterKey(frontmatter, frontmatterKeys.endDateKey);
    const noteGroup = frontmatter?.group;
    return [startDate, noteTitle, noteDescription, noteImage, noteIndicator, noteType, noteColor, notePath, endDate, noteGroup];
}

export async function insertTimelineYaml(frontmatterKeys: FrontmatterKeys, sourceView: MarkdownView) {
	const editor = sourceView.editor;
	const [YAML_START, YAML_END] = '---'
	if (!editor) return;
	let yaml = 'Tags: timeline\n';
	for (const key of Object.values(frontmatterKeys)) {
		yaml += `${key}:\n`;
	}
	yaml += 'type:\ncolor:\n';
	const firstLine = editor.getLine(0);
	if (firstLine === YAML_START) {
		let frontmatterEnd = 1;
		while (frontmatterEnd <= editor.lastLine() && editor.getLine(frontmatterEnd) !== YAML_END) {
			frontmatterEnd++;
		}
		let existingYaml = editor.getRange({line: 0, ch: 0}, {line: frontmatterEnd, ch: 0});
		let newKeys = yaml.split('\n').filter((key) => !existingYaml.includes(key.split(':')[0]));
		editor.replaceRange(newKeys.join('\n') + '\n', {line: frontmatterEnd, ch: 0}, {line: frontmatterEnd, ch: 0});
	} else {
		addYamlBlock(editor, yaml);
	}
}