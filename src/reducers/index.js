import { combineReducers } from "redux";
import classesReducer from "./classes.reducer";
import userReducer from "./user.reducer";
import linkReducer from "./link.reducer";

const allReducers = combineReducers({
	classes: classesReducer,
	user: userReducer,
	link: linkReducer,
});

export default allReducers;
