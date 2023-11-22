// Constants
export const DEFAULT_FRONTMATTER_KEYS: FrontmatterKeys = {
	startDateKey: ['start-date', 'fc-date'],
	endDateKey: ['end-date', 'fc-end'],
	titleKey: ['Title'],
	descriptionKey: ['Description'],
	imageKey: ['Image'],
	indicatorKey: ['Indicator'],
	groupKey: ['Group'],
};
export const DEFAULT_SETTINGS: HistoriumSettings = {
	era: [' BC', ' AD'],
	frontmatterKeys: DEFAULT_FRONTMATTER_KEYS,
	notePreviewOnHover: true,
	showRibbonCommand: true,
	sortDirection: true,
	timelineTag: 'timeline',
};

// Enumerations
enum TimelineItemType {
    Box = 'box',
    Point = 'point',
    Range = 'range',
    Background = 'background',
}

// Interfaces
export interface CardContainer {
	date: Date | string;
	title: string;
	description: string;
	image: string;
	indicator: string;
	type: string;
	class: string;
	path: string;
	endDate?: Date | string;
	group?: string;
}
export interface FrontmatterKeys {
	startDateKey: string[];
	endDateKey: string[];
	titleKey: string[];
	descriptionKey: string[];
	imageKey: string[];
	indicatorKey: string[];
	groupKey: string[];
}
export interface HistoriumSettings {
	era: any;
	frontmatterKeys: FrontmatterKeys;
	notePreviewOnHover: boolean;
	showRibbonCommand: boolean;
	sortDirection: boolean;
	timelineTag: string;
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
export interface TimelineGroup {
	id: string;
	content: string;
	nestedGroups?: string[] | null;
}
export interface TimelineItem {
	id: number | string;
	content: string;
	title: string;
	description: string;
	start: Date;
	className: string;
	type: TimelineItemType;
	end?: Date;
	path: string;
	group?: string;
}

// Type aliases
export type NoteData = CardContainer[];
export type AllNotesData = NoteData[];