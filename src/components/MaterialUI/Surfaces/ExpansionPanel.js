import React from "react";
import ExpansionPanelMui from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Icon from "./../../Icon";
import { ExpansionPanelProps, ExpansionPanelActionsProps } from "./expansionPanelProps";

const useStyles = makeStyles(theme => ({
	summaryRoot: {
		height: theme.spacing(8),
		backgroundColor: theme.palette.primary.lighter,
		flexDirection: "row-reverse",
	},
	resetPadding: {
		padding: "0",
	},
	panelExpanded: {},
	summaryContent: {
		marginLeft: theme.spacing(1),
		"&$panelExpanded": {
			marginLeft: theme.spacing(1),
		},
	},
	panelRoot: {
		"&$panelExpanded": {
			margin: "0",
			"&:before": {
				opacity: "1",
			},
		},
		"&:before": {
			backgroundColor: theme.palette.secondary.light,
		},
	},
	summaryExpandIconRoot: {
		color: theme.palette.grey.darker,
		minWidth: "auto",
	},
}));

const ExpansionPanel = ({
	header,
	content,
	actions,
	expansionPanelProps,
	expansionPanelActionsProps,
}) => {
	if (
		expansionPanelProps != null &&
		expansionPanelProps instanceof ExpansionPanelProps === false
	) {
		throw new TypeError(
			"expansionPanelProps property is not of type ExpansionPanelProps",
		);
	}

	if (
		expansionPanelActionsProps != null &&
		expansionPanelActionsProps instanceof ExpansionPanelActionsProps === false
	) {
		throw new TypeError(
			"expansionPanelActionsProps property is not of type ExpansionPanelActionsProps",
		);
	}

	const classes = useStyles();

	// Expansion panel props
	let disabled = expansionPanelProps?.get(ExpansionPanelProps.propNames.disabled);
	let expanded = expansionPanelProps?.get(ExpansionPanelProps.propNames.expanded);
	let onChange = expansionPanelProps?.get(ExpansionPanelProps.propNames.onChange);

	// Expansion panel summary props
	let defaultSummaryStyles = {
		edge: false,
		size: "small",
		classes: {
			root: classes.summaryExpandIconRoot,
			sizeSmall: classes.resetPadding,
		},
	};

	// Expansion panel actions props
	let disableSpacing = expansionPanelActionsProps?.get(
		ExpansionPanelActionsProps.propNames.disableSpacing,
	);

	return (
		<ExpansionPanelMui
			disabled={disabled == null ? false : disabled}
			expanded={expanded}
			onChange={onChange}
			classes={{
				root: classNames(classes.panelRoot),
				expanded: classNames(classes.panelExpanded),
			}}
		>
			<ExpansionPanelSummary
				expandIcon={<Icon {...{ id: "chevron-down" }} />}
				IconButtonProps={defaultSummaryStyles}
				classes={{
					root: classNames(classes.summaryRoot),
					expanded: classNames(classes.panelExpanded),
					content: classNames(classes.summaryContent),
				}}
			>
				{header}
			</ExpansionPanelSummary>
			<ExpansionPanelDetails
				classes={{
					root: classNames(classes.resetPadding),
				}}
			>
				{content}
			</ExpansionPanelDetails>
			{actions != null ? (
				<ExpansionPanelActions
					disableSpacing={disableSpacing == null ? false : disableSpacing}
				>
					{actions}
				</ExpansionPanelActions>
			) : null}
		</ExpansionPanelMui>
	);
};

export default ExpansionPanel;
