import { LINK } from "./types.action";

export const setLinkId = (data) => async (dispatch) => {
    let linkId = data;

    dispatch({
        type: LINK.SET,
        payload: linkId,
    });
};

export const removeLinkId = () => (dispatch) => {
    dispatch({
        type: LINK.REMOVE,
        payload: null,
    });
};
