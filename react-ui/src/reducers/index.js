import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import {sidebarDrawerReducer} from "./sidebarReducer";

export default combineReducers({
    form: formReducer,
    sidebarDrawerReducer
});