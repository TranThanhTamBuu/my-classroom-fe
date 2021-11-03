import { CLASSES } from "actions/types.action";

const initState = [];

export default function (state = initState, action) {
	switch (action.type) {
		case CLASSES.SET:
			return action.payload;

		case CLASSES.PUSH:
			return [...state, action.payload];

		default:
			return state;
	}
}
