import { LINK } from "actions/types.action";

const initState = null;

export default function (state = initState, action) {
    switch (action.type) {
        case LINK.SET:
            return action.payload;

        case LINK.REMOVE:
            return null;

        default:
            return state;
    }
}