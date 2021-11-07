import axios from "axios";
import { LOCAL_STORAGE_KEY } from "constants/localStorage";

const rest = axios.create({
	baseURL: process.env.REACT_APP_BE_URL,
});

rest.setAccessToken = function (token) {
	rest.defaults.headers["authorization"] = `Bearer ${token}`;
};

rest.removeAccessToken = function () {
	delete rest.defaults.headers["authorization"];
};

rest.init = function () {
	rest.setAccessToken(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN));
};

export default rest;
