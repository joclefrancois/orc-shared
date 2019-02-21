import React from "react";
import routingConnector from "../hocs/routingConnector";
import { Route, Switch } from "react-router-dom";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { selectLocation } from "../selectors/route";
import { getCurrentScope } from "../selectors/navigation";
import Navigation from "./Navigation";
import FullPage from "./Routing/FullPage";

export const Module = withErrorBoundary("Module")(
	({ config, path, error, location, match }) => {
		return (
			<FullPage path={path} config={config} location={location} match={match} />
		);
	},
);

export const Modules = ({ modules, scope }) => (
	<React.Fragment>
		<Navigation modules={modules} />
		<Switch>
			{Object.entries(modules).map(([name, module]) => {
				return (
					<Route
						key={name}
						path={"/:scope/" + name}
						render={({ location, match }) => (
							<Module
								config={module}
								location={location}
								match={match}
								path={"/:scope/" + name}
							/>
						)}
					/>
				);
			})}
		</Switch>
	</React.Fragment>
);

/* istanbul ignore next */
export default routingConnector(
	/* istanbul ignore next */ state => ({
		scope: getCurrentScope(state),
		location: selectLocation(state),
	}),
)(Modules);
