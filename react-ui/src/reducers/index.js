import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import {sidebarDrawerReducer} from "./sidebarReducer";
import {activeUserReducer} from "./activeUserReducer";

export default combineReducers({
    form: formReducer,
    sidebarDrawerReducer,
    activeUserReducer
});