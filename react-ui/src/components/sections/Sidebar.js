import React from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {DRAWER_WIDTH} from "../../constants/constants";
import {Grid} from "@material-ui/core";
import {UserAvatar} from "../ui/UserAvatar";
import log from "loglevel";
import {useDispatch, useSelector} from "react-redux";
import {
    FRIEND_SELECTED,
    SIDEBAR_DRAWER_CLOSED,
    SIDEBAR_DRAWER_OPEN
} from "../../actions/types";

const useStyles = makeStyles((theme) => ({
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
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
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
}));

const friends = new Map([
    ["1", 'ujjaval'],
    ["2", 'mike'],
])

export const SideBar = () => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch()
    const sidebarDrawerStatus = useSelector(state => state.sidebarDrawerReducer)

    const handleDrawerOpen = () => {
        dispatch({
            type: SIDEBAR_DRAWER_OPEN
        })
    };

    const handleDrawerClose = () => {
        dispatch({
            type: SIDEBAR_DRAWER_CLOSED
        })
    };

    const handleSidebarOptionBtn = (e) => {
        dispatch({
            type: FRIEND_SELECTED,
            payload: {
                id: e.currentTarget.id,
                name: friends.get(e.currentTarget.id)
            }
        })
    }

    const renderFriends = () => {
        let friendsComponentList = []
        for (let [key, value] of  friends.entries()) {
            friendsComponentList.push(
                <ListItem button key={key} id={key} onClick={e => handleSidebarOptionBtn(e)}>
                    <ListItemIcon><UserAvatar size="md" name={value}/></ListItemIcon>
                    <ListItemText primary={value}/>
                </ListItem>
            )
        }
        return friendsComponentList
    }

    log.info(`[SideBar] Rendering SideBar Component....`)

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: sidebarDrawerStatus,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: sidebarDrawerStatus,
                        })}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Chat window
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: sidebarDrawerStatus,
                    [classes.drawerClose]: !sidebarDrawerStatus,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: sidebarDrawerStatus,
                        [classes.drawerClose]: !sidebarDrawerStatus,
                    }),
                }}
            >
                <Grid container alignItems="center">
                    <Grid item xs={10}>
                        <Typography variant="h6" noWrap style={{paddingLeft: 20}}>
                            My Friends
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <div className={classes.toolbar}>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>

                <Divider/>
                <List>
                    {renderFriends()}
                </List>
            </Drawer>
        </div>
    );
}
