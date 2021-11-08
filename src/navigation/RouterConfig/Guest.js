import { lazy } from "react";
import { RouteUrl } from "constants/router";

export const GuestConfig = [
	{
		component: lazy(() => import("screens/Authentication")),
		path: RouteUrl.AUTHENTICATION,
	},
	{
		component: lazy(() => import("screens/OAuth")),
		path: RouteUrl.OAUTH,
	},
];
