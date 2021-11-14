import { AUTHENTICATION } from "actions/types.action";

const initState = "sign-in";

export default function (state = initState, action) {
	switch (action.type) {
		case AUTHENTICATION.SET:
			return action.payload;

		default:
			return state;
	}
}
