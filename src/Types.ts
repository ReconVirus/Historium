export interface FrontmatterKeys {
	startDateKey: string[];
	endDateKey: string[];
	titleKey: string[];
	descriptionKey: string[];
	imageKey: string[];
	indicatorKey: string[];
}

export const DEFAULT_FRONTMATTER_KEYS: FrontmatterKeys = {
	startDateKey: ['start-date, fc-date'],
	endDateKey: ['end-date, fc-end'],
	titleKey: ['Title'],
	descriptionKey: ['Description'],
	imageKey: ['Image'],
	indicatorKey: ['Indicator'],
}

export const DEFAULT_SETTINGS: HistoriumSettings = {
	timelineTag: 'timeline',
	sortDirection: true,
	notePreviewOnHover: true,
	frontmatterKeys: DEFAULT_FRONTMATTER_KEYS,
	era: [' BC', ' AD'],
	showRibbonCommand: true
}

export interface HistoriumSettings {
	era: any;
	timelineTag: string;
	sortDirection: boolean;
	notePreviewOnHover: boolean;
	frontmatterKeys: FrontmatterKeys;
	showRibbonCommand: boolean
}

export interface TimelineArgs {
	tags: string;
	divHeight: number;
	startDate: string;
	endDate: string;
	minDate: string;
	maxDate: string;
	[key: string]: string | number;
}

export interface CardContainer {
	date: Date | string,
	title: string,
	description: string,
	image: string,
	indicator: string,
	type: string,
	class: string,
	path: string,
	endDate: Date | string,
	group: string,
}

export type NoteData = CardContainer[];
export type AllNotesData = NoteData[];