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
import {EXCLUDE_SEARCH_SUGGESTIONS, PENDING_REQUEST_NOTIFICATION} from "../../actions/types";
import {useSidebarStyles} from "../../styles/sidebarStyles";
import {
    REQUESTED_TEXT,
    SENDER_CHAT_BUBBLE_BACKGROUND,
    SIDEBAR_PANEL_COLOR,
    TITLE_TEXT_COLOR
} from "../../constants/constants";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    fab: {
        margin: theme.spacing(1),
    }
}));

export default function SearchBar(props) {
    const classes = useStyles();
    const sidebarClasses = useSidebarStyles()
    const excludeSearchSuggestions = useSelector(state => state.excludeSearchSuggestionsReducer)

    const [searchBarState, setSearchBarState] = useState({fieldValue: '', findBtnStatus: false})

    // trigger query on input change
    const {data, loading} = useQuery(GET_FRIEND_SUGGESTIONS,
        {variables: {prefix: searchBarState.fieldValue}})
    const {user_name: activeUsername} = useSelector(state => state.activeUsernameReducer)
    const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST)
    const dispatch = useDispatch()

    /**
     * get suggestions from server and excluse friend request option
     * from the existing friends and requested friends
     * @returns {[]}
     */
    const renderFriends = () => {
        let suggestionComponentList = []
        log.info(`[SearchBar] data = ${JSON.stringify(data)}`)

        // if we got the data from server
        if (!loading && data.friendSuggestions) {
            data.friendSuggestions.forEach(keyword => {

                suggestionComponentList.push(
                    <ListItem key={keyword} id={keyword}>
                        <ListItemIcon><UserAvatar size="md" name={keyword}/></ListItemIcon>
                        <ListItemText primary={keyword} classes={{primary: sidebarClasses.primaryText}}/>

                        {excludeSearchSuggestions.has(keyword) ?
                            <Grid item container xs={3}>
                                <Button variant="outlined" disabled color="primary" size="small" fullWidth
                                        style={{
                                            height: 30, fontSize: "0.7rem", color: TITLE_TEXT_COLOR,
                                            borderColor: TITLE_TEXT_COLOR
                                        }}>
                                    {excludeSearchSuggestions.get(keyword)}
                                </Button>
                            </Grid> :
                            <Tooltip title="Send Request" arrow placement="right" id={keyword}
                                     onClick={handleFriendRequestBtn}>
                                <Fab className={classes.fab} size="small"
                                     style={{backgroundColor: SENDER_CHAT_BUBBLE_BACKGROUND}}>
                                    <AddIcon fontSize="small" style={{color: TITLE_TEXT_COLOR}}/>
                                </Fab>
                            </Tooltip>
                        }

                    </ListItem>
                )
            })
        }
        return suggestionComponentList
    }

    /**
     * Show the friend list based on keyword.
     *
     * @returns {JSX.Element}
     */
    const renderSearchBarSection = () => {
        return (
            <>
                <form className={classes.root} noValidate autoComplete="off" style={{height: 50, width: "inherit"}}>
                    <TextField
                        style={{width: "inherit", paddingRight: 20}}
                        id="standard-basic"
                        placeholder="Search Friends Online"
                        value={searchBarState.fieldValue}
                        onChange={
                            (e) => setSearchBarState({...searchBarState, fieldValue: e.target.value})}
                        InputProps={{
                            style: {height: 40, fontSize: "1.3rem", color: TITLE_TEXT_COLOR},
                            startAdornment:
                                <Tooltip title="Close" arrow placement="top">
                                    <ArrowBackIcon fontSize="small"
                                                   onClick={handleFindBtnClose}
                                                   style={{
                                                       marginRight: 5,
                                                       cursor: "pointer"
                                                   }}/>

                                </Tooltip>,
                            endAdornment: <ClearIcon fontSize="small" onClick={
                                () => setSearchBarState({...searchBarState, fieldValue: ''})}
                                                     style={{
                                                         display: `${searchBarState.fieldValue.length > 0 ? "block" : "none"}`,
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
            <Grid container justify="center" style={{padding: "1em 0", backgroundColor: SIDEBAR_PANEL_COLOR}}>
                <Button variant="outlined" onClick={handleFindBtnOpen}
                        style={{color: "black", backgroundColor: TITLE_TEXT_COLOR}}>
                    Find Friends Online
                </Button>
            </Grid>
        )
    }

    /**
     * send friend request.
     * @param e
     */
    const handleFriendRequestBtn = (e) => {
        let friendUserName = e.currentTarget.getAttribute("aria-describedby")
        log.info(`friendUserName = ${friendUserName}`)
        sendFriendRequest({
            variables: {
                user_name: activeUsername,
                friend_user_name: friendUserName
            }
        }).then(res => {
            if (res.data.sendFriendRequest) {
                const {friend, request_notification} = res.data.sendFriendRequest
                dispatch({
                    type: PENDING_REQUEST_NOTIFICATION,
                    payload: {
                        requestNotification: request_notification,
                        pendingRequests: friend
                    }
                })

                // On send request change the suggestion list, so that user
                // dont send the request again.
                dispatch({
                    type: EXCLUDE_SEARCH_SUGGESTIONS,
                    payload: new Map([[friendUserName, REQUESTED_TEXT]])
                })
            }
        }).catch(e => log.error(`[SEND_FRIEND_REQUEST]: Unable to send friend request to graphql server e = ${e}`))
    }

    const handleFindBtnOpen = () => {
        props.changeFindBtnState(true)
        setSearchBarState({...searchBarState, findBtnStatus: true})
    }

    const handleFindBtnClose = () => {
        props.changeFindBtnState(false)
        setSearchBarState({...searchBarState, findBtnStatus: false, fieldValue: ''})
    }

    return (
        <>
            {searchBarState.findBtnStatus ? renderSearchBarSection() : renderFindButton()}
        </>
    );
}