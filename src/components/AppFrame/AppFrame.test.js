import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";
import I18n from "../I18n";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Scope from "../Scope";
import FullAppFrame, { Base, ViewPort, AppFrame } from "./index";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import ConnectedToastList from "./ConnectedToastList";

class ClassAppFrame extends React.Component {
	render() {
		const { store, ...props } = this.props;
		return (
			<Provider store={store}>
				<BrowserRouter>
					<I18n>
						<FullAppFrame {...props} />
					</I18n>
				</BrowserRouter>
			</Provider>
		);
	}
}

const TestComp1 = () => <div />;
const TestComp2 = () => <div />;
const TestComp3 = () => <div />;

const scopeHOC = Scope => props => (
	<Scope currentScope={{ name: "foo" }} {...props} />
);

const ConnectedScope = scopeHOC(Scope);

describe("AppFrame", () => {
	let props, toggle, reset;
	beforeEach(() => {
		props = {
			applications: [{ src: "/", label: "This", id: "current" }],
			applicationId: "current",
			modules: [],
			activeModules: ["foo"],
			menuLabel: "TestLabel",
			menuItems: [],
			location: { pathname: "/Foo/bar" },
			linkHOC: x => x,
			ConnectedScope,
			aboutMessages: {},
			prefMessages: {},
		};

		toggle = () => {};
		reset = () => {};
	});

	it("renders a viewport, top bar and sidebar", () => {
		props.modules = [
			{ id: "test1", component: TestComp1, route: "/test1" },
			{ id: "test2", component: TestComp2, route: "/test2" },
			{ id: "test3", component: TestComp3, route: "/test3" },
		];
		props.children = [
			<TestComp1 key="1" />,
			<TestComp2 key="2" />,
			<TestComp3 key="3" />,
		];
		return expect(
			<AppFrame {...props} {...{ toggle, reset }} />,
			"to render as",
			<Base>
				<ConnectedToastList />
				<Topbar
					linkHOC={props.linkHOC}
					applications={props.applications}
					applicationId={props.applicationId}
					menuLabel={props.menuLabel}
					menuItems={props.menuItems}
				/>
				<Sidebar
					linkHOC={props.linkHOC}
					modules={props.modules}
					activeModules={["foo"]}
					path="/Foo/bar"
				/>
				<ViewPort>
					<Scope>
						<TestComp1 key="1" />
						<TestComp2 key="2" />
						<TestComp3 key="3" />
					</Scope>
				</ViewPort>
			</Base>,
		);
	});

	it("propagates open flag, toggle and reset functions", () =>
		expect(
			<AppFrame open {...props} />,
			"to render as",
			<Base>
				<Topbar onClick={expect.it("to be", props.reset)} />
				<Sidebar open toggle={expect.it("to be", props.toggle)} />
				<ViewPort open onClick={expect.it("to be", props.reset)} />
			</Base>,
		));

	describe("with state handling", () => {
		let store, outerProps, innerProps, appRoot, modalRoot;
		beforeEach(() => {
			store = {
				subscribe: () => {},
				dispatch: () => {},
				getState: () =>
					Immutable.fromJS({
						applications: {
							list: [
								{
									id: 3,
									name: "Orders",
									isVisible: true,
									isAbsoluteUrl: true,
									url: "https://orc-env18-oco.develop.orckestra.cloud/oms",
									iconUri:
										"https://orc-env18-oco.develop.orckestra.cloud/oms/icon.png",
									displayName: {
										"en-CA": "Marketing Legacy",
										"en-US": "Marketing Legacy",
										"fr-CA": "Marketing Legacy",
										"fr-FR": "Marketing Legacy",
										"it-IT": "Marketing Legacy",
									},
								},
							],
						},
						navigation: {
							route: {
								match: {
									url: "/foo/test",
									path: "/:scope/test",
									params: { scope: "foo" },
								},
							},
						},
						locale: {
							suportedLocales: [],
							cultures: {
								"en-US": {
									cultureIso: "en-US",
									cultureName: "English - United States",
									sortOrder: 0,
									isDefault: true,
								},
							},
							defaultCulture: "fr-FR",
						},
						settings: { defaultApp: 12 },
						view: { scopeSelector: { filter: "Foo" } },
						toasts: { queue: [] },
					}),
			};
			const { ConnectedScope, ...remainder } = props;
			innerProps = remainder;
			outerProps = { store, scopeHOC, ...remainder };
			appRoot = document.createElement("div");
			appRoot.id = "app";
			document.body.appendChild(appRoot);
			modalRoot = document.createElement("div");
			modalRoot.id = "modal";
			document.body.appendChild(modalRoot);
		});
		afterEach(() => {
			try {
				ReactDOM.unmountComponentAtNode(appRoot);
			} catch (_) {}
			document.body.removeChild(appRoot);
			document.body.removeChild(modalRoot);
		});

		it("adds toggleable and resettable open flag", () => {
			const render = ReactDOM.render(
				<ClassAppFrame {...outerProps} />,
				appRoot,
			);
			return expect(
				render,
				"to have rendered",
				<AppFrame
					{...innerProps}
					open={false}
					toggle={expect.it("to be a function")}
					reset={expect.it("to be a function")}
				/>,
			);
		});
	});

	describe("global styles", () => {
		it("ensures required styling on html element to make IE11 happy", () =>
			// render any component from AppFrame.js to ensure jsdom has styles injected
			expect(<Base />, "when deeply rendered").then(() =>
				expect(
					"html",
					"as a selector to have style rules",
					"to match",
					/html\s*\{\s*height: 100%;\s*\}/,
				),
			));

		it("ensures required body styling", () =>
			// render any component from AppFrame.js to ensure jsdom has styles injected
			expect(<Base />, "when deeply rendered").then(() =>
				expect(
					"body",
					"as a selector to have style rules",
					"to match",
					/body\s*\{\s*height: 100%;\s*margin: 0;\s*overflow: hidden;\s*\}/,
				),
			));

		it("ensures required viewport styling", () =>
			// render any component from AppFrame.js to ensure jsdom has styles injected
			expect(<Base />, "when deeply rendered").then(() =>
				expect(
					"#app",
					"as a selector to have style rules",
					"to match",
					/#app\s*\{\s*height: 100%;\s*\}/,
				),
			));
	});
});

describe("ViewPort", () => {
	it("does not translate when closed", () =>
		expect(
			<ViewPort />,
			"to render style rules",
			"not to contain",
			"translateX",
		));

	it("translates to the side when open", () =>
		expect(
			<ViewPort open />,
			"to render style rules",
			"to contain",
			"transform: translateX(150px);",
		));
});
