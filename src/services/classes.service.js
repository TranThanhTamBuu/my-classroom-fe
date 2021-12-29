import rest from "./rest";

const URL = "/classes";
const LINK_URL = "/link";
const JOIN_LINK_URL = "/link/accept";
const CHECK_LINK_URL = "/link/check";
const ASSIGNMENT_URL = "/assignment";

const getClasses = async () => {
	const res = await rest.get(URL);
	return res.data;
};

const getDetailClass = async (id) => {
	const res = await rest.get(`${URL}/${id}`);
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
};

const checkJoinLinkValid = async (linkId) => {
	console.log("checkJoinLinkValid: ", linkId);
	const res = await rest.get(CHECK_LINK_URL + `/${linkId}`);
	return res.data;
};

const updateAssignment = async (data) => {
	const res = await rest.put(ASSIGNMENT_URL, data);
	return res.data;
};

const getAllAssignments = async (id) => {
	const res = await rest.get(ASSIGNMENT_URL + `/${id}`);
	return res.data;
};

const deleteAssignment = async (id) => {
	const res = await rest.delete(ASSIGNMENT_URL + `/${id}`);
	return res.data;
};

const createAssignment = async (data) => {
	const res = await rest.post(ASSIGNMENT_URL, data);
	return res.data;
};

const putStudentList = async (data) => {
	const res = await rest.put(`${URL}/studentList`, data);
	return res.data;
};

const getGradeboard = async (id) => {
	const res = await rest.get(`${ASSIGNMENT_URL}/grade/class/${id}`);
	return res.data;
};

const getGradeboardTemplate = async (id) => {
	const res = await rest.get(`${ASSIGNMENT_URL}/grade/default/${id}`);
	return res.data;
};

const setListGrade = async (data) => {
	const res = await rest.put(`${ASSIGNMENT_URL}/grade`, data);
	return res.data;
};

const getAllClasses = async () => {
	const res = await rest.get(`${URL}/all`);
	return res.data;
};

const toggleActive = async (classIds, active) => {
	try {
		const res = await rest.post(URL + "/toggle-active", {
			classIds,
			active,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export default {
	getClasses,
	createClass,
	getDetailClass,
	inviteToClass,
	joinClass,
	checkJoinLinkValid,
	updateAssignment,
	getAllAssignments,
	deleteAssignment,
	createAssignment,
	putStudentList,
	getGradeboard,
	getGradeboardTemplate,
	setListGrade,
	getAllClasses,
	toggleActive,
};
