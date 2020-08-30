import React, {useState} from 'react';
import clsx from 'clsx';
import {useTheme} from '@material-ui/core/styles';
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
import {
    TITLE_TEXT_COLOR,
    TOOLBAR_PANEL_COLOR
} from "../../../constants/constants";
import {Grid} from "@material-ui/core";
import {UserAvatar} from "../../ui/UserAvatar";
import log from "loglevel";
import {useDispatch, useSelector} from "react-redux";
import {
    SIDEBAR_DRAWER_CLOSED,
    SIDEBAR_DRAWER_OPEN
} from "../../../actions/types";
import SearchBar from "../../ui/SearchBar";
import {useQuery, useSubscription} from "@apollo/client";
import {
    GET_USER_PROFILE,
    GET_APP_NOTIFICATION
} from "../../../constants/graphql";
import {useSidebarStyles} from "../../../styles/sidebarStyles"
import IconTabs from "../../ui/IconTabs";
import history from "../../../history";
import {NewFriendRequest} from "./NewFriendRequest";
import {PendingFriendRequest} from "./PendingFriendRequest";
import {AcceptedFriendRequest} from "./AcceptedFriendRequest";
import {useSubscriptionNotification} from "../../../hooks/useSubscriptionNotification";
import {useQueriedUserProfile} from "../../../hooks/useQueriedUserProfile";
import {LogoutButton} from "./LogoutButton";
import {useSnackbar} from "notistack";

