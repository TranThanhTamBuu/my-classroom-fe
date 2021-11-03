import React from "react";
import { Suspense } from "react";
import { Route } from "react-router";

import CircularProgress from "@mui/material/CircularProgress";
import { AppLayout } from "layouts";

function GuestRoute({ path, exact, component: Component }) {
	return (
		<Route path={path} exact={exact}>
			<Suspense fallback={<CircularProgress />}>
				<AppLayout>
					<Component />
				</AppLayout>
			</Suspense>
		</Route>
	);
}

export default GuestRoute;
