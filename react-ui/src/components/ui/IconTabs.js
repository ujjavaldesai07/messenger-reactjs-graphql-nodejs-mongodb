import React from 'react';
import {Paper, Badge} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ChatIcon from '@material-ui/icons/Chat';
import log from 'loglevel';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        width: "inherit"
    },
    tabsFlexContainer: {
        width: "inherit"
    },
    tabRoot: {
        minWidth: 83
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
            <Badge badgeContent={content} color="secondary">
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
                indicatorColor="secondary"
                textColor="secondary"
                aria-label="icon label tabs example"
                classes={{flexContainer: classes.tabsFlexContainer}}>
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
