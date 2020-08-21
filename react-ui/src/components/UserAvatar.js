import React from 'react';
import {Avatar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

export function UserAvatar() {
    const classes = useStyles();
    return (
        <>
            <Avatar className={classes.large}>U</Avatar>
        </>
    )
}