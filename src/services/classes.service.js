import rest from "./rest";

const URL = "/classes";
const LINK_URL = "/link";
const getClasses = async () => {
	const res = await rest.get(URL);
	return res.data;
};
const getDetailClass = async (id) => {
	const res = await rest.get(URL + `/${id}`);
	return res.data;
};

const createClass = async ({ name, section, room, subject }) => {
	const res = await rest.post(URL, { name, section, room, subject });
	return res.data;
};
const inviteToClass = async (data) => {
	const res = await rest.post(LINK_URL, data);
	return res.data;
};

export default {
	getClasses,
	createClass,
	getDetailClass,
	inviteToClass,
};
