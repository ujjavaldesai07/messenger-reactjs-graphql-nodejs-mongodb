import React from 'react';
import {Avatar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

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
    return (
        <>
            <Avatar className={props.size === "sm" ? classes.small: classes.large}>U</Avatar>
        </>
    )
}