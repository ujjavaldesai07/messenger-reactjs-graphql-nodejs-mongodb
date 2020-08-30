import React, {useEffect, useState} from 'react';
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
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
    ACTIVE_FRIEND_COOKIE,
    USER_AUTH_COOKIE,
    SELF_TEXT,
    PENDING_TEXT,
    ACCEPTED_TEXT,
    REQUESTED_TEXT,
    RECEIVER_CHAT_BUBBLE_BACKGROUND,
    TITLE_TEXT_COLOR,
    TOOLBAR_PANEL_COLOR,
    SIDEBAR_PANEL_COLOR, LIST_BORDER_COLOR, SENDER_CHAT_BUBBLE_BACKGROUND, NOTIFICATION_COLOR
} from "../../constants/constants";
import {Badge, Button, Grid} from "@material-ui/core";
import {UserAvatar} from "../ui/UserAvatar";
import log from "loglevel";
import {useDispatch, useSelector} from "react-redux";
import {
    ACCEPTED_REQUEST_NOTIFICATION, ACTIVE_USERNAME,
    FRIEND_SELECTED, NEW_REQUEST_NOTIFICATION, PENDING_REQUEST_NOTIFICATION, REMOVE_NOTIFICATION, REQUEST_NOTIFICATION,
    SIDEBAR_DRAWER_CLOSED,
    SIDEBAR_DRAWER_OPEN
} from "../../actions/types";
import Cookies from "js-cookie";
import SearchBar from "../ui/SearchBar";
import {useMutation, useQuery, useSubscription} from "@apollo/client";
import {
    ACCEPT_FRIEND_REQUEST,
    GET_USER_PROFILE,
    GET_APP_NOTIFICATION,
    RESET_NOTIFICATION
} from "../../constants/graphql";
import {useSidebarStyles} from "../../styles/sidebarStyles"
import IconTabs from "../ui/IconTabs";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import history from "../../history";

