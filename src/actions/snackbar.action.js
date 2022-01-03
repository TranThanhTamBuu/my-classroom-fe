import { SNACKBAR } from "./types.action";

export const showSnackbar = (data) => async (dispatch) => {
	dispatch({
		type: SNACKBAR.SHOW,
		payload: data,
	});
};

export const removeSnackbar = () => (dispatch) => {
	dispatch({
		type: SNACKBAR.REMOVE,
		payload: null,
	});
};
