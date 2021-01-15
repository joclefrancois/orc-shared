import ComponentProps from "../componentProps";

class ExpansionPanelProps extends ComponentProps {
	static propNames = {
		defaultExpanded: "defaultExpanded",
		disabled: "disabled",
		expanded: "expanded",
		onChange: "onChange",
	};

	static ruleNames = {
		root: "root"
	};

	constructor() {
		super();
		this.componentProps.set(this.constructor.propNames.defaultExpanded, null);
		this.componentProps.set(this.constructor.propNames.disabled, null);
		this.componentProps.set(this.constructor.propNames.expanded, null);
		this.componentProps.set(this.constructor.propNames.onChange, null);

		this.componentClasses.set(this.constructor.ruleNames.root, null);

		this._isExpansionPanelProps = true;
	}
}

export const isExpansionPanelProps = function (value) {
	if (value == null) return true;
	return typeof value === "object" && (value instanceof ExpansionPanelProps || value._isExpansionPanelProps === true);
};

class ExpansionPanelActionsProps extends ComponentProps {
	static propNames = {
		disableSpacing: "disableSpacing",
	};

	constructor() {
		super();
		this.componentProps.set(this.constructor.propNames.disableSpacing, null);

		this._isExpansionPanelActionsProps = true;
	}
}

export const isExpansionPanelActionsProps = function (value) {
	if (value == null) return true;
	return typeof value === "object" && (value instanceof ExpansionPanelProps || value._isExpansionPanelActionsProps === true);
};

export { ExpansionPanelProps, ExpansionPanelActionsProps };
