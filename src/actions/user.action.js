import { USER } from "./types.action";
import AuthService from "services/auth.service";
import rest from "services/rest";

export const initUser = () => async (dispatch) => {
	rest.init();

	let user = null;
	try {
		user = await AuthService.getCurrentUser();
	} catch (err) {
		rest.removeAccessToken();
		localStorage.clear();
	}

	dispatch({
		type: USER.SET,
		payload: user,
	});
};

export const signOut = () => (dispatch) => {
	rest.removeAccessToken();
	localStorage.clear();

	dispatch({
		type: USER.REMOVE,
	});
};
