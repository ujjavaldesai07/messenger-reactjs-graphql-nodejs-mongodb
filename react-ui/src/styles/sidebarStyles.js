import {makeStyles} from "@material-ui/core/styles";
import {
    DRAWER_WIDTH, LIST_BORDER_COLOR,
    RECEIVER_CHAT_BUBBLE_BACKGROUND, SIDEBAR_PANEL_COLOR,
    TITLE_TEXT_COLOR,
    TOOLBAR_PANEL_COLOR
} from "../constants/constants";

export const useSidebarStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: DRAWER_WIDTH,
        backgroundColor: SIDEBAR_PANEL_COLOR,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        backgroundColor: SIDEBAR_PANEL_COLOR,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexShrink: 1,
    },
    primaryText: {
        paddingLeft: 10,
        fontSize: "1.2rem",
        color: "white",
        width: 140,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    },
    titlePrimaryText: {
        fontSize: "1.3rem",
    },
    dividerRoot: {
        borderColor: LIST_BORDER_COLOR
    }
}));
