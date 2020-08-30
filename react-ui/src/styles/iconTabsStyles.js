import {makeStyles} from "@material-ui/core/styles";
import {DRAWER_WIDTH, NOTIFICATION_COLOR, SIDEBAR_PANEL_COLOR, TITLE_TEXT_COLOR} from "../constants/constants";

export const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        width: "inherit",
        backgroundColor: SIDEBAR_PANEL_COLOR
    },
    tabsFlexContainer: {
        width: "inherit",
        color: TITLE_TEXT_COLOR
    },
    tabIndicator: {
        backgroundColor: TITLE_TEXT_COLOR
    },
    tabRoot: {
        minWidth: `calc(${DRAWER_WIDTH/3}px)`
    },
    badge: {
        backgroundColor: NOTIFICATION_COLOR,
        color: "black"
    }
});