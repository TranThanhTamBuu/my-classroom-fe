import React, { useEffect } from "react";
import { useSearchParam } from "react-use";
import { LOCAL_STORAGE_KEY } from "constants/localStorage";

export default function OAuth() {
	const accessToken = useSearchParam("accessToken");
	const statusCode = useSearchParam("statusCode");

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
		localStorage.setItem(LOCAL_STORAGE_KEY.STATUS_CODE, statusCode);
		window.close();
	}, []);

	return <div></div>;
}
