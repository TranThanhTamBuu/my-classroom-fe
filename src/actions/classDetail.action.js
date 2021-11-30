import { CLASS_DETAIL } from "./types.action";

export const setClassDetail = (data) => async (dispatch) => {
	let classDetail = data;

	dispatch({
		type: CLASS_DETAIL.SET,
		payload: classDetail,
	});
};

export const removeClassDetail = () => (dispatch) => {
	dispatch({
		type: CLASS_DETAIL.REMOVE,
		payload: null,
	});
};
