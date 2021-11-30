import { CLASS_DETAIL } from "actions/types.action";

const initState = null;

export default function (state = initState, action) {
	switch (action.type) {
		case CLASS_DETAIL.SET:
			return action.payload;

		case CLASS_DETAIL.REMOVE:
			return null;

		default:
			return state;
	}
}
