import { createSelector } from "reselect";
import Immutable from "immutable";
import { defaultScopeSelector } from "./settings";

const getNavigationState = state => state.get("navigation");

const selectRoute = createSelector(getNavigationState, nav => nav.get("route"));

// const selectLocation = createSelector(
// 	selectRoute,
// 	route => route.get("location") || Immutable.Map(),
// );
const selectMatch = createSelector(
	selectRoute,
	route => route.get("match") || Immutable.Map(),
);

export const selectRouteParams = createSelector(
	selectMatch,
	match => match.get("params") || Immutable.Map(),
);

export const selectRoutePath = createSelector(
	selectMatch,
	match => match.get("path") || "",
);

export const selectRouteHref = createSelector(
	selectMatch,
	match => match.get("url") || "",
);

// Not a selector, as previous calls can change the result.
let lastScope;
export const resetLastScope = () => {
	lastScope = undefined;
};

const getLastRouteScope = state => {
	const params = selectRouteParams(state);
	if (params.get("scope")) {
		lastScope = params.get("scope");
	}
	return lastScope;
};

export const getCurrentScope = createSelector(
	getLastRouteScope,
	defaultScopeSelector,
	(id, scopeState) => id || scopeState || "Global",
);

const selectTabs = createSelector(getNavigationState, nav => nav.get("tabIndex"));

export const selectTabGetter = createSelector(selectTabs, tabs => path => tabs.get(path));

const selectModuleLists = createSelector(getNavigationState, nav =>
	nav.get("moduleTabs"),
);

export const selectCurrentModuleName = createSelector(selectRoutePath, path =>
	/^\/:scope\//.test(path) ? path.replace(/^\/:scope\/([^/]+)(\/.*)?$/, "$1") : "",
);

const selectCurrentModuleList = createSelector(
	selectModuleLists,
	selectCurrentModuleName,
	(lists, module) => lists.get(module) || Immutable.List(),
);

export const selectMappedCurrentModuleList = createSelector(
	selectCurrentModuleList,
	selectTabGetter,
	(list, getTab) => list.map(getTab),
);

const segmentHrefMap = createSelector(getNavigationState, state =>
	state.get("mappedHrefs"),
);

export const selectSegmentHrefMapper = createSelector(segmentHrefMap, map => href =>
	map.get(href) || href,
);
