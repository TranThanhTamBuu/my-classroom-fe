import { combineReducers } from "redux";
import classesReducer from "./classes.reducer";

const allReducers = combineReducers({
	classes: classesReducer,
});

export default allReducers;
