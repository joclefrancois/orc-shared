import Immutable from "immutable";
import { SET_ROUTE, MAP_HREF, REMOVE_TAB, SET_HREF_CONFIG, SET_CURRENT_PREPEND_PATH } from "../actions/navigation";
import { getAllAfterPrependHref } from "../utils/parseHelper";

const initialState = Immutable.fromJS({
	route: {},
	tabIndex: {},
	moduleTabs: {},
	mappedHrefs: {},
	config: {},
	currentPrependPath: null,
});

const navigationReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ROUTE:
			return state.withMutations(s => {
				const prependPath = state.get("currentPrependPath") || state.getIn(["config", "prependPath"]);

				s.set("route", Immutable.fromJS(action.payload));
				const {
					location: { pathname: href },
					match: { path, params },
				} = action.payload;
				const remainingSection = getAllAfterPrependHref(prependPath, href);

				if (remainingSection) {
					s.setIn(
						["tabIndex", remainingSection],
						Immutable.fromJS({
							href,
							path,
							params,
						}),
					);
					const moduleName = path.replace(new RegExp(`^${prependPath}(\\w+)(?:/.*)?$`), "$1");
					const moduleList = s.getIn(["moduleTabs", moduleName]) || Immutable.List();

					if (!moduleList.includes(remainingSection)) {
						s.setIn(["moduleTabs", moduleName], moduleList.push(remainingSection));
					}
				}
			});
		case MAP_HREF:
			const prependPath = state.get("currentPrependPath") || state.getIn(["config", "prependPath"]);
			const { from, to } = action.payload;
			const remainingSectionFrom = getAllAfterPrependHref(prependPath, from);
			const remainingSectionTo = getAllAfterPrependHref(prependPath, to);
			if (remainingSectionFrom && remainingSectionTo)
				return state.setIn(["mappedHrefs", remainingSectionFrom], remainingSectionTo);
			return state;
		case REMOVE_TAB:
			return state.withMutations(s => {
				const prependPath = s.get("currentPrependPath") || s.getIn(["config", "prependPath"]);
				const { module, path } = action.payload;
				const list = s.getIn(["moduleTabs", module]) || Immutable.List();
				const remainingSection = getAllAfterPrependHref(prependPath, path);

				if (remainingSection) {
					const index = list.indexOf(remainingSection);
					if (index !== -1) {
						s.deleteIn(["moduleTabs", module, index]);
					}
					s.deleteIn(["tabIndex", remainingSection]);
				}
			});
		case SET_HREF_CONFIG:
			return state.set("config", Immutable.fromJS(action.payload));
		case SET_CURRENT_PREPEND_PATH:
			return state.set("currentPrependPath", action.payload);
		default:
			return state;
	}
};

export default navigationReducer;
