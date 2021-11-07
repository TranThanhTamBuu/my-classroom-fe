import { CLASSES } from "./types.action";
import ClassesService from "services/classes.service";

export const setClasses = () => async (dispatch) => {
	let data;

	try {
		data = await ClassesService.getClasses();
		dispatch({
			type: CLASSES.SET,
			payload: data,
		});
	} catch (err) {
		console.log(
			"🚀 ~ file: classes.action.js ~ line 10 ~ setClasses ~ err",
			err
		);
	}
};

export const pushClasses = (data) => async (dispatch) => {
	let newClass;

	try {
		newClass = await ClassesService.createClass(data);
		dispatch({
			type: CLASSES.PUSH,
			payload: newClass,
		});
	} catch (err) {
		console.log(
			"🚀 ~ file: classes.action.js ~ line 10 ~ setClasses ~ err",
			err
		);
	}
};
