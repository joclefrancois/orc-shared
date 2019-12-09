import React from "react";
import { Branch, Wrapper } from "./Branch";

describe("Branch", () => {
	it("renders a <ul>", () =>
		expect(<Branch />, "when mounted", "to satisfy", <ul />));

	it("sets styling for showing a branch structure", () =>
		expect(
			<Branch
				theme={{
					treeSettings: {
						branchIndent: 10,
						branchLength: 12,
						branchHeight: 14,
					},
				}}
			/>,
			"when mounted",
			"to have style rules satisfying",
			expect
				.it("to contain", "margin-left: 10px;")
				.and("to contain", "padding-left: 12px;")
				.and("to match", /:last-child::after {[^}]*left: -24px;[^}]*}/)
				.and("to match", /:last-child::after {[^}]*top: -14px;[^}]*}/),
		));
});

describe("Wrapper", () => {
	it("renders a <ul>", () =>
		expect(<Wrapper />, "when mounted", "to satisfy", <ul />));

	it("sets styling for showing the root of a tree structure", () =>
		expect(
			<Wrapper
				theme={{
					treeSettings: {
						branchIndent: 10,
						branchLength: 12,
						branchHeight: 14,
					},
				}}
			/>,
			"when mounted",
			"to have style rules satisfying",
			expect
				.it("to contain", "margin-left: 0;")
				.and("to contain", "padding: 7px;")
				.and(
					"to contain",
					"> ." + Branch.styledComponentId + " {margin-left: 15px;}",
				),
		));
});
