import React from 'react';
import {Paper, Badge} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ChatIcon from '@material-ui/icons/Chat';
import log from 'loglevel';
import {useStyles} from "../../styles/iconTabsStyles";

/**
 * Render Icon tab and send back the tab value to sidebar
 *
 * @param tabIconStateHandler
 * @param requestNotification
 * @param sidebarTabValue
 * @returns {JSX.Element}
 * @constructor
 */
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
