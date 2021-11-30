import { combineReducers } from "redux";
import classesReducer from "./classes.reducer";
import userReducer from "./user.reducer";
import linkReducer from "./link.reducer";
import authenticationReducer from "./authentication.reducer";
import classDetailReducer from "./classDetail.reducer";

const allReducers = combineReducers({
	classes: classesReducer,
	user: userReducer,
	link: linkReducer,
	authentication: authenticationReducer,
	classDetail: classDetailReducer,
});

export default allReducers;
