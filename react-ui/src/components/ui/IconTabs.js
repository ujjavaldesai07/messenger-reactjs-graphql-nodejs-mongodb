import React from 'react';
import {Paper, Badge} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ChatIcon from '@material-ui/icons/Chat';
import log from 'loglevel';
import {useStyles} from "../../styles/iconTabsStyles";
import {useDispatch, useSelector} from "react-redux";
import {REQUEST_NOTIFICATION} from "../../actions/types";
import {useMutation} from "@apollo/client";
import {RESET_NOTIFICATION} from "../../constants/graphql";

/**
 * Render Icon tab and send back the tab value to sidebar
 *
 * @param tabIconStateHandler
 * @param requestNotification
 * @param sidebarTabValue
 * @returns {JSX.Element}
 * @constructor
 */
export default function IconTabs({tabIconStateHandler, sidebarTabValue}) {
    const classes = useStyles();
    const [tabValue, setTabValue] = React.useState(sidebarTabValue);
    const requestNotification = useSelector(state => state.notificationReducer.requestNotification)
    const activeUsername = useSelector(state => state.activeUsernameReducer.user_name)
    const dispatch = useDispatch()

    // reset notification if we have seen it.
    const [resetNotification] = useMutation(RESET_NOTIFICATION)

    /**
     * Reset notification based on notification name
     * @param notification_name
     */
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

    /**
     * set tab value and reset notification which marks that
     * user have seen the notifications.
     * @param event
     * @param newValue
     */
    const handleTabChange = (event, newValue) => {
        log.info(`[IconTabs] newValue = ${newValue}`)

        if (requestNotification) {
            switch (newValue) {
                case 1:
                    if (requestNotification.newRequests > 0) {
                        resetNotificationRequest("newRequests")
                    }
                    break
                case 2:
                    if (requestNotification.pendingRequests > 0) {
                        resetNotificationRequest("pendingRequests")
                    }
                    break
                default:
            }
        }
        tabIconStateHandler(newValue)
        setTabValue(newValue);
    };

    const renderIconWithBadge = (icon, content) => {
        return (
            <Badge badgeContent={content} classes={{badge: classes.badge}}>
                {icon}
            </Badge>
        )
    }

    log.info(`[IconTabs] requestNotification= ${JSON.stringify(requestNotification)}`)

    return (
        <Paper square className={classes.root}>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="icon label tabs example"
                classes={{flexContainer: classes.tabsFlexContainer, indicator: classes.tabIndicator}}>
                <Tab icon={<ChatIcon/>} classes={{root: classes.tabRoot}}/>

                <Tab icon={renderIconWithBadge(<FavoriteIcon/>,
                    requestNotification ? requestNotification.newRequests : 0)}
                     classes={{root: classes.tabRoot}}/>

                <Tab icon={renderIconWithBadge(<PersonPinIcon/>,
                    requestNotification ? requestNotification.pendingRequests : 0)}
                     classes={{root: classes.tabRoot}}/>
            </Tabs>
        </Paper>
    );
}
