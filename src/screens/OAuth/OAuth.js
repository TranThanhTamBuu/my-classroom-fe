import React, { useEffect } from "react";
import { useSearchParam } from "react-use";
import { LOCAL_STORAGE_KEY } from "constants/localStorage";
import Cookies from "universal-cookie";

export default function OAuth() {
	const accessToken = useSearchParam("accessToken");
	const statusCode = useSearchParam("statusCode");
	const cookies = new Cookies();

	useEffect(() => {
		cookies.set(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
		cookies.set(LOCAL_STORAGE_KEY.STATUS_CODE, statusCode);
		window.close();
	}, []);

	return <div></div>;
}
