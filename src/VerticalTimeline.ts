import {TimelineProcessor} from './TimelineProcessor';
import {HistoriumSettings, NoteData} from './Types';

export function VerticalTimeline(
	TimelineProcessor: TimelineProcessor,
	timeline: HTMLDivElement,
	timelineNotes: Map<number, NoteData>,
	timelineDates: number[],
	settings: HistoriumSettings,
) {
	let eventCount = 0;
	for (let date of timelineDates) {
		const noteContainer = timeline.createDiv({cls: 'timeline-container'});
		let dateString = timelineNotes.get(date)[0].date;
		if (dateString instanceof Date) {
			dateString = dateString.toISOString().slice(0, 10); // Convert Date to string in 'yyyy-mm-dd' format
		}
		const noteHeader = noteContainer.createEl('h2', {
			text: dateString
				.split('-')
				.map((x, i) => (i === 0 && x === '0000' ? '0' : x.replace(/^0+/, '')))
				.filter((x) => x !== '00')
				.join('-')
				.replace(/-+/g, '-')
				.replace(/-$/, ''),
			cls: 'timeline-header',
		});
		const era = settings.era[Number(!noteHeader.textContent.startsWith('-'))];
		const eventContainer = noteContainer.createDiv({
			cls: 'timeline-event-list',
			attr: {style: 'display: block'},
		});
		noteHeader.textContent += ` ${era}`;
		noteHeader.addEventListener('click', (event) => {
			eventContainer.style.setProperty('display', eventContainer.style.getPropertyValue('display') === 'none' ? 'block' : 'none');
		});

		addClassBasedOnEventCount(noteContainer, noteHeader, eventCount);

		for (let eventAtDate of timelineNotes.get(date)) {
			addEventToContainer(eventContainer, noteContainer, eventAtDate);
		}
		eventCount++;
	}
}
function addClassBasedOnEventCount(noteContainer: HTMLElement, noteHeader: HTMLElement, eventCount: number): void {
    if(eventCount % 2 == 0) {
        noteContainer.classList.add('timeline-left');
    } else {
        noteContainer.classList.add('timeline-right');
        noteHeader.setAttribute('style', 'text-align: right;');
    }
}
function addEventToContainer(eventContainer: HTMLElement, noteContainer: HTMLElement, eventAtDate: any): void {
    const {indicator, image, class: color, path, title, description} = eventAtDate;

    let noteCard = eventContainer.createDiv({cls: 'timeline-card'});

    if (image) {
        noteCard.createDiv({
            cls: 'thumb',
            attr: {style: `background-image: url(${image});`},
        });
    }
    if (indicator) {
        noteCard.classList.add(indicator);
		noteContainer.classList.add(indicator);
    }
    if (color) {
        noteCard.classList.add(color);
		noteContainer.classList.add(color);
    }
    noteCard
        .createEl('article')
        .createEl('h3')
        .createEl('a', {
            cls: 'internal-link',
            attr: {href: `${path}`},
            text: title,
        });
    noteCard.createEl('p', {text: description});
}