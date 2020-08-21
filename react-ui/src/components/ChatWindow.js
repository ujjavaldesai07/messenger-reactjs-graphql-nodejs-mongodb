import React from 'react';
import {gql, useQuery} from '@apollo/client';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {SendMessage} from "./SendMessage";
import {ReceiveMessage} from "./ReceiveMessage";
import {Grid, TextField, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import backgroundImage from '../images/background.jpg'
import SideBar from "./Sidebar";

const useStyles = makeStyles((theme) => ({
    input: {
        height: 42,
        backgroundColor: "#f7f7f7",
        borderRadius: 20,
    },
}));


const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
});


const GET_MESSAGES = gql`
query {
  messages{
    id,
    content,
    user
  }
}
`

const Messages = ({user}) => {
    const {data} = useQuery(GET_MESSAGES)

    if (!data) {
        return null
    }
    return JSON.stringify(data)
}

export function ChatWindow() {
    const classes = useStyles();
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <Grid container item xs={10}>
            <Grid container alignItems="center" style={{height: 60, backgroundColor: "#dddbd1"}}>
                Chatting With Ujjaval
            </Grid>
            <Grid container
                  style={{
                      padding: "2em 1em", position: "fixed",
                      background: `linear-gradient( rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6) ), url(${backgroundImage})`,
                      top: 60,
                      bottom: 60,
                      overflowY: "auto"
                  }}>
                <Grid container style={{paddingBottom: 10}}>
                    <ReceiveMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <SendMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <ReceiveMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <SendMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <ReceiveMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <SendMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <ReceiveMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <SendMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <ReceiveMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <SendMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <ReceiveMessage/>
                </Grid>
                <Grid container style={{paddingBottom: 10}}>
                    <SendMessage/>
                </Grid>
            </Grid>
            <Grid container justify="center" alignItems="center" style={{
                position: "absolute", bottom: 0,
                backgroundColor: "#dddbd1", height: 60
            }}>
                <Grid item xs={10} style={{height: 40}}>
                    <TextField
                        classes={{root: classes.root}}
                        id="outlined-multiline-flexible"
                        value={value}
                        onChange={handleChange}
                        variant="outlined"
                        placeholder="Type a message"
                        style={{width: "98%"}}
                        InputProps={{
                            className: classes.input,
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Button variant={"contained"} color="secondary" fullWidth style={{height: 40}}>
                        Send
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}