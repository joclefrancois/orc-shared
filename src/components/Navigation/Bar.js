import React, { useRef, useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { ifFlag, getThemeProp, safeGet } from "../../utils";
import Tab from "./Tab";

export const TabBar = styled.div`
	flex: 0 0 10px;
	max-height: 10px;
	padding: 0 0 0 10px;
	margin: 0 200px 0 0;
	height: 10px;
	display: flex;
	align-items: flex-end;
	width: calc(100% - 210px);
	font-family: ${getThemeProp(["fonts", "header"], "sans-serif")};
	font-size: 13px;
	text-transform: uppercase;
`;

export const InnerBar = styled.div`
	position: relative;
	flex: 0 1 100%;
	margin-left: -10px;
	padding-left: 10px;
	z-index: 0;
	overflow: hidden;
	min-width: 0;
	box-sizing: border-box;
	height: 50px;
	display: flex;
	align-items: flex-end;
	scroll-behavior: smooth;
`;

const Fade = styled.div`
	position: absolute;
	left: 0;
	bottom: 11px;
	height: 38px;
	width: 10px;
	z-index: 1;
	background-color: red;
	box-shadow: 0px 0 5px 5px #fff;
	clip-path: polygon(-10px 0, -10px 100%, 30px 100%, 30px 0);
	visibility: ${ifFlag("scroll", "visible", "hidden")};
`;

export const ScrollableBar = React.forwardRef(({ children }, ref) => {
	return (
		<>
			<Fade scroll={0} />
			<InnerBar id="navigationPageTabs" ref={ref}>
				{children}
			</InnerBar>
		</>
	);
});

const getTabEdges = (pages, tabRefs) => {
	let lastWidth = 0;
	return pages.map(({ href }) => {
		const tabWidth = safeGet(tabRefs, href, "offsetWidth") || 0;
		lastWidth += tabWidth;
		return lastWidth;
	});
};

export const useTabScroll = (pages, debug = false, refs) => {
	let barRef = useRef(null);
	let tabRefs = useRef({});
	if (debug) {
		barRef = refs.barRef;
		tabRefs = refs.tabRefs;
	}
	const [barWidth, setBarWidth] = useState(0);
	const [tabEdges, setTabEdges] = useState([]);
	const setWidthOfBar = useCallback(() => {
		setBarWidth(safeGet(barRef, "current", "offsetWidth") || 0);
	}, [barRef, setBarWidth]);
	const setEdgesOfTabs = useCallback(() => {
		setTabEdges(getTabEdges(pages, tabRefs.current));
	}, [pages, tabRefs, setTabEdges]);
	useEffect(() => {
		setWidthOfBar();
	}, [setWidthOfBar]);
	useEffect(() => {
		setEdgesOfTabs(pages);
	}, [pages, setEdgesOfTabs]);

	const lastActiveIndex = useRef(-1);
	let activeIndex = pages.findIndex(page => page.active);
	if (activeIndex === -1) {
		activeIndex = lastActiveIndex.current;
	} else {
		lastActiveIndex.current = activeIndex;
	}
	const [lastShownTab, setLastShown] = useState(pages.length);
	useEffect(() => {
		const barElem = barRef.current;
		if (!barElem) return;
		const activeEdge = tabEdges[activeIndex + 1] || tabEdges[activeIndex] || 0;
		let scrollEdge = Math.max(activeEdge - barWidth + 5, 0);
		barElem.scrollTo({ left: scrollEdge });
		const edgeIndex =
			tabEdges.findIndex(edge => edge > barWidth + barElem.scrollLeft - 10) - 1;
		// if (barWidth) console.log(barWidth, tabEdges, edgeIndex);
		if (tabEdges[tabEdges.length - 1] <= barWidth) {
			setLastShown(pages.length);
		} else if (edgeIndex > activeIndex) {
			setLastShown(edgeIndex);
		} else {
			setLastShown(activeIndex + 1);
		}
	}, [setLastShown, pages, barRef, barWidth, tabEdges, activeIndex]);
	return {
		...(debug ? { barWidth, tabEdges } : {}),
		lastShownTab,
		getTabRef: useCallback(
			node => {
				/* istanbul ignore else */
				if (node) {
					const href = safeGet(node, "dataset", "href");
					tabRefs.current[href] = node;
				}
			},
			[tabRefs],
		),
		getBarRef: useCallback(
			node => {
				/* istanbul ignore else */
				if (node && node !== barRef.current) {
					node.addEventListener("resize", setWidthOfBar);
					node.addEventListener("resize", setEdgesOfTabs);
					barRef.current = node;
				}
			},
			[barRef, setWidthOfBar, setEdgesOfTabs],
		),
	};
};

const Bar = ({ module, pages }) => {
	const { lastShownTab, getTabRef, getBarRef } = useTabScroll(pages);
	// console.log("last shown", lastShownTab);
	return (
		<TabBar>
			<Tab
				module
				icon={module.icon}
				href={module.href}
				mappedFrom={module.mappedFrom}
				label={module.label}
				active={module.active}
			/>
			{pages.length ? (
				<ScrollableBar ref={getBarRef}>
					{pages.map(
						({ href, mappedFrom, label, active, icon, outsideScope, close }, index) => {
							return (
								<Tab
									ref={getTabRef}
									key={href}
									icon={icon}
									href={href}
									mappedFrom={mappedFrom}
									label={label}
									active={active}
									close={close}
									outsideScope={outsideScope}
									hide={index > lastShownTab}
								/>
							);
						},
					)}
				</ScrollableBar>
			) : null}
		</TabBar>
	);
};

export default Bar;
