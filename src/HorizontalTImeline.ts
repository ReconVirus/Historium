import {TimelineProcessor} from "./Block";
import {HistoriumSettings, NoteData, TimelineArgs} from "./Types";
import {createDate, formatmajorLabel, formatminorLabel, iterateTimelineEvents} from "./Utils";
import {DataSet} from "vis-data";
import {Timeline} from "vis-timeline/esnext";
import "vis-timeline/styles/vis-timeline-graph2d.css";

export function HorizontalTimelineItems(timelineProcessor: TimelineProcessor, timelineNotes: Map<number, NoteData>, timelineDates: number[]): DataSet<any, any> {
    let items = new DataSet<any, any>([]);
    iterateTimelineEvents(timelineNotes, timelineDates, event => {
                let noteCard = timelineProcessor.createNoteCard(event);
                let [start, end] = timelineProcessor.getStartEndDates(event);
                if (start.toString() === 'Invalid Date') return;
                if ((event.type === "range" || event.type === "background") && end.toString() === 'Invalid Date') return;
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
                    group: event.group ?? null
                });
            });
    return items;
}
export function HorizontalTimelineGroups(timelineProcessor: TimelineProcessor, timelineNotes: Map<number, NoteData>, timelineDates: number[]): DataSet<any, any> {
    let groups = new DataSet<any, any>([]);
    let groupSet = new Set();
    iterateTimelineEvents(timelineNotes, timelineDates, event => {
            if (event.group && !groupSet.has(event.group)) {
                groups.add({
                    id: event.group,
                    content: event.group
                });
                groupSet.add(event.group);
            }
        });
    return groups;
}
export function HorizontalTimelineOptions(timelineProcessor: TimelineProcessor, args: TimelineArgs, settings: HistoriumSettings) {
    let options = {
        minHeight: +args.divHeight,
        showCurrentTime: false,
        showTooltips: false,
        loadingScreenTemplate: function () {
            return "<h1> Unravling the treads of time </h1>";
        },
        zoomMin: 87000000,
        format: {
            minorLabels: (date: Date, scale: string, step: any) => formatminorLabel(date, scale, settings),
            majorLabels: (date: Date, scale: string, step: any) => formatmajorLabel(date, scale, settings),
        },
        template: function (item: any) {
            let eventContainer = document.createElement(settings.notePreviewOnHover ? 'a' : 'div');
            if ("href" in eventContainer) {
                eventContainer.addClass('internal-link');
                eventContainer.href = item.path;
            }
            eventContainer.setText(item.content);
            let eventCard = eventContainer.createDiv();
            eventCard.outerHTML = item.title;
            eventContainer.addEventListener('click', event => {
                let el = (eventContainer.getElementsByClassName('timeline-card')[0] as HTMLElement);
                el.style.setProperty('display', 'block');
                el.style.setProperty('top', `-${el.clientHeight + 10}px`);
            });
            return eventContainer;
        },
        start: createDate(args.startDate),
        end: createDate(args.endDate),
        min: createDate(args.minDate),
        max: createDate(args.maxDate)
    };
    return options;
}
export function HorizontalTimeline(timelineProcessor: TimelineProcessor, timeline: HTMLElement, items: DataSet <any, any>, options: any, groups: DataSet<any, any>) {
    timeline.setAttribute('class', 'timeline-vis');
    new Timeline(timeline, items, groups.length === 0 ? null : groups, options);
}