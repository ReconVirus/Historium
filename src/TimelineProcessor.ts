import {MetadataCache, TFile, Vault} from "obsidian";
import {HorizontalTimelineData, HorizontalTimelineOptions, HorizontalTimeline} from "./HorizontalTimeline";
import {getTimelineData} from "./TimelineHelper";
import {HistoriumSettings, TimelineArgs} from "./Types";
import {FilterMDFiles, parseTag} from "./Utils";
import {VerticalTimeline} from "./VerticalTimeline";

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
	async run(
		source: string,
		el: HTMLElement,
		settings: HistoriumSettings,
		vaultFiles: TFile[],
		fileCache: MetadataCache, appVault: Vault, visTimeline: boolean) {
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