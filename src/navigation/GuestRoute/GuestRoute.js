import React from "react";
import { Suspense } from "react";
import { Route } from "react-router";

import CircularProgress from "@mui/material/CircularProgress";

function GuestRoute({ path, exact, component: Component }) {
	return (
		<Route path={path} exact={exact}>
			<Suspense fallback={<CircularProgress />}>
				<Component />
			</Suspense>
		</Route>
	);
}

export default GuestRoute;
