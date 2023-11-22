import {MetadataCache, TFile, Vault} from "obsidian";
import {BST} from "./BTS";
import {getFrontmatterData} from "./Frontmatter";
import {HistoriumSettings, NoteData} from "./Types";
import {getImgUrl} from "./Utils";

export async function processFile(file: TFile, fileCache: MetadataCache, settings: HistoriumSettings, appVault: Vault): Promise<[number, NoteData] | null> {
	const metadata = fileCache.getFileCache(file);
	const frontmatter = metadata.frontmatter;
	const [startDate, noteTitle, noteDescription, noteImage, noteIndicator, noteType, noteColor, notePath, endDate, noteGroup] = getFrontmatterData(
		frontmatter,
		settings.frontmatterKeys,
		file,
	);
	let noteId = +startDate.replace(/-/g, '');
	if (startDate[0] == '-') {
		noteId *= -1;
	}
	if (!Number.isInteger(noteId)) return null;
	const note = {
		date: startDate,
		title: noteTitle,
		description: noteDescription,
		image: getImgUrl(fileCache, appVault.adapter, noteImage),
		indicator: noteIndicator,
		class: noteColor,
		type: noteType,
		path: notePath,
		endDate: endDate,
		group: noteGroup,
	};
	return [noteId, [note]];
}
export async function getTimelineData(appVault: Vault, fileCache: MetadataCache, fileList: TFile[], settings: HistoriumSettings): Promise<[Map<number, NoteData>, number[]]> {
	const timeline = document.createElement('div');
	timeline.classList.add('timeline');
	const timelineNotes = new Map<number, NoteData>();
	const timelineDates = new BST<number>();
	const results = await Promise.all(fileList.map((file) => processFile(file, fileCache, settings, appVault)));
	for (const result of results) {
		if (result) {
			const [noteId, notes] = result;
			if (!timelineNotes.has(noteId)) {
				timelineNotes.set(noteId, notes);
				timelineDates.insert(noteId);
			} else {
				const existingNotes = timelineNotes.get(noteId);
				const insertIndex = settings.sortDirection ? 0 : existingNotes.length;
				existingNotes.splice(insertIndex, 0, ...notes);
			}
		}
	}
	return [timelineNotes, Array.from(timelineDates.inOrder())];
}