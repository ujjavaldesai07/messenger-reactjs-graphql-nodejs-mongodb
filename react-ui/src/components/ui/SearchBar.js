import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ClearIcon from '@material-ui/icons/Clear';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import {UserAvatar} from "./UserAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {Button, Grid} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import {useMutation, useQuery} from "@apollo/client";
import {GET_FRIEND_SUGGESTIONS, SEND_FRIEND_REQUEST} from "../../constants/graphql";
import log from 'loglevel';
import {useDispatch, useSelector} from "react-redux";
import {PENDING_REQUEST_NOTIFICATION} from "../../actions/types";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    fab: {
        margin: theme.spacing(1),
    },
}));

export default function SearchBar(props) {
    const classes = useStyles();
    const [value, setValue] = useState('')
    const [findBtnState, setFindBtnState] = useState(false)
    const {data, loading} = useQuery(GET_FRIEND_SUGGESTIONS,
        {variables: {prefix: value}})
    const activeUsername = useSelector(state => state.activeUsernameReducer)
    const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST)
    const dispatch = useDispatch()

    const renderFriends = () => {
        let suggestionComponentList = []
        log.info(`[SearchBar] data = ${JSON.stringify(data)}`)
        if (!loading && data.friendSuggestions) {
            data.friendSuggestions.forEach(keyword => {
                log.info(`keyword = ${keyword}`)
                suggestionComponentList.push(
                    <ListItem key={keyword} id={keyword} style={{paddingRight: 0}}>
                        <ListItemIcon><UserAvatar size="md" name={keyword}/></ListItemIcon>
                        <ListItemText primary={keyword}/>
                        <Tooltip title="Send Request" arrow placement="right" id={keyword}
                                 onClick={handleFriendRequestBtn}>
                            <Fab color="primary" className={classes.fab} size="small">
                                <AddIcon fontSize="small"/>
                            </Fab>
                        </Tooltip>
                    </ListItem>
                )
            })
        }
        return suggestionComponentList
    }

    const renderSearchBarSection = () => {
        return (
            <>
                <form className={classes.root} noValidate autoComplete="off" style={{height: 50, width: "inherit"}}>
                    <TextField
                        style={{width: "fit-content"}}
                        id="standard-basic"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        InputProps={{
                            style: {height: 40, fontSize: "1.3rem"},
                            startAdornment:
                                <Tooltip title="Close" arrow placement="top">
                                    <ArrowBackIcon fontSize="small"
                                                   onClick={handleFindBtnClose}
                                                   style={{
                                                       marginRight: 5,
                                                       cursor: "pointer"
                                                   }}/>

                                </Tooltip>,
                            endAdornment: <ClearIcon fontSize="small" onClick={() => setValue('')}
                                                     style={{
                                                         display: `${value.length > 0 ? "block" : "none"}`,
                                                         cursor: "pointer"
                                                     }}/>
                        }}
                    />
                </form>

                <List style={{width: "inherit"}}>
                    {renderFriends()}
                </List>
            </>
        )
    }

    const renderFindButton = () => {
        return (
            <Grid container justify="center" style={{padding: "1em 0"}}>
                <Button variant="outlined" color="primary" onClick={handleFindBtnOpen}>
                    Find Friends Online
                </Button>
            </Grid>
        )
    }

    const handleFriendRequestBtn = (e) => {
        sendFriendRequest({
            variables: {
                user_name: activeUsername,
                friend_user_name: e.currentTarget.getAttribute("aria-describedby")
            }
        }).then(res => {
            if(res.data.sendFriendRequest) {
                const {friend, request_notification} = res.data.sendFriendRequest
                dispatch({
                    type: PENDING_REQUEST_NOTIFICATION,
                    payload: {
                        requestNotification: request_notification,
                        pendingRequests: friend
                    }
                })
            }
        }).catch(e => log.error(`[SEND_FRIEND_REQUEST]: Unable to send friend request to graphql server e = ${e}`))
    }

    const handleFindBtnOpen = () => {
        props.changeFindBtnState(true)
        setFindBtnState(true)
    }

    const handleFindBtnClose = () => {
        props.changeFindBtnState(false)
        setFindBtnState(false)
    }

    return (
        <>
            {findBtnState ? renderSearchBarSection() : renderFindButton()}
        </>
    );
}