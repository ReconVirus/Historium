import type {FrontmatterKeys, NoteData, TimelineArgs, HistoriumSettings} from './Types';
import {BST} from './BTS';
import {getFrontmatterData} from './Frontmatter';
import {createDate, FilterMDFiles, formatLabel, getImgUrl, iterateTimelineEvents, parseTag} from './Utils';
import {VerticalTimeline} from './VerticalTimeline'
import {MarkdownView, MetadataCache, TFile, Vault,} from 'obsidian'
import {DataSet} from "vis-data";
import {Timeline} from "vis-timeline/esnext";
import "vis-timeline/styles/vis-timeline-graph2d.css";

export const RENDER_TIMELINE: RegExp = /<!--TIMELINE BEGIN tags=['"]([^"]*?)['"]-->([\s\S]*?)<!--TIMELINE END-->/i;

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
        }
        let start = getDate(event.date);
        let end = getDate(event.endDate);
        return [start, end];
    }
    async insertTimelineIntoCurrentNote({editor}: MarkdownView, settings: HistoriumSettings, vaultFiles: TFile[], fileCache: MetadataCache, appVault: Vault) {
        if (editor) {
            const source = editor.getValue();
            const match = RENDER_TIMELINE.exec(source);
            if (!match) return;
            
            const tagList = match[1];
            let divContent = `<!--TIMELINE BEGIN tags='${match[1]}'-->`;
            divContent += await this.run(tagList, null, settings, vaultFiles, fileCache, appVault, false);
            divContent += `<div class="timeline-rendered">${new Date().toString()}</div>`;
            divContent += '<!--TIMELINE END-->';
            editor.setValue(source.replace(match[0], divContent));
        }
    }
    parseArgs(source: string, visTimeline: boolean): TimelineArgs {
        let args: TimelineArgs = {
            tags: '',
            divHeight: 400,
            startDate: '-1000',
            endDate: '3000',
            minDate: '-3000',
            maxDate: '3000'
        };
        if (visTimeline) {
            source.split('\n').forEach(e => {
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
        tags.split(";").forEach(tag => parseTag(tag, tagSet));
        tagSet.add(timelineTag);
        return tagSet;
    }
    filterFiles(vaultFiles: TFile[], tagSet: Set<string>, fileCache: MetadataCache): TFile[] {
        return vaultFiles.filter(file => FilterMDFiles(file, tagSet, fileCache));
    }
    sortDates(timelineDates: number[], sortDirection: boolean): number[] {
        return timelineDates.sort((d1, d2) => sortDirection ? d1 - d2 : d2 - d1);
    }
    buildVerticalTimeline(timeline: HTMLDivElement, timelineNotes: Map<number, NoteData>, timelineDates: number[], settings: HistoriumSettings) {
        VerticalTimeline(this, timeline, timelineNotes, timelineDates, settings);    
    }
    buildHorizontalTimelineItems(timelineNotes: Map<number, NoteData>, timelineDates: number[]): DataSet<any, any> {
        let items = new DataSet<any, any>([]);
        iterateTimelineEvents(timelineNotes, timelineDates, event => {
                    let noteCard = this.createNoteCard(event);
                    let [start, end] = this.getStartEndDates(event);
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
    buildHorizontalTimelineGroups(timelineNotes: Map<number, NoteData>, timelineDates: number[]): DataSet<any, any> {
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
    getHorizontalTimelineOptions(args: TimelineArgs, settings: HistoriumSettings) {
        let options = {
            minHeight: +args.divHeight,
            showCurrentTime: false,
            showTooltips: false,
            loadingScreenTemplate: function () {
                return "<h1> Unravling the treads of time </h1>";
            },
            zoomMin: 86400000,
            format: {
                minorLabels: (date: Date, scale: string, step: any) => formatLabel(date, scale, settings),
                majorLabels: function(date: Date, scale: string, step: any) {
                    if (!(date instanceof Date)) {
                        // If it's not, try to convert it to a Date object
                        date = new Date(date);
                    }
                    if (scale == 'year') {
                        return '';
                    }
                    if (scale == 'month') {
                    let year = date.getFullYear();
                    let era = (year < 0) ? settings.era[0] : settings.era[1];
                        return `${year} ${era}`;
                    } else if (scale == 'day') {
                    let  month= date.toLocaleString('default', { month: 'long' });
                        return month;
                    }
                }
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
    createHorizontalTimeline(timeline: HTMLElement, items: DataSet <any, any>, options: any, groups: DataSet<any, any>) {
        timeline.setAttribute('class', 'timeline-vis');
        new Timeline(timeline, items, groups.length === 0 ? null : groups, options);
    }
    async run(source: string, el: HTMLElement, settings: HistoriumSettings, vaultFiles: TFile[], fileCache: MetadataCache, appVault: Vault, visTimeline: boolean) {
        let args = this.parseArgs(source, visTimeline);
        let tagSet = this.getTagSet(args.tags, settings.timelineTag);
        let fileList = this.filterFiles(vaultFiles, tagSet, fileCache);
        if (!fileList) return;
        let [timelineNotes, timelineDates] = await getTimelineData(appVault, fileCache, fileList, settings);
        timelineDates = this.sortDates(timelineDates, settings.sortDirection);
        let timeline = document.createElement('div');
        timeline.setAttribute('class', 'timeline');
        if (!visTimeline) {
            this.buildVerticalTimeline(timeline, timelineNotes, timelineDates, settings);
            el.appendChild(timeline);
            return;
        }
        let items = this.buildHorizontalTimelineItems(timelineNotes, timelineDates);
        let groups = this.buildHorizontalTimelineGroups(timelineNotes, timelineDates)
        let options = this.getHorizontalTimelineOptions(args, settings);
        this.createHorizontalTimeline(timeline, items, options, groups);
        el.appendChild(timeline);
    }
    async insertTimelineYaml(frontmatterKeys: FrontmatterKeys, sourceView: MarkdownView) {
        const editor = sourceView.editor;
        if (!editor) return;
        let yaml = 'tag: timeline\n'; 
        yaml += `${frontmatterKeys.titleKey}:\n`;
        yaml += `${frontmatterKeys.descriptionKey}:\n`;
        yaml += `${frontmatterKeys.imageKey}:\n`;
        yaml += `${frontmatterKeys.indicatorKey}:\n`;
        yaml += 'type:\n';
        yaml += 'color:\n';
        yaml += `${frontmatterKeys.startDateKey}:\n`;
        yaml += `${frontmatterKeys.endDateKey}:\n`;
        // Check if the current note already has a YAML header
        const firstLine = editor.getLine(0);
        if (firstLine === '---') {
          // If it does, add the new keys to the existing YAML header
            let frontmatterEnd = 1;
            while (frontmatterEnd <= editor.lastLine() && editor.getLine(frontmatterEnd) !== '---') {
                frontmatterEnd++;
            }
          // Add the new keys to the existing YAML header
            let existingYaml = editor.getRange({line: 0, ch: 0}, {line: frontmatterEnd, ch: 0});
            let newKeys = yaml.split('\n').filter(key => !existingYaml.includes(key.split(':')[0]));
            editor.replaceRange(newKeys.join('\n') + '\n', {line: frontmatterEnd, ch: 0}, {line: frontmatterEnd, ch: 0});
        } else {
          // If not, insert the new YAML block at the beginning of the note
            yaml = '---\n' + yaml + '---\n';
            editor.replaceRange(yaml, {line: 0, ch: 0}, {line: 0, ch: 0});
        }
    }
}

async function processFile(file: TFile, fileCache: MetadataCache, settings: HistoriumSettings, appVault: Vault): Promise<[number, NoteData] | null> {
    const metadata = fileCache.getFileCache(file);
    const frontmatter = metadata.frontmatter;
    const [startDate, noteTitle, noteDescription, noteImage, noteIndicator, type, noteClass, notePath, endDate, noteGroup] = getFrontmatterData(frontmatter, settings.frontmatterKeys, file);
    let noteId;
    if (startDate[0] == '-') {
        noteId = +startDate.substring(1).split('-').join('') * -1;
    } else {
        noteId = +startDate.split('-').join('');
    }
    if (!Number.isInteger(noteId)) return null;
    const note = {
        date: startDate,
        title: noteTitle,
        description: noteDescription,
        image: getImgUrl(app, appVault.adapter, noteImage),
        indicator: noteIndicator,
        class: noteClass,
        type: type,
        path: notePath,
        endDate: endDate,
        group: noteGroup
    };
    return [noteId, [note]];
}
async function getTimelineData(appVault: Vault, fileCache: MetadataCache, fileList: TFile[], settings: HistoriumSettings): Promise<[Map<number, NoteData>, number[]]> {
    const timeline = document.createElement('div');
    timeline.classList.add('timeline');
    const timelineNotes = new Map<number, NoteData>();
    const timelineDates = new BST<number>();
    for (const file of fileList) {
        const result = await processFile(file, fileCache, settings, appVault);
        if (result) {
            const [noteId, notes] = result;
            if (!timelineNotes.has(noteId)) {
                timelineNotes.set(noteId, notes);
                timelineDates.insert(noteId);
            } else {
                const existingNotes = timelineNotes.get(noteId);
                const insertIndex = settings.sortDirection ? 0 : existingNotes.length;
                existingNotes.splice(insertIndex, 0, ...notes);
            }
        }
    }
    return [timelineNotes, Array.from(timelineDates.inOrder())];
}