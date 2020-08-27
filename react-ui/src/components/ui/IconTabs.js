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

export default function IconTabs({tabIconStateHandler, notifications}) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        log.info(`[IconTabs] newValue = ${newValue}`)
        tabIconStateHandler(newValue)
        setValue(newValue);
    };

    const renderIconWithBadge = (icon, content) => {
        return (
            <Badge badgeContent={content} color="secondary">
                {icon}
            </Badge>
        )
    }

    return (
        <Paper square className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="secondary"
                textColor="secondary"
                aria-label="icon label tabs example"
                classes={{flexContainer: classes.tabsFlexContainer}}>
                <Tab icon={<ChatIcon/>} classes={{root: classes.tabRoot}}/>

                <Tab icon={renderIconWithBadge(<FavoriteIcon />, notifications.newRequests)}
                     classes={{root: classes.tabRoot}}/>

                <Tab icon={renderIconWithBadge(<PersonPinIcon />, notifications.pendingRequests)}
                     classes={{root: classes.tabRoot}}/>
            </Tabs>
        </Paper>
    );
}
