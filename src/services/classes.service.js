import rest from "./rest";

const URL = "/classes";
const LINK_URL = "/link";
const JOIN_LINK_URL = "/link/accept";
const CHECK_LINK_URL = "/link/check";
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

const joinClass = async (data) => {
	const res = await rest.put(JOIN_LINK_URL, data);
	return res.data;
}

const checkJoinLinkValid = async (linkId) => {
	console.log("checkJoinLinkValid: ", linkId);
	const res = await rest.get(CHECK_LINK_URL + `/${linkId}`);
	return res.data;
}

export default {
	getClasses,
	createClass,
	getDetailClass,
	inviteToClass,
	joinClass,
	checkJoinLinkValid,
};
