import { combineReducers } from "redux";
import classesReducer from "./classes.reducer";
import userReducer from "./user.reducer";

const allReducers = combineReducers({
	classes: classesReducer,
	user: userReducer,
});

export default allReducers;
