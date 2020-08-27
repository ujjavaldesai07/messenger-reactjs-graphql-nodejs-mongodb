import React, {useEffect, useState} from 'react';
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
import {ACTIVE_FRIEND_COOKIE, TOP_BOTTOM_POSITION, USER_AUTH_COOKIE} from "../../constants/constants";
import {Badge, Button, Grid} from "@material-ui/core";
import {UserAvatar} from "../ui/UserAvatar";
import log from "loglevel";
import {useDispatch, useSelector} from "react-redux";
import {
    ACCEPTED_REQUEST_NOTIFICATION, ACTIVE_USERNAME,
    FRIEND_SELECTED, NEW_REQUEST_NOTIFICATION,
    SIDEBAR_DRAWER_CLOSED,
    SIDEBAR_DRAWER_OPEN
} from "../../actions/types";
import Cookies from "js-cookie";
import SearchBar from "../ui/SearchBar";
import {useMutation, useQuery, useSubscription} from "@apollo/client";
import {ACCEPT_FRIEND_REQUEST, GET_MY_FRIENDS, GET_NOTIFICATION, SEND_FRIEND_REQUEST} from "../../constants/graphql";
import {useStyles} from "../../styles/sidebarStyles"
import IconTabs from "../ui/IconTabs";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import backgroundImage from "../../images/background.jpg";

