import React from "react";
import { Switch, Route } from "react-router";
import FullPage from "./FullPage";
import SubPage from "./SubPage";
import withWaypointing from "./withWaypointing";

const Page = ({ component, path, pages = {}, subpages = {} }) => {
	const View = withWaypointing(component);
	return (
		<Switch>
			<Route exact path={path} component={View} />
			{Object.entries(subpages).map(([subpath, config]) => (
				<Route
					key={subpath}
					path={path + subpath}
					render={() => <SubPage path={path + subpath} config={config} />}
				/>
			))}
			{Object.entries(pages).map(([subpath, config]) => (
				<Route
					key={subpath}
					path={path + subpath}
					render={() => <FullPage path={path + subpath} config={config} />}
				/>
			))}
		</Switch>
	);
};

export default Page;
