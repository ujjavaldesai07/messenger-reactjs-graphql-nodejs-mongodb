import React from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import log from "loglevel";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    input: {
        height: 42,
        backgroundColor: "#f7f7f7",
        borderRadius: 20,
    }
}));

export function MessageBox(props) {
    const classes = useStyles();
    const [activeMessageState, setActiveMessageState] = React.useState({name: 'Jack', content: ''});

    const handleContentChange = (event) => {
        setActiveMessageState({...activeMessageState, content: event.target.value});
    };

    const handleUsernameChange = (event) => {
        setActiveMessageState({...activeMessageState, name: event.target.value});
    };

    const handleSendButton = () => {
        // if blank then return
        if (activeMessageState.content.length === 0) {
            return
        }
        props.onMessageSend(activeMessageState)
        setActiveMessageState({...activeMessageState, content: ''});
    }

    log.info(`[MessageBox] Rendering MessageBox Component....`)
    return (
        <Grid container justify="center" alignItems="center" style={{
            position: "fixed", bottom: 0, paddingLeft: props.sidebarPadding,
            backgroundColor: "#dddbd1", height: 60
        }}>
            <Grid item xs={2} style={{height: 40}}>
                <TextField
                    classes={{root: classes.root}}
                    value={activeMessageState.name}
                    onChange={handleUsernameChange}
                    variant="outlined"
                    placeholder="Username"
                    style={{width: "98%"}}
                    InputProps={{
                        className: classes.input,
                    }}
                />
            </Grid>
            <Grid item xs={8} style={{height: 40}}>
                <TextField
                    classes={{root: classes.root}}
                    value={activeMessageState.content}
                    onChange={handleContentChange}
                    variant="outlined"
                    placeholder="Type a message"
                    style={{width: "98%"}}
                    InputProps={{
                        className: classes.input,
                    }}
                    onKeyUp={event => {
                        if(event.keyCode === 13) {
                            handleSendButton();
                        }
                    }}
                />
            </Grid>
            <Grid item xs={1}>
                <Button variant={"contained"} color="primary"
                        fullWidth style={{height: 40}}
                        onClick={handleSendButton}
                >
                    Send
                </Button>
            </Grid>
        </Grid>
    )
}