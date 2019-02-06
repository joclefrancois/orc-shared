import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { selectLocation, getCurrentScope } from "../selectors/route";
import Navigation from "./Navigation";
import FullPage from "./Routing/FullPage";

export const Module = withErrorBoundary("Module")(({ config, path, error }) => {
	return <FullPage path={path} config={config} />;
});

export const Modules = ({ modules, scope }) => (
	<React.Fragment>
		<Navigation modules={modules} />
		<Switch>
			{Object.entries(modules).map(([name, module]) => {
				return (
					<Route
						key={name}
						path={"/:scope/" + name}
						render={() => <Module config={module} path={"/:scope/" + name} />}
					/>
				);
			})}
		</Switch>
	</React.Fragment>
);

/* istanbul ignore next */
export default connect(
	/* istanbul ignore next */ state => ({
		scope: getCurrentScope(state),
		location: selectLocation(state),
	}),
)(Modules);
