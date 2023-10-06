import type {HistoriumSettings, NoteData, TimelineArgs} from './Types';
import {BST} from './BTS';
import {getFrontmatterData} from './Frontmatter';
import {HorizontalTimeline, HorizontalTimelineData, HorizontalTimelineOptions} from './Htimeline';
import {FilterMDFiles, getImgUrl, parseTag} from './Utils';
import {VerticalTimeline} from './VerticalTimeline';
import {MarkdownView, MetadataCache, TFile, Vault} from 'obsidian';

export const RENDER_TIMELINE: RegExp = /<!--TIMELINE BEGIN tags=['"]([^"]*?)['"]-->([\s\S]*?)<!--TIMELINE END-->/i;

export class TimelineProcessor {
	createNoteCard(event: any): HTMLElement {
		let noteCard = document.createElement('div');
		noteCard.className = 'timeline-card';
		if (event.class) {
			noteCard.classList.add(event.class);
		}
		let thumb = event.image ? `<div class="thumb" style="background-image: url(${event.image})"></div>` : '';
		let article = `<article><h3><a class="internal-link" href="${event.path}">${event.title}</a></h3></article>`;
		let p = `<p>${event.description}</p>`;
		noteCard.innerHTML = thumb + article + p;
		return noteCard;
	}
	getStartEndDates(event: any): [Date, Date] {
		const getDate = (dateStr: string): Date => {
			let date = dateStr?.replace(/(.*)-\d*$/g, '$1');
			if (date && date[0] == '-') {
				let dateComp = date.substring(1, date.length).split('-');
				return new Date(+`-${dateComp[0]}`, +dateComp[1] - 1, +dateComp[2]);
			} else {
				return new Date(date);
			}
		};
		let start = getDate(event.date);
		let end = getDate(event.endDate);
		return [start, end];
	}
	async insertTimelineIntoCurrentNote({editor}: MarkdownView, settings: HistoriumSettings, vaultFiles: TFile[], fileCache: MetadataCache, appVault: Vault) {
		if (editor) {
			const source = editor.getValue();
			const match = RENDER_TIMELINE.exec(source);
			if (!match) return;

			const tagList = match[1];
			let divContent = `<!--TIMELINE BEGIN tags='${match[1]}'-->`;
			divContent += await this.run(tagList, null, settings, vaultFiles, fileCache, appVault, false);
			divContent += `<div class="timeline-rendered">${new Date().toString()}</div>`;
			divContent += '<!--TIMELINE END-->';
			editor.setValue(source.replace(match[0], divContent));
		}
	}
	parseArgs(source: string, visTimeline: boolean): TimelineArgs {
		let args: TimelineArgs = {
			tags: '',
			divHeight: 400,
			startDate: '-1000',
			endDate: '3000',
			minDate: '-3000',
			maxDate: '3000',
		};
		if (visTimeline) {
			source.split('\n').forEach((e) => {
				e = e.trim();
				if (e) {
					let [key, value] = e.split('=');
					if (value) {
						args[key] = value.trim();
					}
				}
			});
		} else {
			args.tags = source.trim();
		}
		return args;
	}
	getTagSet(tags: string, timelineTag: string): Set<string> {
		let tagSet = new Set<string>();
		tags.split(';').forEach((tag) => parseTag(tag, tagSet));
		tagSet.add(timelineTag);
		return tagSet;
	}
	filterFiles(vaultFiles: TFile[], tagSet: Set<string>, fileCache: MetadataCache): TFile[] {
		return vaultFiles.filter((file) => FilterMDFiles(file, tagSet, fileCache));
	}
	sortDates(timelineDates: number[], sortDirection: boolean): number[] {
		return timelineDates.sort((d1, d2) => (sortDirection ? d1 - d2 : d2 - d1));
	}
	async run(source: string, el: HTMLElement, settings: HistoriumSettings, vaultFiles: TFile[], fileCache: MetadataCache, appVault: Vault, visTimeline: boolean) {
		const args = this.parseArgs(source, visTimeline);
		const tagSet = this.getTagSet(args.tags, settings.timelineTag);
		const fileList = this.filterFiles(vaultFiles, tagSet, fileCache);
		if (!fileList) return;
		let [timelineNotes, timelineDates] = await getTimelineData(appVault, fileCache, fileList, settings);
		timelineDates = this.sortDates(timelineDates, settings.sortDirection);
		const timeline = document.createElement('div');
		timeline.setAttribute('class', 'timeline');
		if (!visTimeline) {
			VerticalTimeline(this, timeline, timelineNotes, timelineDates, settings);
			el.appendChild(timeline);
			return;
		}
		const [items, groups] = HorizontalTimelineData(this, timelineNotes, timelineDates);
		const options = HorizontalTimelineOptions(this, args, settings);
		HorizontalTimeline(this, timeline, items, options, groups);
		el.appendChild(timeline);
	}
}

async function processFile(file: TFile, fileCache: MetadataCache, settings: HistoriumSettings, appVault: Vault): Promise<[number, NoteData] | null> {
	const metadata = fileCache.getFileCache(file);
	const frontmatter = metadata.frontmatter;
	const [startDate, noteTitle, noteDescription, noteImage, noteIndicator, noteType, noteColor, notePath, endDate, noteGroup] = getFrontmatterData(
		frontmatter,
		settings.frontmatterKeys,
		file,
	);
	let noteId;
	if (startDate[0] == '-') {
		noteId = +startDate.substring(1).split('-').join('') * -1;
	} else {
		noteId = +startDate.split('-').join('');
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
async function getTimelineData(appVault: Vault, fileCache: MetadataCache, fileList: TFile[], settings: HistoriumSettings): Promise<[Map<number, NoteData>, number[]]> {
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
