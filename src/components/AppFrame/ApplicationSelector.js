import React from "react";
import styled, { css } from "styled-components";
import { withStateHandlers } from "recompose";
import Modal from "./Modal";

const HeaderIcon = styled.img`
	height: 34px;
	width: 34px;
	vertical-align: middle;
`;

const HeaderLabel = styled.span`
	font-family: Roboto Condensed, sans-serif;
	font-weight: bold;
	text-transform: uppercase;
	padding-left: 15px;
	vertical-align: middle;
	opacity: ${props => (props.open ? 1 : 0)};
	transition: opacity 0.3s ease-out;
`;

const HeaderWrapper = styled.div`
	padding: 0 6px;
	margin: 10px 0 50px;

	${props =>
		props.open
			? css`
					transform: translateX(19px);
			  `
			: ""};
	transition: transform 0.3s ease-out;
`;

const ApplicationSelector = ({
	open,
	show,
	toggle,
	applications,
	applicationId,
}) => (
	<React.Fragment>
		<HeaderWrapper open={open} onClick={toggle}>
			<HeaderIcon src={applications[applicationId].src} />
			<HeaderLabel open={open}>{applications[applicationId].label}</HeaderLabel>
		</HeaderWrapper>
		<Modal show={show} toggle={toggle}>
			Bar
		</Modal>
	</React.Fragment>
);

const withShowToggle = withStateHandlers(
	({ init = false }) => ({ show: init }),
	{
		toggle: ({ show }) => () => ({ show: !show }),
	},
);

export default withShowToggle(ApplicationSelector);
