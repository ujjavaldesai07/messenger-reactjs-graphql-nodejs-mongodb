import React from 'react';
import {Paper, Badge} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ChatIcon from '@material-ui/icons/Chat';
import log from 'loglevel';
import {DRAWER_WIDTH, NOTIFICATION_COLOR, SIDEBAR_PANEL_COLOR, TITLE_TEXT_COLOR} from "../../constants/constants";

const useStyles = makeStyles({
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

export default function IconTabs({tabIconStateHandler, requestNotification, sidebarTabValue}) {
    const classes = useStyles();
    const [tabValue, setTabValue] = React.useState(sidebarTabValue);

    const handleChange = (event, newValue) => {
        log.info(`[IconTabs] newValue = ${newValue}`)
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
                onChange={handleChange}
                aria-label="icon label tabs example"
                classes={{flexContainer: classes.tabsFlexContainer, indicator: classes.tabIndicator}}>
                <Tab icon={<ChatIcon/>} classes={{root: classes.tabRoot}}/>

                <Tab icon={renderIconWithBadge(<FavoriteIcon />,
                    requestNotification ? requestNotification.newRequests: 0)}
                     classes={{root: classes.tabRoot}}/>

                <Tab icon={renderIconWithBadge(<PersonPinIcon />,
                    requestNotification? requestNotification.pendingRequests: 0)}
                     classes={{root: classes.tabRoot}}/>
            </Tabs>
        </Paper>
    );
}
