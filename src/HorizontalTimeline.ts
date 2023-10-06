import {TimelineProcessor} from './Block';
import {HistoriumSettings, NoteData, TimelineArgs, TimelineGroup, TimelineItem} from './Types';
import {createDate, formatmajorLabel, formatminorLabel, iterateTimelineEvents} from './Utils';
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
			console.error(`Invalid start date for event ${event.title}`);
			return;
		}
		if ((event.type === 'range' || event.type === 'background') && end.toString() === 'Invalid Date') {
			console.error(`A end date is needed for ${event.title}`);
			return;
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
			group: event.group ?? null,
		});
		if (event.group && !groupSet.has(event.group)) {
			groups.add({
				id: event.group,
				content: event.group,
			});
			groupSet.add(event.group);
		}
	});
	return [items, groups];
}
export function HorizontalTimelineOptions(timelineProcessor: TimelineProcessor, args: TimelineArgs, settings: HistoriumSettings): any {
	let options = {
		animation: {
			duration: 1000,
			easingFuction: 'easeInOutQuad'
		},
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
			eventContainer.addEventListener('click', (event) => {
				let el = eventContainer.getElementsByClassName('timeline-card')[0] as HTMLElement;
				el.style.setProperty('display', 'block');
				el.style.setProperty('top', `-${el.clientHeight + 10}px`);
			});
			return eventContainer;
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
