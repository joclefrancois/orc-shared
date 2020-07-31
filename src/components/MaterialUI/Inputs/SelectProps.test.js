import SelectProps from "./SelectProps";

describe("Select Props", () => {
	it("Contains necessary props keys", () => {
		const propNames = ["update", "value", "numericSort", "showAllValue", "showAllLabel"];

		expect(SelectProps.propNames, "to have keys", propNames);
	});

	it("Puts keys in component props map", () => {
		const propNames = ["update", "value", "numericSort", "showAllValue", "showAllLabel"];

		const selectProps = new SelectProps();

		const keys = Array.from(selectProps.componentProps.keys());

		expect(keys, "to equal", propNames);
	});
});
