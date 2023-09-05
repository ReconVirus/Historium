import type { TimelineProcessor } from "./Block";
import { NoteData, TimelinesSettings } from "./Types";

export function VerticalTimeline(TimelineProcessor: TimelineProcessor, timeline: HTMLDivElement, timelineNotes: Map<number, NoteData>, timelineDates: number[], settings: TimelinesSettings) {
    let eventCount = 0;
    for (let date of timelineDates) {
        const noteContainer = timeline.createDiv({ cls: 'timeline-container' });
        const noteHeader = noteContainer.createEl('h2', {
            text: timelineNotes
                .get(date)[0]
                .date.split('-')
                .map((x, i) =>
                    i === 0 && x === '0000' ? '0' : x.replace(/^0+/, '')
                )
                .filter((x) => x !== '00')
                .join('-')
                .replace(/-+/g, '-')
                .replace(/-$/, ''),
            cls: 'timeline-header',
        });
        const era = settings.era[Number(!noteHeader.textContent.startsWith('-'))];
        const eventContainer = noteContainer.createDiv({
            cls: 'timeline-event-list',
            attr: { style: 'display: block' },
        });
        noteHeader.textContent += ' ' + era;
        noteHeader.addEventListener('click', (event) => {
            eventContainer.style.setProperty(
                'display',
                eventContainer.style.getPropertyValue('display') === 'none'
                    ? 'block'
                    : 'none'
            );
        });
        if (eventCount % 2 == 0) {
            noteContainer.addClass('timeline-left');
        } else {
            noteContainer.addClass('timeline-right');
            noteHeader.setAttribute('style', 'text-align: right;');
        }
        if (!timelineNotes.has(date)) {
            continue;
        }
        for (let eventAtDate of timelineNotes.get(date)) {
            noteContainer.addClass(eventAtDate.indicator);
            let noteCard = eventContainer.createDiv({
                cls: `timeline-card ${eventAtDate.indicator}`,
            });
            if (eventAtDate.image) {
                noteCard.createDiv({
                    cls: 'thumb',
                    attr: { style: `background-image: url(${eventAtDate.image});` },
                });
            }
            if (eventAtDate.class) {
                noteCard.addClass(eventAtDate.class);
            }
            noteCard
                .createEl('article')
                .createEl('h3')
                .createEl('a', {
                    cls: 'internal-link',
                    attr: { href: `${eventAtDate.path}` },
                    text: eventAtDate.title,
                });
            noteCard.createEl('p', { text: eventAtDate.description });
        }
        eventCount++;
    }
}