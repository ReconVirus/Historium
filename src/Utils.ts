import type {App, DataAdapter, MetadataCache} from 'obsidian';
import {getAllTags, TFile} from 'obsidian';



export function parseTag(tag: string, tagSet: Set<string>) {
	tag = tag.trim();

	// Skip empty tags
	if (tag.length === 0) {
		return;
	}

	// Parse all subtags out of the given tag.
	tagSet.add(tag);
	while (tag.contains("/")) {
		tag = tag.substring(0, tag.lastIndexOf("/"));
		tagSet.add(tag);
	}
}

export function FilterMDFiles(file: TFile, tagSet: Set<string>, metadataCache: MetadataCache) {
	if (!tagSet || tagSet.size === 0) {
		return true;
	}

	let tags = getAllTags(metadataCache.getFileCache(file)).map(e => e.slice(1));

	if (tags && tags.length > 0) {
		let filetags = new Set<string>();
		tags.forEach(tag => parseTag(tag, filetags));
		return [...tagSet].every(val => filetags.has(val as string));
	}

	return false;
}

export function createDate(date: string): Date {
	let dateComp = date.split(',');
	// cannot simply replace '-' as need to support negative years
	return new Date(+(dateComp[0] ?? 0), +(dateComp[1] ?? 0) -1, +(dateComp[2] ?? 0), +(dateComp[3] ?? 0));
}

export function getImgUrl(app: App, vaultAdaptor: DataAdapter, path: string): string {

	if (!path) {
		return null;
	}

	let regex = new RegExp('^https:\/\/');
	if (path.match(regex)) {
		return path;
	}

	// Internal embed link format - "![[<link>]]"
	if (/^\!\[\[.+\]\]$/.test(path)) {
		const link = path.slice(3, -2);
		const file = app.metadataCache.getFirstLinkpathDest(link, '');
		return file ? app.vault.getResourcePath(file) : link;
	}

	return vaultAdaptor.getResourcePath(path);
}