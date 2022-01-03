import { SNACKBAR } from "actions/types.action";

const initState = { open: false, message: "" };

export default function (state = initState, action) {
	switch (action.type) {
		case SNACKBAR.SHOW:
			return { ...state, message: action.payload, open: true };

		case SNACKBAR.REMOVE:
			return { ...state, open: false };

		default:
			return state;
	}
}
