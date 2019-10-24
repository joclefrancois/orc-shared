import React from "react";
import styled from "styled-components";
import { injectIntl } from "react-intl";
import Input from "../Input";
import Treeview from "../Treeview";
import ScopeNode from "./ScopeNode";
import Sidepanel from "../Sidepanel";
import withClickOutside from "../../hocs/withClickOutside";

export const Wrapper = withClickOutside(styled.div`
	height: 100%;
	width: 100%;
	user-select: none;
	display: flex;
	flex-direction: column;
`);

export const InputBox = styled.div`
	border-bottom: 1px solid #666;
`;

export const SearchInput = styled(Input)`
	background-color: transparent;
	border-color: #999;
	color: #999;
	width: calc(100% - 40px);
	margin: 20px;
	font-size: 14px;
`;

export const SelectorPanel = styled(Sidepanel)`
	top: 90px;
	background-color: #333;
	color: #fff;
	z-index: 1000;
`;

export const Selector = ({
	name,
	show,
	reset,
	intl,
	getScope,
	filter,
	updateFilter,
	filterPlaceholder,
}) => (
	<SelectorPanel in={show} width="27vw" timeout={300}>
		<Wrapper onClickOutside={reset}>
			<InputBox>
				<SearchInput
					placeholder={
						filterPlaceholder && intl.formatMessage(filterPlaceholder)
					}
					value={filter}
					onChange={updateFilter}
				/>
			</InputBox>
			<Treeview
				{...{
					name,
					Content: ScopeNode,
					rootId: "Global",
					getNode: getScope,
					openAll: !!filter,
					closeSelector: reset,
					dark: true,
				}}
			/>
		</Wrapper>
	</SelectorPanel>
);

export default injectIntl(Selector);
