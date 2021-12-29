import rest from "./rest";

const URL = "/auth";

const getCurrentUser = async () => {
	const res = await rest.get(URL);
	return res.data;
};

const signIn = async (data) => {
	try {
		const res = await rest.post(URL + "/sign-in", data);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

const signUp = async (data) => {
	try {
		const res = await rest.post(URL + "/sign-up", data);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

const editProfile = async (data) => {
	try {
		const res = await rest.post(URL + "/profile", data);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

const getAllUsers = async () => {
	const res = await rest.get(URL + "/users/user");
	return res.data;
};

const getAllAdmins = async () => {
	const res = await rest.get(URL + "/users/admin");
	return res.data;
};

const createAdmin = async (data) => {
	try {
		const res = await rest.post(URL + "/create-admin", data);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

const changeStudentId = async (data) => {
	try {
		const res = await rest.post(URL + "/change-student-id", data);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

const toggleActive = async (userIds, active) => {
	try {
		const res = await rest.post(URL + "/toggle-active", {
			userIds,
			active,
		});
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export default {
	getCurrentUser,
	signIn,
	signUp,
	editProfile,
	getAllUsers,
	createAdmin,
	changeStudentId,
	toggleActive,
	getAllAdmins,
};
