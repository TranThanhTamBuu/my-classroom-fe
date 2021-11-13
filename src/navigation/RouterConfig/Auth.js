import { lazy } from "react";
import { RouteUrl } from "constants/router";

export const AuthConfig = [
	{
		component: lazy(() => import("screens/Classes")),
		path: RouteUrl.MY_CLASSES,
	},
	{
		component: lazy(() => import("screens/ClassDetail")),
		path: RouteUrl.CLASS_DETAIL,
	},
	{
		component: lazy(() => import("screens/Setting")),
		path: RouteUrl.SETTING,
	},
	{
		component: lazy(() => import("screens/LoggedAcceptLink")),
		path: RouteUrl.ACCEPT_LINK,
	},
];
