import React from 'react';
import {Avatar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import log from "loglevel";

const useStyles = makeStyles((theme) => ({
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        fontSize: "1rem"
    },
    medium: {
        width: theme.spacing(6),
        height: theme.spacing(6),
        fontSize: "1.5rem"
    },
    large: {
        width: theme.spacing(9),
        height: theme.spacing(9),
        fontSize: "2rem"

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
            <Avatar className={getAvatarSize()} style={{backgroundColor: props.background,
                color: `${props.fontColor? props.fontColor: "black" }`}}>{
                props.name? props.name.slice(0, 2).toUpperCase() : 'NA'}</Avatar>
        </>
    )
}