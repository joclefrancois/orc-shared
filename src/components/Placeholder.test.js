import React from "react";
import { FormattedMessage } from "react-intl";
import Placeholder, {
	PlaceholderBox,
	PlaceholderIcon,
	PlaceholderTitle,
	PlaceholderSubtitle,
} from "./Placeholder";

describe("Placeholder", () => {
	it("renders a placeholder with icon, title, and subtitle", () =>
		expect(
			<Placeholder icon="testIcon" title="A title" subtitle="A subtitle" />,
			"to exactly render as",
			<PlaceholderBox>
				<PlaceholderIcon id="testIcon" />
				<PlaceholderTitle>A title</PlaceholderTitle>
				<PlaceholderSubtitle>A subtitle</PlaceholderSubtitle>
			</PlaceholderBox>,
		));

	it("renders an empty placeholder", () =>
		expect(<Placeholder />, "to exactly render as", <PlaceholderBox />));

	it("renders an animated icon", () =>
		expect(
			<Placeholder icon="testIcon" animate />,
			"to exactly render as",
			<PlaceholderBox>
				<PlaceholderIcon id="testIcon" animate />
			</PlaceholderBox>,
		));

	it("translates title and subtitle if given message descriptors", () =>
		expect(
			<Placeholder
				title={{ id: "test.title", defaultMessage: "A title" }}
				subtitle={{ id: "test.subtitle", defaultMessage: "A subtitle" }}
			/>,
			"to exactly render as",
			<PlaceholderBox>
				<PlaceholderTitle>
					<FormattedMessage id="test.title" defaultMessage="A title" />
				</PlaceholderTitle>
				<PlaceholderSubtitle>
					<FormattedMessage id="test.subtitle" defaultMessage="A subtitle" />
				</PlaceholderSubtitle>
			</PlaceholderBox>,
		));
});

describe("PlaceholderIcon", () => {
	it("renders with animation", () =>
		expect(
			<PlaceholderIcon animate />,
			"to render style rules",
			"to contain",
			"animation: ",
		));

	it("renders without animation", () =>
		expect(
			<PlaceholderIcon />,
			"to render style rules",
			"not to contain",
			"animation: ",
		));
});