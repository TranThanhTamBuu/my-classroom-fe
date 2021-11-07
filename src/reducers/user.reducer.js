import { USER } from "actions/types.action";
import { LOCAL_STORAGE_KEY } from "constants/localStorage";

const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

const initState = accessToken ? { accessToken } : null;

export default function (state = initState, action) {
	switch (action.type) {
		case USER.SET:
			return action.payload;

		case USER.REMOVE:
			return null;

		default:
			return state;
	}
}