export const SideBar = () => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch()
    const sidebarDrawerStatus = useSelector(state => state.sidebarDrawerReducer)
    const [findBtnState, setFindBtnState] = useState(false)
    const [tabIconState, setTabIconState] = useState(0)
    const activeUsername = useSelector(state => state.activeUsernameReducer)
    const notificationReducer = useSelector(state => state.notificationReducer)
    const selectedFriend = useSelector(state => state.friendSelectionReducer)
    const {data: friendsData, loading: friendsLoading} = useQuery(GET_MY_FRIENDS,
        {variables: {user_name: activeUsername}})
    const {data: notificationData, loading: notificationLoading} = useSubscription(GET_NOTIFICATION, {
        variables: {user_name: activeUsername}
    })
    const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST)
    const _friendNotifications = {newRequests: 0, pendingRequests: 0, acceptedRequests: 0}

    log.info(`[SideBar] 1-notificationData = ${JSON.stringify(notificationData)}`)
    useEffect(() => {
        log.info(`[SideBar] 2-notificationData = ${JSON.stringify(notificationData)}, notificationLoading = ${notificationLoading}`)
        if (!notificationLoading && notificationData && notificationData.notifications) {
            let notification = notificationData.notifications

            if (notification.request_status.charAt(0) === 'n') {
                dispatch({
                    type: NEW_REQUEST_NOTIFICATION,
                    payload: {newRequests: notification}
                })
            } else if (notification.request_status.charAt(0) === 'a') {
                dispatch({
                    type: ACCEPTED_REQUEST_NOTIFICATION,
                    payload: {acceptedRequests: notification}
                })
            }
        }

    }, notificationData)

    const handleDrawerOpen = () => {
        dispatch({
            type: SIDEBAR_DRAWER_OPEN
        })
    };

    const handleDrawerClose = () => {
        dispatch({
            type: SIDEBAR_DRAWER_CLOSED
        })
        setFindBtnState(false)
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
                      selected={selectedFriend.friend_user_name === friend_user_name}>
                {newlyJoined ?
                    <Badge badgeContent="New" color="secondary"
                           anchorOrigin={{vertical: 'top', horizontal: 'left'}}>
                        <ListItemIcon><UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
                    </Badge>
                    : <ListItemIcon><UserAvatar size="md" name={friend_user_name}/></ListItemIcon>}
                <ListItemText primary={friend_user_name}/>
            </ListItem>
        )
    }

    const renderPendingFriendRequest = (channel_id, friend_user_name) => {
        return (
            <ListItem key={channel_id} id={channel_id} value={friend_user_name}>
                <ListItemIcon><UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
                <ListItemText primary={friend_user_name}/>
                <Button variant="outlined" disabled color="primary" size="small"
                        style={{width: 50, height: 30, fontSize: "0.75rem"}}>
                    Pending
                </Button>
            </ListItem>
        )
    }

    const renderNewFriendsRequest = (channel_id, friend_user_name) => {
        return (
            <ListItem key={channel_id} id={channel_id} value={friend_user_name}>
                <ListItemIcon><UserAvatar size="md" name={friend_user_name}/></ListItemIcon>
                <ListItemText primary={friend_user_name}/>
                <Button variant="contained" color="primary" size="small" value={friend_user_name}
                        onClick={acceptFriendRequestHandler}
                        style={{width: 50, height: 30, fontSize: "0.75rem"}}>
                    Accept
                </Button>
            </ListItem>
        )
    }

    const renderEmptyRequestComponent = (title) => {
        return (
            <Grid key={title} container justify="center" style={{fontSize: "1rem", paddingTop: 20, fontWeight: 400}}>
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
                    if (tabIconState === 0) {
                        friendComponentList.push(renderAcceptedFriend(channel_id, friend_user_name, newlyJoined))
                    }
                    break
                case 'n':
                    if (tabIconState === 1) {
                        friendComponentList.push(renderNewFriendsRequest(channel_id, friend_user_name, newlyJoined))
                    }
                    ++_friendNotifications.newRequests
                    break
                case 'p':
                    if (tabIconState === 2) {
                        friendComponentList.push(renderPendingFriendRequest(channel_id, friend_user_name, newlyJoined))
                    }
                    ++_friendNotifications.pendingRequests
                    break
                default:
                    throw new Error(`[SideBar] request_status option ${request_status} not supported.`)
            }
        })
    }

    const renderFriendsBasedOnTabSelection = () => {
        log.info(`[SideBar] renderFriends friends = ${JSON.stringify(friendsData)}, loading = ${friendsLoading}`)

        let friendComponentList = []

        addFriendBasedOnRequestStatus(notificationReducer.acceptedRequests, friendComponentList, "new")
        addFriendBasedOnRequestStatus(notificationReducer.newRequests, friendComponentList)
        addFriendBasedOnRequestStatus(notificationReducer.pendingRequests, friendComponentList)

        if (!friendsLoading && friendsData && friendsData.friends) {
            addFriendBasedOnRequestStatus(friendsData.friends, friendComponentList)
        }

        if (friendComponentList.length === 0) {
            if (tabIconState === 0 && sidebarDrawerStatus) {
                friendComponentList.push(renderEmptyRequestComponent('No Friends'))
            } else if (tabIconState === 1 && _friendNotifications.newRequests === 0) {
                friendComponentList.push(renderEmptyRequestComponent('No New Requests'))
            } else if (tabIconState === 2 && _friendNotifications.pendingRequests === 0) {
                friendComponentList.push(renderEmptyRequestComponent('No Pending Requests'))
            }
        }
        return friendComponentList
    }

    const renderTitle = (title) => {
        return (
            <Typography variant="h6" noWrap style={{paddingLeft: 30}}>
                {title}
            </Typography>
        )
    }

    const changeFindBtnState = (value) => {
        setFindBtnState(value)
    }

    const tabIconStateHandler = (value) => {
        setTabIconState(value)
    }

    const handleLogout = () => {
        Cookies.remove(USER_AUTH_COOKIE)
        Cookies.remove(FRIEND_SELECTED)
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
    }

    const acceptFriendRequestHandler = (e) => {
        acceptFriendRequest({
            variables: {
                user_name: activeUsername,
                friend_user_name: e.currentTarget.value
            }
        }).then(res => {
            if (res) {
                log.info(`[ACCEPT_FRIEND_REQUEST]: response = ${JSON.stringify(res.data.acceptFriendRequest)}`)
                const {friend_user_name, channel_id, request_status} = res.data.acceptFriendRequest
                dispatch({
                    type: ACCEPTED_REQUEST_NOTIFICATION,
                    payload: {
                        acceptedRequests: {
                            friend_user_name, channel_id, request_status
                        }
                    }
                })
            }
        }).catch(e => log.error(`[SEND_FRIEND_REQUEST]: Unable to send friend request to graphql server e = ${e}`))
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
                <Grid container style={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: "white"}}>
                    <Grid container alignItems="center">
                        <Grid item xs={10}>
                            {renderTitle(findBtnState ? "Find Friends" : "My Friends")}
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

                    {sidebarDrawerStatus ?
                        <>
                            <SearchBar changeFindBtnState={changeFindBtnState}/>
                            {
                                findBtnState ? null :
                                    <Grid container justify="center">
                                        <IconTabs tabIconStateHandler={tabIconStateHandler}
                                                  notifications={_friendNotifications}/>
                                    </Grid>
                            }
                        </>
                        : null}
                </Grid>

                <Grid container style={{overflow: "auto", position: "relative", bottom: 60, paddingTop: 60}}>
                    {findBtnState ? null : <List
                        style={{padding: 0, width: "-webkit-fill-available"}}>
                        {renderFriendsBasedOnTabSelection()}
                    </List>}
                </Grid>

                <Grid container style={{position: "absolute", bottom: 5, height: `fit-content`}}>
                    <ListItem button onClick={handleLogout}>
                        <ListItemIcon><ExitToAppIcon fontSize="large"/></ListItemIcon>
                        <ListItemText primary="Logout"/>
                    </ListItem>
                </Grid>
            </Drawer>
        </div>
    );
}
