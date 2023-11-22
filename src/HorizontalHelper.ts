import {DataSet} from 'vis-data';
import {TimelineItem} from 'vis-timeline/esnext';

export function addGroup(
	name: any,
	nestedName: any,
	groups: {add: (arg0: {id: any; content: any; nestedGroups: any}) => void},
	groupSet: {has: (arg0: any) => any; add: (arg0: any) => void},
) {
	if (name && !groupSet.has(name)) {
		groups.add({
			id: name,
			content: name,
			nestedGroups: nestedName ? [nestedName] : null,
		});
		groupSet.add(name);
	}
	if (nestedName && !groupSet.has(nestedName)) {
		groups.add({
			id: nestedName,
			content: nestedName,
			nestedGroups: null, // Nested groups don't have their own nested groups
		});
		groupSet.add(nestedName);
	}
}

export function createItem(
	event: {title: any; description: any; class: any; indicator: any; type: any; path: any},
	noteCard: {outerHTML: any},
	start: any,
	end: any,
	groupName: any,
	nestedGroupName: any,
	items: DataSet<TimelineItem>,
) {
	return {
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
	};
}