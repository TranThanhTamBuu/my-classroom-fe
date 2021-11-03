import { lazy } from "react";
import { RouteUrl } from "constants/router";

export const AuthConfig = [
	{
		component: lazy(() => import("screens/Classes")),
		path: RouteUrl.MY_CLASSES,
	},
];
