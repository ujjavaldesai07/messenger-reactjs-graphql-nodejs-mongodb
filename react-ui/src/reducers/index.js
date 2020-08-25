import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import {sidebarDrawerReducer, friendSelectionReducer} from "./sidebarReducer";
import {activeUsernameReducer} from "./activeUserReducer";

export default combineReducers({
    form: formReducer,
    sidebarDrawerReducer,
    friendSelectionReducer,
    activeUsernameReducer,
});