export const SideBar = () => {
    const classes = useSidebarStyles();
    const theme = useTheme();
    const dispatch = useDispatch()
    const sidebarDrawerStatus = useSelector(state => state.sidebarDrawerReducer)
    const {user_name: activeUsername} = useSelector(state => state.activeUsernameReducer)
    const notificationReducer = useSelector(state => state.notificationReducer)
    const selectedFriend = useSelector(state => state.friendSelectionReducer)

    // initial sidebar states
    const [sidebarState, setSidebarState] = useState({tabValue: 0, findBtnState: false})

    // get data for the first time render
    const {data: queriedUserProfile, loading: queriedUserProfileLoading} = useQuery(GET_USER_PROFILE,
        {variables: {user_name: activeUsername}})

    // update this component when we get new notification
    const {data: subscribedData, loading: subscribedDataLoading} = useSubscription(GET_APP_NOTIFICATION, {
        variables: {user_name: activeUsername}
    })

    const {enqueueSnackbar} = useSnackbar();

    // custom hooks
    useSubscriptionNotification(subscribedData, subscribedDataLoading, enqueueSnackbar)
    useQueriedUserProfile(queriedUserProfile, queriedUserProfileLoading)

    /**
     * Add friend based on selected tab.
     *
     * @param friends
     * @param friendComponentList
     * @param newlyJoined
     */
    const addFriendBasedOnRequestStatus = (friends, friendComponentList, newlyJoined) => {
        if (friends.length === 0) {
            return
        }

        log.info(`addFriendBasedOnRequestStatus = ${JSON.stringify(friends)}`)
        friends.forEach(({request_status, channel_id, friend_user_name}) => {
            switch (request_status.charAt(0)) {
                case 'a':
                    if (sidebarState.tabValue === 0) {
                        friendComponentList.push(<AcceptedFriendRequest key={channel_id}
                                                                        channel_id={channel_id}
                                                                        friend_user_name={friend_user_name}
                                                                        selectedFriend={selectedFriend.friend_user_name}
                                                                        newlyJoined={newlyJoined}
                                                                        sidebarDrawerStatus={sidebarDrawerStatus}/>)
                    }
                    break
                case 'n':
                    if (sidebarState.tabValue === 1) {
                        friendComponentList.push(<NewFriendRequest key={channel_id}
                                                                   channel_id={channel_id}
                                                                   friend_user_name={friend_user_name}/>)
                    }
                    break
                case 'p':
                    if (sidebarState.tabValue === 2) {
                        friendComponentList.push(<PendingFriendRequest key={channel_id}
                                                                       channel_id={channel_id}
                                                                       friend_user_name={friend_user_name}/>)
                    }
                    break
                default:
                    throw new Error(`[SideBar] request_status option ${request_status} not supported.`)
            }
        })
    }

    const renderFriendsBasedOnTabSelection = () => {
        log.info(`[SideBar] renderFriends queriedUserProfile = ${JSON.stringify(queriedUserProfile)}, sidebarState = ${JSON.stringify(sidebarState)}`)

        let friendComponentList = []

        // render friends from new notification data from subscription
        addFriendBasedOnRequestStatus(notificationReducer.acceptedRequests, friendComponentList, "new")
        addFriendBasedOnRequestStatus(notificationReducer.newRequests, friendComponentList)
        addFriendBasedOnRequestStatus(notificationReducer.pendingRequests, friendComponentList)

        // render friends from the query and this will be rendered only for the first time.
        if (!queriedUserProfileLoading && queriedUserProfile && queriedUserProfile.userProfile) {
            addFriendBasedOnRequestStatus(queriedUserProfile.userProfile.friends, friendComponentList)
        }

        // if no components
        if (friendComponentList.length === 0) {
            if (sidebarState.tabValue === 0 && sidebarDrawerStatus) {
                friendComponentList.push(renderEmptyRequestComponent('No Friends'))
            } else if (sidebarState.tabValue === 1) {
                friendComponentList.push(renderEmptyRequestComponent('No New Requests'))
            } else if (sidebarState.tabValue === 2) {
                friendComponentList.push(renderEmptyRequestComponent('No Pending Requests'))
            }
        }
        return friendComponentList
    }

    const renderEmptyRequestComponent = (title) => {
        return (
            <Grid key={title} container justify="center" style={{
                fontSize: "1rem", paddingTop: 20, fontWeight: 400,
                color: TITLE_TEXT_COLOR
            }}>
                {title}
            </Grid>
        )
    }

    const renderTitle = (title) => {
        return (
            <Typography variant="h6" noWrap style={{paddingLeft: 30, color: TITLE_TEXT_COLOR, fontSize: "1.5rem"}}>
                {title}
            </Typography>
        )
    }

    const changeFindBtnState = (value) => {
        setSidebarState({...sidebarState, findBtnState: value})
    }

    const tabIconStateHandler = (value) => {
        setSidebarState({...sidebarState, tabValue: value})
    }

    /**
     * store the drawer status in redux
     */
    const handleDrawerOpen = () => {
        dispatch({
            type: SIDEBAR_DRAWER_OPEN
        })
    };

    const handleDrawerClose = () => {
        dispatch({
            type: SIDEBAR_DRAWER_CLOSED
        })

        // on drawer close reset the tab to accepted friends.
        setSidebarState({...sidebarState, findBtnState: false, tabValue: 0})
    };

    if (!activeUsername) {
        history.push("/login")
        return null
    }

    log.info(`[SideBar] Rendering SideBar Component....sidebarState = ${JSON.stringify(sidebarState)}`)

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: sidebarDrawerStatus,
                })}
            >
                <Toolbar style={{backgroundColor: TOOLBAR_PANEL_COLOR}}>
                    <IconButton
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        style={{color: TITLE_TEXT_COLOR}}
                        className={clsx(classes.menuButton, {
                            [classes.hide]: sidebarDrawerStatus,
                        })}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" style={{color: TITLE_TEXT_COLOR, fontSize: "1.5rem"}}>
                        Messenger
                    </Typography>
                    <Grid container justify="flex-end">
                        <UserAvatar size="md" name={activeUsername}/>
                    </Grid>
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
                <Grid container style={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: TOOLBAR_PANEL_COLOR}}>
                    <Grid container alignItems="center">
                        <Grid item xs={10}>
                            {renderTitle(sidebarState.findBtnState ? "Find Friends" : "My Friends")}
                        </Grid>
                        <Grid item xs={2}>
                            <div className={classes.toolbar}>
                                <IconButton onClick={handleDrawerClose} style={{color: TITLE_TEXT_COLOR}}>
                                    {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                                </IconButton>
                            </div>
                        </Grid>
                    </Grid>

                    <Divider/>

                    {sidebarDrawerStatus ?
                        <>
                            <SearchBar changeFindBtnState={changeFindBtnState}/>
                            {
                                sidebarState.findBtnState ? null :
                                    <Grid container justify="center">
                                        <IconTabs tabIconStateHandler={tabIconStateHandler}
                                                  sidebarTabValue={sidebarState.tabValue}/>
                                    </Grid>
                            }
                        </>
                        : null}
                </Grid>

                <Grid container style={{overflow: "auto", position: "relative", bottom: 60, paddingTop: 60}}>
                    {sidebarState.findBtnState ? null : <List
                        style={{width: "-webkit-fill-available"}}>
                        {renderFriendsBasedOnTabSelection()}
                    </List>}
                </Grid>

                <LogoutButton/>
            </Drawer>
        </div>
    );
}
