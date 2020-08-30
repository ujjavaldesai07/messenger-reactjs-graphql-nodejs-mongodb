import React from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import log from "loglevel";
import {makeStyles} from "@material-ui/core/styles";
import {
    MESSAGE_SECTION_COLOR,
    TITLE_TEXT_COLOR,
    TOOLBAR_PANEL_COLOR
} from "../../constants/constants";

const useStyles = makeStyles(() => ({
    input: {
        height: 42,
        backgroundColor: "#f7f7f7",
        borderRadius: 20,
    }
}));

export function MessageBox(props) {
    const classes = useStyles();
    const [activeMessage, setActiveMessageState] = React.useState('');

    const handleMessageChange = (event) => {
        setActiveMessageState(event.target.value);
    };

    const handleSendButton = () => {
        // if blank then return
        if (activeMessage.length === 0) {
            return
        }
        props.onMessageSend(activeMessage)
        setActiveMessageState('');
    }

    log.info(`[MessageBox] Rendering MessageBox Component....`)
    return (
        <Grid container justify="center" alignItems="center" style={{
            position: "fixed", bottom: 0, paddingLeft: props.sidebarPadding,
            backgroundColor: MESSAGE_SECTION_COLOR, height: 60
        }}>
            <Grid item xs={8} style={{height: 40}}>
                <TextField
                    classes={{root: classes.root}}
                    value={activeMessage}
                    onChange={handleMessageChange}
                    variant="outlined"
                    placeholder="Type a message"
                    style={{width: "98%"}}
                    InputProps={{
                        style:{backgroundColor: TOOLBAR_PANEL_COLOR, color: TITLE_TEXT_COLOR},
                        className: classes.input,
                    }}
                    onKeyUp={event => {
                        if (event.keyCode === 13) {
                            handleSendButton();
                        }
                    }}
                />
            </Grid>
            <Grid item>
                <Button variant={"contained"}
                        fullWidth style={{height: 40, width: 100, backgroundColor: TITLE_TEXT_COLOR}}
                        onClick={handleSendButton}
                >
                    Send
                </Button>
            </Grid>
        </Grid>
    )
}