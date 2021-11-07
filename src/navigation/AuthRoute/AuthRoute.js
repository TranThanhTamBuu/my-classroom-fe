import React, { useEffect } from "react";
import { Suspense } from "react";
import { Route, useHistory } from "react-router";
import { useSelector } from "react-redux";

import CircularProgress from "@mui/material/CircularProgress";
import { AppLayout } from "layouts";

function AuthRoute({ path, exact, component: Component }) {
	const history = useHistory();
	const user = useSelector((state) => state.user);

	useEffect(() => {
		if (!user) {
			history.push("/");
		}
	}, []);

	if (!user) return null;

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

export default AuthRoute;
