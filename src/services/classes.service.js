import axios from "axios";

const URL = process.env.REACT_APP_BE_URL + "/classes";

const getClasses = async () => {
	try {
		const res = await axios.get(URL);
		return res.data;
	} catch (error) {
		console.log(
			"🚀 ~ file: classes.service.js ~ line 7 ~ getClasses ~ error",
			error
		);
	}
};

const createClass = async ({ name, section, room, subject }) => {
	try {
		const res = await axios.post(URL, { name, section, room, subject });
		return res.data;
	} catch (error) {
		console.log(
			"🚀 ~ file: classes.service.js ~ line 7 ~ getClasses ~ error",
			error
		);
	}
};

export default {
	getClasses,
	createClass,
};
