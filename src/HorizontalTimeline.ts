import {TimelineProcessor} from './Block';
import {HistoriumSettings, NoteData, TimelineArgs, TimelineGroup, TimelineItem} from './Types';
import {addEventListener, createDate, formatmajorLabel, formatminorLabel, iterateTimelineEvents} from './Utils';
import {DataSet} from 'vis-data';
import {Timeline} from 'vis-timeline/esnext';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

export function HorizontalTimelineData(
	timelineProcessor: TimelineProcessor,
	timelineNotes: Map<number, NoteData>,
	timelineDates: number[],
): [DataSet<TimelineItem>, DataSet<TimelineGroup>] {
	let items = new DataSet<TimelineItem>([]);
	let groups = new DataSet<TimelineGroup>([]);
	let groupSet = new Set();
	iterateTimelineEvents(timelineNotes, timelineDates, (event) => {
		let noteCard = timelineProcessor.createNoteCard(event);
		let [start, end] = timelineProcessor.getStartEndDates(event);
		if (start.toString() === 'Invalid Date') {
			throw new Error(`Invalid start date for event ${event.title}`);
		}
		if ((event.type === 'range' || event.type === 'background') && end.toString() === 'Invalid Date') {
			throw new Error(`A end date is needed for ${event.title}`);
		}
		let groupName = null;
		let nestedGroupName = null;
		
		if (event.group) {
			const groupParts = event.group.split('.');
			groupName = groupParts[0];
			nestedGroupName = groupParts.length > 1 ? groupParts[1] : null;
		}
		items.add({
			id: items.length + 1,
			content: event.title ?? '',
			title: noteCard.outerHTML,
			description: event.description,
			start: start,
			className: `${event.class} ${event.indicator}` ?? '',
			type: event.type,
			end: end ?? null,
			path: event.path,
			group: nestedGroupName ?? groupName,
		});
		if (event.group && !groupSet.has(groupName)) {
			groups.add({
				id: groupName,
				content: groupName,
				nestedGroups: nestedGroupName ? [nestedGroupName]: null,
			});
			groupSet.add(groupName);
		}
		if (nestedGroupName && !groupSet.has(nestedGroupName)) {
			groups.add({
				id: nestedGroupName,
				content: nestedGroupName,
				nestedGroups: null, // Nested groups don't have their own nested groups
			});
			groupSet.add(nestedGroupName);
		}
	});
	return [items, groups];
}
export function HorizontalTimelineOptions(timelineProcessor: TimelineProcessor, args: TimelineArgs, settings: HistoriumSettings): any {
	let options = {
		format: {
			minorLabels: (date: Date, scale: string, step: any) => formatminorLabel(date, scale, settings),
			majorLabels: (date: Date, scale: string, step: any) => formatmajorLabel(date, scale, settings),
		},
		template: function (item: any) {
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
		},
		loadingScreenTemplate: function () {
			return "<h1>Fetching your history</h1>";
		},
		minHeight: +args.divHeight,
		showCurrentTime: false,
		showTooltips: false,
		start: createDate(args.startDate),
		end: createDate(args.endDate),
		min: createDate(args.minDate),
		max: createDate(args.maxDate),
		zoomMin: 54000000,
	};
	return options;
}
export function HorizontalTimeline(timelineProcessor: TimelineProcessor, timeline: HTMLElement, items: DataSet<TimelineItem>, options: any, groups: DataSet<TimelineGroup>): void {
	timeline.setAttribute('class', 'timeline-vis');
	new Timeline(timeline, items, groups.length === 0 ? null : groups, options);
}
