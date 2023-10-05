import {DataAdapter, MetadataCache} from 'obsidian';
import {getAllTags, TFile} from 'obsidian';
import {HistoriumSettings, NoteData} from './Types';

export function addEventListener(eventContainer: HTMLElement): void {
    eventContainer.addEventListener('click', (event) => {
        let el = eventContainer.getElementsByClassName('timeline-card')[0] as HTMLElement;
        el.style.setProperty('display', 'block');
        el.style.setProperty('top', `-${el.clientHeight + 10}px`);
    });
}

export function createDate(date: string): Date {
	let dateComp = date.split(',');
	// cannot simply replace '-' as need to support negative years
	return new Date(+(dateComp[0] ?? 0), +(dateComp[1] ?? 0) - 1, +(dateComp[2] ?? 0), +(dateComp[3] ?? 0));
}

export function createTemplate(settings: HistoriumSettings): (item: any) => HTMLElement {
    return function (item) {
        let eventContainer = document.createElement(settings.notePreviewOnHover ? 'a' : 'div');
        if ('href' in eventContainer) {
            eventContainer.addClass('internal-link');
            eventContainer.href = item.path;
        }
        eventContainer.setText(item.content);
        let eventCard = eventContainer.createDiv();
        eventCard.outerHTML = item.title;
        addEventListener(eventContainer);
        return eventContainer;
    }
}

export function FilterMDFiles(file: TFile, tagSet: Set<string>, metadataCache: MetadataCache) {
	if (!tagSet || tagSet.size === 0) {
		return true;
	}
	let tags = getAllTags(metadataCache.getFileCache(file)).map((e) => e.slice(1));
	if (tags && tags.length > 0) {
		let filetags = new Set<string>();
		tags.forEach((tag) => parseTag(tag, filetags));
		return [...tagSet].every((val) => filetags.has(val as string));
	}
	return false;
}

export function formatmajorLabel(date: Date, scale: string, settings: HistoriumSettings) {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}
	if (scale == 'year') {
		return '';
	}
	if (scale == 'month') {
		let year = date.getFullYear();
		let era = year < 0 ? settings.era[0] : settings.era[1];
		return `${year} ${era}`;
	} else if (scale == 'day') {
		let month = date.toLocaleString('default', {month: 'long'});
		return month;
	}
}

export function formatminorLabel(date: Date, scale: string, settings: HistoriumSettings) {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}
	if (scale == 'year') {
		let year = date.getFullYear();
		let era = year < 0 ? settings.era[0] : settings.era[1];
		return `${year} ${era}`;
	} else if (scale == 'month') {
		let month = date.toLocaleString('default', {month: 'long'});
		return month;
	} else if (scale == 'day') {
		let day = date.getDate();
		return day;
	}
}

export function getImgUrl(metadataCache: MetadataCache, vaultAdaptor: DataAdapter, path: string): string {
	if (!path) {
		return null;
	}
	if (path.startsWith('https://')) {
		return path;
	}
	// Internal embed link format - "![[<link>]]"
	if (/^\!\[\[.+\]\]$/.test(path)) {
		const link = path.slice(3, -2);
		const file = metadataCache.getFirstLinkpathDest(link, '');
		return file ? vaultAdaptor.getResourcePath(file.path) : link;
	}
	return vaultAdaptor.getResourcePath(path);
}

export function iterateTimelineEvents(timelineNotes: Map<number, NoteData>, timelineDates: number[], callback: (event: any) => void) {
	timelineDates.forEach((date) => {
		timelineNotes.get(date).forEach(callback);
	});
}

export function parseTag(tag: string, tagSet: Set<string>) {
	tag = tag.trim();
	// Skip empty tags
	if (tag.length === 0) {
		return;
	}
	// Parse all subtags out of the given tag.
	tagSet.add(tag);
	while (tag.contains('/')) {
		tag = tag.substring(0, tag.lastIndexOf('/'));
		tagSet.add(tag);
	}
}
