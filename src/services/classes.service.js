import rest from "./rest";

const URL = "/classes";

const getClasses = async () => {
	const res = await rest.get(URL);
	return res.data;
};

const createClass = async ({ name, section, room, subject }) => {
	const res = await rest.post(URL, { name, section, room, subject });
	return res.data;
};

export default {
	getClasses,
	createClass,
};
