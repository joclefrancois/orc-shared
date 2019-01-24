import Immutable from "immutable";
import { setRoute, removeTab } from "../actions/navigation";
import reducer from "./navigation";
import { LOCATION_CHANGED } from "connected-react-router";

describe("Navigation reducer", () => {
	it("behaves as a reducer should", () =>
		expect(reducer, "to be a reducer with initial state", {
			route: {},
			tabIndex: {},
			moduleTabs: {},
			segmentHrefs: {},
		}));

	describe("SET_ROUTE", () => {
		it("saves the current matched route", () => {
			const oldState = Immutable.fromJS({
				route: {
					location: {},
					match: {},
				},
			});
			const action = setRoute(
				{
					hash: "",
					pathname: "/Value/test",
					search: "",
				},
				{
					isExact: true,
					params: { var: "Value" },
					path: "/:var/test",
					url: "/Value/test",
				},
			);
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState);
		});
	});

	describe.skip("LOCATION_CHANGED", () => {
		it("saves pages navigated to", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					pathname: "/test/new",
					route: "/test/:page",
					result: {
						title: "Test page",
						parent: {
							module: "thing",
							route: "/test",
						},
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to have value at",
				["tabIndex", "/test/new"],
				Immutable.fromJS({
					href: "/test/new",
					label: "Test page",
				}),
			);
		});

		it("handles no-result actions", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					pathname: "/test/new",
					route: "/test/:page",
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "to be", oldState);
		});

		it("saves params for pages with message descriptor titles", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					route: "/test/:page",
					params: { page: "new" },
					pathname: "/test/new",
					result: {
						title: {
							id: "test.navigation.testpage",
							defaultMessage: "Test {page}",
						},
						parent: { module: "thing" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to have value at",
				["tabIndex", "/test/new"],
				Immutable.fromJS({
					href: "/test/new",
					label: {
						id: "test.navigation.testpage",
						defaultMessage: "Test {page}",
						values: { page: "new" },
					},
				}),
			);
		});

		it("saves a state path to a data object for pages indicating one", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					route: "/test/:page",
					params: { page: "256aaf" },
					pathname: "/test/256aaf",
					result: {
						title: {
							id: "test.navigation.testpage",
							defaultMessage: "Test {someDataField}",
						},
						dataPath: ["foo", "256aaf"],
						parent: { module: "thing" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to have value at",
				["tabIndex", "/test/256aaf"],
				Immutable.fromJS({
					href: "/test/256aaf",
					dataPath: ["foo", "256aaf"],
					label: {
						id: "test.navigation.testpage",
						defaultMessage: "Test {someDataField}",
						values: { page: "256aaf" },
					},
				}),
			);
		});

		it("adds an object id to the data object path if given", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					route: "/test/:page",
					params: { page: "256aaf" },
					pathname: "/test/256aaf",
					result: {
						title: {
							id: "test.navigation.testpage",
							defaultMessage: "Test {someDataField}",
						},
						dataPath: ["foo"],
						dataIdParam: "page",
						parent: { module: "thing" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to have value at",
				["tabIndex", "/test/256aaf"],
				Immutable.fromJS({
					href: "/test/256aaf",
					dataPath: ["foo", "256aaf"],
					label: {
						id: "test.navigation.testpage",
						defaultMessage: "Test {someDataField}",
						values: { page: "256aaf" },
					},
				}),
			);
		});

		it("does not add the data object id if already present", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					route: "/test/:page",
					params: { page: "256aaf" },
					pathname: "/test/256aaf",
					result: {
						title: {
							id: "test.navigation.testpage",
							defaultMessage: "Test {someDataField}",
						},
						dataPath: ["foo", "256aaf"],
						dataIdParam: "page",
						parent: { module: "thing" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to have value at",
				["tabIndex", "/test/256aaf"],
				Immutable.fromJS({
					href: "/test/256aaf",
					dataPath: ["foo", "256aaf"],
					label: {
						id: "test.navigation.testpage",
						defaultMessage: "Test {someDataField}",
						values: { page: "256aaf" },
					},
				}),
			);
		});

		it("creates a list of open tabs per module", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					pathname: "/test/new",
					result: {
						title: "Test page",
						parent: { module: "thing" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to have value at",
				["moduleTabs", "thing"],
				Immutable.fromJS(["/test/new"]),
			);
		});

		it("adds to the list of open tabs per module", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: { thing: ["/test/other"] },
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					pathname: "/test/new",
					result: {
						title: "Test page",
						parent: { module: "thing" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to have value at",
				["moduleTabs", "thing"],
				Immutable.fromJS(["/test/other", "/test/new"]),
			);
		});

		it("does not add duplicate tabs to module list", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {}, "/test/new": {} },
				moduleTabs: { thing: ["/test/new"] },
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					pathname: "/test/new",
					result: {
						title: "Test page",
						parent: { module: "thing" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"value at",
				["moduleTabs", "thing"],
				"to equal",
				Immutable.fromJS(["/test/new"]),
			);
		});

		it("does not add a tab if there is no title", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: { thing: ["/test/new"] },
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					pathname: "/test/new",
					result: {
						parent: { module: "thing" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "to be", oldState);
		});

		it("updates segment href map if navigating to a segment page", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {} },
				moduleTabs: { thing: ["/test/new"] },
				segmentHrefs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					pathname: "/test/new",
					result: {
						label: "Test page",
						parent: { module: "thing", mode: "segments" },
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to satisfy",
				Immutable.fromJS({
					tabIndex: { "/test/old": {} },
					moduleTabs: { thing: ["/test/new"] },
					segmentHrefs: { "/test": "/test/new" },
				}),
			);
		});

		it("uses parent's title and href on segment pages", () => {
			const oldState = Immutable.fromJS({
				tabIndex: {},
				moduleTabs: {},
				segmentHrefs: {},
			});
			const action = {
				type: LOCATION_CHANGED,
				payload: {
					pathname: "/thing/test/new",
					result: {
						label: "New",
						title: "Wrong",
						parent: {
							mode: "segments",
							title: "Correct",
							parent: {
								module: "thing",
							},
						},
					},
				},
			};
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to satisfy",
				Immutable.fromJS({
					tabIndex: { "/thing/test": { label: "Correct" } },
					moduleTabs: { thing: ["/thing/test"] },
					segmentHrefs: { "/thing/test": "/thing/test/new" },
				}),
			);
		});
	});

	describe("REMOVE_TAB", () => {
		it("can remove open tabs", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {}, "/test/new": {} },
				moduleTabs: { thing: ["/test/new", "/test/old"] },
			});
			const action = removeTab("thing", "/test/new");
			const newState = reducer(oldState, action);
			return expect(newState, "not to be", oldState).and(
				"to equal",
				Immutable.fromJS({
					tabIndex: { "/test/old": {} },
					moduleTabs: { thing: ["/test/old"] },
				}),
			);
		});

		it("handles missing module names gracefully", () => {
			const oldState = Immutable.fromJS({
				tabIndex: { "/test/old": {}, "/test/new": {} },
				moduleTabs: {},
			});
			const action = removeTab("thing", "/test/new");
			return expect(() => reducer(oldState, action), "not to error")
				.and("when called")
				.then(newState =>
					expect(newState, "not to be", oldState).and(
						"to equal",
						Immutable.fromJS({
							tabIndex: { "/test/old": {} },
							moduleTabs: {},
						}),
					),
				);
		});
	});
});
