import React from "react";
import { ButtonWrapper } from "./FieldButtons";
import { FormInput } from "./Text";
import { TimeInput, TimeIcon, TimeButton } from "./Time";

describe("TimeInput", () => {
	it("renders a basic time input, preliminary", () =>
		expect(
			<TimeInput update={() => {}} otherProp />,
			"to render as",
			<ButtonWrapper>
				<FormInput
					type="time"
					onChange={expect.it("to be a function")}
					otherProp
				/>
				<TimeButton>
					<TimeIcon />
				</TimeButton>
			</ButtonWrapper>,
		));
});
