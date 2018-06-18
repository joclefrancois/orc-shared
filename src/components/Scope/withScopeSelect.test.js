import React from "react";
import Immutable from "immutable";
import sinon from "sinon";
import withScopeSelect from "./withScopeSelect";

const TestComp = ({ onClick }) => <div onClick={onClick} />;

describe("withScopeSelect", () => {
	let state, store, closer;
	beforeEach(() => {
		state = Immutable.fromJS({
			router: {
				route: "/:scope/Bar",
				params: { scope: "Foo" },
			},
		});
		store = {
			subscribe: () => {},
			getState: () => state,
			dispatch: sinon.spy().named("dispatch"),
		};
		closer = sinon.spy().named("closer");
	});

	it("it provides a click handler to the enhanced component", () =>
		expect(withScopeSelect, "when called with", [TestComp]).then(Comp =>
			expect(
				<Comp id="Feep" closeSelector={closer} store={store} />,
				"when deeply rendered",
				"with event",
				"click",
				"on",
				<div />,
				"to contain",
				<TestComp onClick={expect.it("to be a function")} />,
			).then(() =>
				expect([store.dispatch, closer], "to have calls satisfying", [
					{
						spy: store.dispatch,
						args: [{ type: "ROUTER_PUSH", payload: { pathname: "/Feep/Bar" } }],
					},
					{
						spy: closer,
					},
				]),
			),
		));
});