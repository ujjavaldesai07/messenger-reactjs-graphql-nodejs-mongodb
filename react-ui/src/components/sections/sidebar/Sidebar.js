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

    // initial sidebar states
    const [sidebarState, setSidebarState] = useState({tabValue: 0, findBtnState: false})

    // update this component when we get new notification
    const {data: subscribedData, loading: subscribedDataLoading} = useSubscription(GET_APP_NOTIFICATION, {
        variables: {user_name: activeUsername}
    })

    // get data for the first time render
    const {data: queriedUserProfile, loading: queriedUserProfileLoading} = useQuery(GET_USER_PROFILE,
        {variables: {user_name: activeUsername}})

    const {enqueueSnackbar} = useSnackbar();

    // custom hooks
    useSubscriptionNotification(subscribedData, subscribedDataLoading, enqueueSnackbar)

    useQueriedUserProfile(queriedUserProfile, queriedUserProfileLoading, enqueueSnackbar)


    // renderers
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

    const renderAcceptedFriendRequestComponent = (friends, friendComponentList, newlyJoined) => {
        if (friends.length === 0) {
            return
        }

        friends.forEach(({channel_id, friend_user_name}) => {
            friendComponentList.push(<AcceptedFriendRequest key={channel_id}
                                                            channel_id={channel_id}
                                                            friend_user_name={friend_user_name}
                                                            newlyJoined={newlyJoined}/>)
        })
    }

    const renderNewFriendRequestComponent = (friends, friendComponentList) => {
        if (friends.length === 0) {
            return
        }

        friends.forEach(({channel_id, friend_user_name}) => {
            friendComponentList.push(<NewFriendRequest key={channel_id}
                                                       channel_id={channel_id}
                                                       friend_user_name={friend_user_name}/>)
        })
    }

    const renderPendingFriendRequestComponent = (friends, friendComponentList) => {
        if (friends.length === 0) {
            return
        }

        friends.forEach(({channel_id, friend_user_name}) => {
            friendComponentList.push(<PendingFriendRequest key={channel_id}
                                                           channel_id={channel_id}
                                                           friend_user_name={friend_user_name}/>)
        })
    }

    /**
     * Add friend based on selected tab.
     *
     */
    const renderFriendsBasedOnTabSelection = () => {
        log.info(`[SideBar] renderFriends queriedUserProfile = ${JSON.stringify(queriedUserProfile)},
         sidebarState = ${JSON.stringify(sidebarState)}`)

        log.info(`[SideBar] renderFriendsBasedOnTabSelection notificationReducer = ${JSON.stringify(notificationReducer)}`)

        let friendComponentList = []

        const friends = {
            acceptedRequests: [],
            newRequests: [],
            pendingRequests: []
        }

        try {
            if (!queriedUserProfileLoading && queriedUserProfile.userProfile.friends) {
                friends.acceptedRequests = queriedUserProfile.userProfile.friends.acceptedRequests
                friends.newRequests = queriedUserProfile.userProfile.friends.newRequests
                friends.pendingRequests = queriedUserProfile.userProfile.friends.pendingRequests
            }
        } catch (e) {
            log.info(`[SideBar] queriedUserProfile is empty = ${JSON.stringify(queriedUserProfile)}`)
        }

        // render friends from new notification data from subscription
        // render friends from the query and this will be rendered only for the first time.
        switch (sidebarState.tabValue) {
            case 0:
                renderAcceptedFriendRequestComponent(notificationReducer.acceptedRequests,
                    friendComponentList, "new")
                renderAcceptedFriendRequestComponent(friends.acceptedRequests,
                    friendComponentList)

                if (sidebarDrawerStatus && friendComponentList.length === 0) {
                    friendComponentList.push(renderEmptyRequestComponent('No Friends'))
                }
                break
            case 1:
                renderNewFriendRequestComponent(notificationReducer.newRequests,
                    friendComponentList)
                renderNewFriendRequestComponent(friends.newRequests,
                    friendComponentList)

                if (sidebarDrawerStatus && friendComponentList.length === 0) {
                    friendComponentList.push(renderEmptyRequestComponent('No New Requests'))
                }
                break
            case 2:
                renderPendingFriendRequestComponent(notificationReducer.pendingRequests,
                    friendComponentList)
                renderPendingFriendRequestComponent(friends.pendingRequests,
                    friendComponentList)

                if (sidebarDrawerStatus && friendComponentList.length === 0) {
                    friendComponentList.push(renderEmptyRequestComponent('No Pending Requests'))
                }
                break
            default:
                log.error(`[SideBar] Unknown value on tab selection = ${sidebarState.tabValue}.`)
        }

        return friendComponentList
    }

    // event handlers
    const changeFindBtnState = (value) => {
        setSidebarState({...sidebarState, findBtnState: value})
    }

    const tabIconStateHandler = (value) => {
        setSidebarState({...sidebarState, tabValue: value})
    }

    const handleDrawerOpen = () => {
        // store the drawer status in redux
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

    // if user has not logged in and tries to land on this page
    // then just redirect it login page.
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
