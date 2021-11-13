import React, { useEffect, Suspense } from "react";
import { Route, useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import CircularProgress from "@mui/material/CircularProgress";
import { AppLayout } from "layouts";
import { setLinkId } from "actions/link.action";

function AuthRoute({ path, exact, component: Component }) {
	const history = useHistory();
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const token = useParams();
	useEffect(() => {
		if (!user) {
			if (path.toString().includes('activate')) {
				dispatch(setLinkId(token.toString()));
			}
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
