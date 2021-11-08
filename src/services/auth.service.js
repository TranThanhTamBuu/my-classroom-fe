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

export default {
	getCurrentUser,
	signIn,
	signUp,
	editProfile,
};
