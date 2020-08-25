import React from 'react';
import {Avatar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import log from "loglevel";

const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    medium: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    large: {
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
}));

export function UserAvatar(props) {
    const classes = useStyles();

    const getAvatarSize = () => {
        switch (props.size) {
            case "sm":
                return classes.small
            case "md":
                return classes.medium
            default:
                return classes.large;
        }
    }

    log.info(`[UserAvatar] Rendering UserAvatar Component....`)
    return (
        <>
            <Avatar className={getAvatarSize()}>{
                props.name? props.name.slice(0, 2).toUpperCase() : 'NA'}</Avatar>
        </>
    )
}