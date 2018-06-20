# Components

`orc-shared` provides a wide array of components, ranging from simple styled elements to providing complex functionality. This API reference lists them here with their important properties and a description of their functionality.

## AppFrame

- `applications`: A list of applications to be made available in the application selector. An application is defined as an object containing `url`, `name`, `iconUri` and `displayName` values.
- `applicationId`: The `name` of the current application as given in `applications`.
- `modules`: A list of modules provided by this application, given as objects containing an `id` (used to generate its URL), a `component` to render, and an `icon` and a `label` (`react-intl` message descriptor) to show in the sidebar menu.
- `menuLabel`: The label for the topbar menu. Typically the logged-in user's email.
- `menuItems`: A list of items in the topbar menu, given as objects containing `label` (`react-intl` message descriptor), `handler`function for selecting the item, and an `icon` id to show.
- `scopeHOC`: A higher-order component that furnishes the scope selector with properties. See `Scope` component for the props this should provide.

Intended as the outermost visual component of an application, and handles the sidebar with the application selector and main menu, and the top bar with user menu and help popup. Modules will be rendered as links in the sidebar, and as routes to components in the viewport.

## Button

- `primary`: If this flag is set, the button will be highlighted as a primary button.
- `active`: If this flag is set, the button will be shown as currently active. Implies a toggle function.

A styled `<button>`, set up to look consistent across the UI. Use this as a drop-in replacement for `<button>` elements.

## Checkbox

Shows a pretty checkbox. The same props are accepted as for `<input type="checked" />` elements. Use `value` for whether the checkbox is checked or not, rather than `checked`. If no `id` is passed, one will be generated and used.

## DevPages

- `children`: Children of the component will be rendered on routes not starting with `/dev`.

Inserts a set of developer pages to be found under `/dev/<page>`. In production, this should be replaced with a passthrough component that directly renders its child.

## DropMenu

- `menuLabel`: The menu anchor label text.
- `menuItems`: A list of objects with `label` and `handler` properties. The former is the text to show, the latter the function to call on clicking the item.

A simple menu component that will show a list of items when clicked. Assigning it a class will apply it to the menu anchor, allowing it to be styled with Styled Components.

## I18n

Redux-connected internationalization-provider. Use this as a wrapper component for your app, inside your redux provider, and outside any internationalized content. Uses `react-intl`, and expects a state store created with `buildState`, above, or at least one including a `locale` reducer created by `reducers/localeFactory`. Needs no further properties. Used by [`<Provision>`](#provision) - if that component is in use, this one is already present.

## Icon

- `id`: ID of the icon to display.

Shows a single SVG icon, according to the icon id given. Requires `content/icons.svg` (or another, similarly structured SVG sprite sheet) to have been inserted in the DOM. Size is controlled by setting the CSS font-size.

## Input

A styled input field to be used in place of `<input>`. Takes the same props as this element and should be used as a replacement of it. Avoid using this for checkboxes, instead use the `Checkbox` component.

## List

- `columnDefs`: An array of objects, each describing one column in the table.
- `rows`: An array of data objects, each corresponding to one row in the table. Should contain the fields defined in `columnDefs`, and importantly, the `keyField` (q.v.).
- `rowOnClick`: A click handler for rows. The target element of the event will have `data-row-id` set, which can be accessed via `event.target.dataset["rowId"]`, and which contains the row ID of the row that was clicked (see also `keyField`). This handler is not fired when the click was on a form element (i.e. `<input>`, `<select>`, `<label>`).
- `keyField`: A key name (or key path) pointing to a member on each row that is uniquely identifying. This value will be used to reference the row in selections, the `rowOnClick` handler, etc.
- `scrollLoader`: A function that, given a page number, loads in more items for the list.

Configurable list component. Shows a table of information, according to the given configuration. If the `scrollLoader` prop is present, the list will be rendered with virtual scrolling, and the loader function will be called everytime the user scrolls close to the botton of the list. Props for controlling infinite scroll can be found in documentation of the `withInfiniteScroll` HOC, which is used to add this functionality.

## Modal

- `look`: The appearance of the dialog box. One of `'default'` or `'dark'`.
- `anchor`: A React render function to be rendered as the anchor element. This should take a `toggle` function as parameter, which when invoked will toggle visibility of the dialog.
- `content`: A React render function to be rendered as the dialog contents. This should take a `toggle` function as parameter, which when invoked will toggle visibility of the dialog.

Shows a modal dialog box, which will close if clicked outside. Children of the component tag will be rendered inside the dialog box.

## Provision

- `store`: The redux store of the application.
- `theme`: The theme object to be used in the app.

Sets up the various providers and wrappers needed for an application. Should have one child element, in most cases a redux-connected `<AppFrame>`.

## Scope

- `currentScope`: The currently selected scope, as stored in state.
- `getScope`: A function that will get a single scope by name
- `filterPlaceholder`: A message descriptor to be used as the placeholder in the filter input.

A component that shows a scope bar with slide-out scope selector. Uses Redux view state to control scope selector panel visibility, scope filtering, and the scope tree state.

## Sidepanel

- `timeout`: The time taken for the sliding animation, in milliseconds. Default 1000.
- `width`: The width of the panel. Controls both element size and animation. Default 200px.

Renders a side panel which will slide into view from the left side of the screen. Can and should be styled with `styled-components`.

## SpriteSheet

Displays all available icons along with the ids to access them.

## Switch

- `onCaption`: A message descriptor (as used by `react-intl`) to be shown when the switch is on.
- `offCaption`: A message descriptor (as used by `react-intl`) to be shown when the switch is off.
- `onColor`: A string containing a CSS color value. The switch will show this color when on.
- `offColor`: A string containing a CSS color value. The switch will show this color when off.

Displays a horizontal toggle switch. This is a wrapper around a `<input type="checkbox" />`, so any props that work with that will also work here. Use `value` to set the value, not `checked`. If no `id` is passed, one will be generated and used.

## Treeview

- `Content`: A React component. This will render the leaf nodes of the tree. Default: a null component.
- `getNode`: A function which takes a node id, and returns a data object for the node containing at least the node id, and the ids of any children. If no object is returned, the node will not be rendered. Default: Returns null.
- `rootId`: An id identifying the root node of the tree.
- `nodeState`: An object containing ids of open nodes.
- `updateNodeState`: A function to update the `nodeState` with, takes the modified `nodeState`. Default: No-op.
- `openAll`: If truthy all nodes are rendered as open, regardless of `nodeState`.

Renders a tree view, with opening and closing nodes. The data for a given node, as well as any extra props given to the Treeview, will be passed on to any rendered `Content` elements as props. This means that an onClick handler on `Treeview` will be given to all its `Content` elements, for instance.