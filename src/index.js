import * as React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { App } from "components";
import "./index.css";

import store from "./store";
import { Provider } from "react-redux";

ReactDOM.render(
	<Provider store={store}>
		{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
		<CssBaseline />
		<App />
	</Provider>,
	// eslint-disable-next-line no-undef
	document.getElementById("root")
);
