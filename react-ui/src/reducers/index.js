import {combineReducers} from "redux";
import {sidebarDrawerReducer, friendSelectionReducer} from "./sidebarReducer";
import {activeUsernameReducer} from "./activeUserReducer";
import {notificationReducer, excludeSearchSuggestionsReducer} from "./commonReducer";

export default combineReducers({
    sidebarDrawerReducer,
    friendSelectionReducer,
    activeUsernameReducer,
    notificationReducer,
    excludeSearchSuggestionsReducer
});