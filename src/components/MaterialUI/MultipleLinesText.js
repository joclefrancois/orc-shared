import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import { TextProps } from "./textProps";

const useStyles = props =>
	makeStyles(theme => ({
		lineClamp: {
			display: "block",
			position: "relative",
			overflow: "hidden",
			textOverflow: "ellipsis",
			padding: "0 !important",
			height: "calc(1em * 1.2 * " + props.lineCount + ")",
			"&::after": {
				content: "'...'",
				textAlign: "right",
				bottom: "0",
				right: "0",
				width: "25%",
				display: "block",
				position: "absolute",
			},
		},
		"@supports (-webkit-line-clamp: 1)": {
			lineClamp: {
				height: "inherit",
				"&::after": {
					display: "none !important",
				},
			},
		},
		lineClampWebkit: {
			WebkitLineClamp: props.lineCount,
			display: "-webkit-box",
			WebkitBoxOrient: "vertical",
			wordBreak: "break-word",
		},
	}));

const MultipleLinesText = ({ children, ...props }) => {
	const classes = useStyles(props)();
	const textProps = props.textProps;

	if (textProps != null && textProps instanceof TextProps === false) {
		throw new TypeError("textProps property is not of type TextProps");
	}
	var customStyles = textProps?.get(TextProps.propNames.classes);
	return (
		<Typography
			classes={{
				root: classNames(
					classes.lineClamp,
					classes.lineClampWebkit,
					customStyles?.get(TextProps.ruleNames.root),
				),
				body1: classNames(customStyles?.get(TextProps.ruleNames.body1)),
			}}
		>
			{children}
		</Typography>
	);
};

export default MultipleLinesText;
