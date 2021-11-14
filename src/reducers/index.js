import { combineReducers } from "redux";
import classesReducer from "./classes.reducer";
import userReducer from "./user.reducer";
import linkReducer from "./link.reducer";
import authenticationReducer from "./authentication.reducer";

const allReducers = combineReducers({
	classes: classesReducer,
	user: userReducer,
	link: linkReducer,
	authentication: authenticationReducer,
});

export default allReducers;
