import { FrontMatterCache, TFile, Notice } from "obsidian";
import { FrontmatterKeys } from "./Types";

export function getFrontmatterData(frontmatter: FrontMatterCache | null, frontmatterKeys: FrontmatterKeys, file: TFile): [string, string, string, string, string, string, string, string, string, string | null] {
	const startDate = findMatchingFrontmatterKey(frontmatter, frontmatterKeys.startDateKey);
	if (!startDate) {
		new Notice(`No date found for ${file.name}`);
		return ['', '', '', '', '', '', '', '', '', ''];
	}
	const noteTitle = findMatchingFrontmatterKey(frontmatter, frontmatterKeys.titleKey) ?? file.name.replace(".md", "");
	const noteDescription = frontmatter?.description;
	const noteImage = frontmatter?.image;
    const noteIndicator = findMatchingFrontmatterKey(frontmatter, frontmatterKeys.indicatorKey);
    const type = frontmatter["type"] ?? 'box';
	const noteClass = frontmatter["color"] ?? '';
	const notePath = '/' + file.path;
	const endDate = findMatchingFrontmatterKey(frontmatter, frontmatterKeys.endDateKey) ?? null;
    const noteGroup = frontmatter?.group;
	return [startDate, noteTitle, noteDescription, noteImage, noteIndicator, type, noteClass, notePath, endDate, noteGroup];
}
export function findMatchingFrontmatterKey(frontmatter: FrontMatterCache | null, keys: string[]) {
	for (const key of keys) {
		if (frontmatter && frontmatter[key]) {
			return frontmatter[key];
		}
	}
	return null;
}