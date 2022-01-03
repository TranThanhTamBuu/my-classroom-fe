import rest from "./rest";

const URL = "/notification";

const getNotifications = async () => {
	try {
		const res = await rest.get(URL + "/");
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

const readNotifications = async (data) => {
	try {
		const res = await rest.post(URL + `/read`, data);
		return res.data;
	} catch (error) {
		return error.response.data;
	}
};

export default {
	getNotifications,
	readNotifications,
};
