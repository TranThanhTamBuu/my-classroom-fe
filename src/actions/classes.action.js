import { CLASSES } from "./types.action";
import ClassesService from "services/classes.service";

export const setClasses = () => async (dispatch) => {
	const data = await ClassesService.getClasses();

	dispatch({
		type: CLASSES.SET,
		payload: data,
	});
};

export const pushClasses = (data) => async (dispatch) => {
	const newClass = await ClassesService.createClass(data);

	dispatch({
		type: CLASSES.PUSH,
		payload: newClass,
	});
};