export const SideBar = () => {
    const classes = useSidebarStyles();
    const theme = useTheme();
    const dispatch = useDispatch()
    const sidebarDrawerStatus = useSelector(state => state.sidebarDrawerReducer)
    const activeUsername = useSelector(state => state.activeUsernameReducer)
    const notificationReducer = useSelector(state => state.notificationReducer)
    const selectedFriend = useSelector(state => state.friendSelectionReducer)

    const [sidebarState, setSidebarState] = useState({
        tabValue: 0,
        findBtnState: false,
        excludeSearchSuggestions: new Map()
    })

    // get data for the first time render
    const {data: queriedUserProfile, loading: queriedUserProfileLoading} = useQuery(GET_USER_PROFILE,
        {variables: {user_name: activeUsername}})

    // update this component when we get new notification
    const {data: subscribedData, loading: subscribedDataLoading} = useSubscription(GET_APP_NOTIFICATION, {
        variables: {user_name: activeUsername}
    })
    const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST)

    // reset notification if we have seen it.
    const [resetNotification] = useMutation(RESET_NOTIFICATION)

    log.info(`[SideBar] subscribedData = ${JSON.stringify(subscribedData)}`)
    log.info(`[SideBar] queriedUserProfile = ${JSON.stringify(queriedUserProfile)}`)

    useEffect(() => {
        log.info(`[SideBar] subscribedData = ${JSON.stringify(subscribedData)}, notificationLoading = ${subscribedDataLoading}`)
        if (!subscribedDataLoading && subscribedData && subscribedData.app_notifications) {
            if (subscribedData.app_notifications.friend) {
                let tempSearchSuggestions = new Map()
                let {friend, request_notification} = subscribedData.app_notifications
                switch (friend.request_status && friend.request_status.charAt(0)) {
                    case 'n':
                        if (!sidebarState.excludeSearchSuggestions.has(friend.friend_user_name)) {
                            tempSearchSuggestions.set(friend.friend_user_name, PENDING_TEXT)
                        }

                        dispatch({
                            type: NEW_REQUEST_NOTIFICATION,
                            payload: {newRequests: friend, requestNotification: request_notification}
                        })
                        break
                    case 'a':
                        if (!sidebarState.excludeSearchSuggestions.has(friend.friend_user_name)) {
                            tempSearchSuggestions.set(friend.friend_user_name, ACCEPTED_TEXT)
                        }

                        dispatch({
                            type: ACCEPTED_REQUEST_NOTIFICATION,
                            payload: {acceptedRequests: friend, requestNotification: request_notification}
                        })
                        break
                    case 'p':
                        if (!sidebarState.excludeSearchSuggestions.has(friend.friend_user_name)) {
                            tempSearchSuggestions.set(friend.friend_user_name, REQUESTED_TEXT)
                        }

                        dispatch({
                            type: PENDING_REQUEST_NOTIFICATION,
                            payload: {pendingRequests: friend, requestNotification: request_notification}
                        })
                        break
                    default:
                        throw new Error("Its not possible to land here...")
                }

                if (tempSearchSuggestions.size > 0) {
                    setSidebarState({
                        ...sidebarState,
                        excludeSearchSuggestions: new Map([...sidebarState.excludeSearchSuggestions]
                            .concat([...tempSearchSuggestions]))
                    })
                }

            } else if (subscribedData.app_notifications.request_notification) {
                dispatch({
                    type: REQUEST_NOTIFICATION,
                    payload: {requestNotification: subscribedData.app_notifications.request_notification}
                })
            }
        }

        // eslint-disable-next-line
    }, [subscribedData])

    useEffect(() => {
        if (!queriedUserProfileLoading && queriedUserProfile && queriedUserProfile.userProfile) {
            let tempSearchSuggestions = new Map()
            if (!sidebarState.excludeSearchSuggestions.has(activeUsername)) {
                tempSearchSuggestions.set(activeUsername, SELF_TEXT)
            }
            queriedUserProfile.userProfile.friends.forEach(({request_status, channel_id, friend_user_name}) => {
                if (!sidebarState.excludeSearchSuggestions.has(friend_user_name)) {
                    switch (request_status.charAt(0)) {
                        case 'a':
                            tempSearchSuggestions.set(friend_user_name, ACCEPTED_TEXT)
                            break
                        case 'n':
                            tempSearchSuggestions.set(friend_user_name, PENDING_TEXT)
                            break
                        case 'p':
                            tempSearchSuggestions.set(friend_user_name, REQUESTED_TEXT)
                            break
                        default:
                            throw new Error(`[SideBar] request_status option ${request_status} not supported.`)
                    }
                }
            })
            if (tempSearchSuggestions.size > 0) {
                setSidebarState({
                    ...sidebarState,
                    excludeSearchSuggestions: new Map([...sidebarState.excludeSearchSuggestions]
                        .concat([...tempSearchSuggestions]))
                })
            }

            dispatch({
                type: REQUEST_NOTIFICATION,
                payload: {requestNotification: queriedUserProfile.userProfile.request_notification}
            })
        }

        // eslint-disable-next-line
    }, [queriedUserProfile])

    const friendRequestAcceptHandler = (user_name) => {
        setSidebarState({
            ...sidebarState,
            excludeSearchSuggestions: new Map([...sidebarState.excludeSearchSuggestions]
                .concat([...new Map([[user_name, REQUESTED_TEXT]])]))
        })
    }

    const handleDrawerOpen = () => {
        dispatch({
            type: SIDEBAR_DRAWER_OPEN
        })
    };

    const handleDrawerClose = () => {
        dispatch({
            type: SIDEBAR_DRAWER_CLOSED
        })
        setSidebarState({...sidebarState, findBtnState: false})
    };

    const handleSidebarOptionBtn = (e) => {
        const payload = {
            channel_id: e.currentTarget.id,
            friend_user_name: e.currentTarget.getAttribute("value")
        }

        Cookies.set(ACTIVE_FRIEND_COOKIE, payload, {expires: 7})

        dispatch({
            type: FRIEND_SELECTED,
            payload: payload
        })
    }

    const renderAcceptedFriend = (channel_id, friend_user_name, newlyJoined) => {
        return (
            <ListItem button key={channel_id} id={channel_id} value={friend_user_name}
                      onClick={e => handleSidebarOptionBtn(e)}
                      style={{height: 75}}
                      classes={{divider: classes.dividerRoot}}
                      divider
                      selected={selectedFriend.friend_user_name === friend_user_name}>
                {newlyJoined ?
                    <Badge badgeContent="New" color="secondary"
                           anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                        <ListItemIcon><UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
                    </Badge>
                    : <ListItemIcon><UserAvatar size="md" name={friend_user_name}/></ListItemIcon>}
                <ListItemText primary={friend_user_name} classes={{primary: classes.primaryText}}/>
            </ListItem>
        )
    }

    const renderPendingFriendRequest = (channel_id, friend_user_name) => {
        return (
            <ListItem key={channel_id} id={channel_id} value={friend_user_name} style={{height: 75}}>
                <ListItemIcon><UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
                <ListItemText primary={friend_user_name} classes={{primary: classes.primaryText}}/>
                <Grid container xs={3}>
                <Button variant="outlined" disabled size="small" fullWidth
                        style={{height: 30, fontSize: "0.7rem", color: TITLE_TEXT_COLOR,
                            borderColor: TITLE_TEXT_COLOR}}>
                    Pending
                </Button>
                </Grid>
            </ListItem>
        )
    }

    const renderNewFriendsRequest = (channel_id, friend_user_name) => {
        return (
            <ListItem key={channel_id} id={channel_id} value={friend_user_name} style={{height: 75}}>
                <ListItemIcon><UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
                <ListItemText primary={friend_user_name} classes={{primary: classes.primaryText}}/>
                <Grid container xs={3}>
                    <Button variant="contained" size="small" value={friend_user_name} fullWidth
                            onClick={acceptFriendRequestHandler}
                            style={{
                                height: 30, fontSize: "0.8rem", color: TITLE_TEXT_COLOR, fontWeight: 500,
                                backgroundColor: SENDER_CHAT_BUBBLE_BACKGROUND
                            }}>
                        Accept
                    </Button>
                </Grid>
            </ListItem>
        )
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

    const addFriendBasedOnRequestStatus = (friends, friendComponentList, newlyJoined) => {
        if (friends.length === 0) {
            return
        }

        log.info(`addFriendBasedOnRequestStatus = ${JSON.stringify(friends)}`)
        friends.forEach(({request_status, channel_id, friend_user_name}) => {
            switch (request_status.charAt(0)) {
                case 'a':
                    if (sidebarState.tabValue === 0) {
                        friendComponentList.push(renderAcceptedFriend(channel_id, friend_user_name, newlyJoined))
                    }
                    break
                case 'n':
                    if (sidebarState.tabValue === 1) {
                        friendComponentList.push(renderNewFriendsRequest(channel_id, friend_user_name, newlyJoined))
                    }
                    break
                case 'p':
                    if (sidebarState.tabValue === 2) {
                        friendComponentList.push(renderPendingFriendRequest(channel_id, friend_user_name, newlyJoined))
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

        addFriendBasedOnRequestStatus(notificationReducer.acceptedRequests, friendComponentList, "new")
        addFriendBasedOnRequestStatus(notificationReducer.newRequests, friendComponentList)
        addFriendBasedOnRequestStatus(notificationReducer.pendingRequests, friendComponentList)

        if (!queriedUserProfileLoading && queriedUserProfile && queriedUserProfile.userProfile) {
            addFriendBasedOnRequestStatus(queriedUserProfile.userProfile.friends, friendComponentList)
        }

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
        switch (value) {
            case 1:
                if (notificationReducer.requestNotification
                    && notificationReducer.requestNotification.newRequests > 0) {
                    resetNotificationRequest("newRequests")
                }
                break
            case 2:
                if (notificationReducer.requestNotification
                    && notificationReducer.requestNotification.pendingRequests > 0) {
                    resetNotificationRequest("pendingRequests")
                }
                break
            default:
        }
        setSidebarState({...sidebarState, tabValue: value})
    }

    const handleLogout = () => {
        Cookies.remove(USER_AUTH_COOKIE)
        Cookies.remove(ACTIVE_FRIEND_COOKIE)
        dispatch({
            type: ACTIVE_USERNAME,
            payload: null
        })
        dispatch({
            type: FRIEND_SELECTED,
            payload: {
                channel_id: 0,
                friend_user_name: 'default'
            }
        })
        dispatch({
            type: REMOVE_NOTIFICATION
        })
        history.push("/login")
    }

    const resetNotificationRequest = (notification_name) => {
        log.info(`[resetNotificationRequest] activeUsername = ${activeUsername}, notification_name = ${notification_name}`)
        resetNotification({
            variables: {
                user_name: activeUsername,
                notification_name: notification_name
            }
        }).then(res => {
            log.info(`[resetNotificationRequest] res.data.resetNotification = ${JSON.stringify(res.data.resetNotification)}`)
            if (res.data.resetNotification) {
                log.info(`[resetNotificationRequest] dispatching REQUEST_NOTIFICATION...`)
                dispatch({
                    type: REQUEST_NOTIFICATION,
                    payload: res.data.resetNotification.request_notification
                })
            }
        }).catch(e => log.error(`[RESET_NOTIFICATION]: Unable to reset notification request to graphql server e = ${e}`))
    }

    const acceptFriendRequestHandler = (e) => {
        acceptFriendRequest({
            variables: {
                user_name: activeUsername,
                friend_user_name: e.currentTarget.value
            }
        }).then(res => {
            if (res.data.acceptFriendRequest) {
                const {friend, request_notification} = res.data.acceptFriendRequest
                log.info(`[SideBar] acceptFriendRequestHandler response = ${JSON.stringify(res.data.acceptFriendRequest)}`)
                dispatch({
                    type: ACCEPTED_REQUEST_NOTIFICATION,
                    payload: {
                        requestNotification: request_notification,
                        acceptedRequests: friend
                    }
                })
            }
        }).catch(e => log.error(`[SEND_FRIEND_REQUEST]: Unable to send friend request to graphql server e = ${e}`))
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
                            <SearchBar changeFindBtnState={changeFindBtnState}
                                       excludeSearchSuggestions={sidebarState.excludeSearchSuggestions}
                                       friendRequestAcceptHandler={friendRequestAcceptHandler}/>
                            {
                                sidebarState.findBtnState ? null :
                                    <Grid container justify="center">
                                        <IconTabs tabIconStateHandler={tabIconStateHandler}
                                                  sidebarTabValue={sidebarState.tabValue}
                                                  requestNotification={notificationReducer.requestNotification ?
                                                      notificationReducer.requestNotification : null}/>
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

                <Grid container style={{
                    position: "absolute", bottom: 5, height: `fit-content`,
                    backgroundColor: TOOLBAR_PANEL_COLOR, color: TITLE_TEXT_COLOR
                }}>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon><ExitToAppIcon fontSize="large" style={{color: TITLE_TEXT_COLOR}}/></ListItemIcon>
                        <ListItemText primary="Logout" classes={{primary: classes.titlePrimaryText}}/>
                    </ListItem>
                </Grid>
            </Drawer>
        </div>
    );
}
