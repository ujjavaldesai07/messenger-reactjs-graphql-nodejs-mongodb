import React from 'react';
import {Avatar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import log from "loglevel";
import {MessageBox} from "./MessageBox";

const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

export function UserAvatar(props) {
    const classes = useStyles();

    log.info(`[UserAvatar] Rendering UserAvatar Component....`)
    return (
        <>
            <Avatar className={props.size === "sm" ? classes.small: classes.large}>{
                props.initials? props.initials.toUpperCase() : 'U'}</Avatar>
        </>
    )
}