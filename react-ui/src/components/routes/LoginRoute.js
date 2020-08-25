import React, {useState} from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import log from "loglevel";
import {useDispatch} from "react-redux";
import {ACTIVE_USERNAME} from "../../actions/types";
import history from "../../history";
import Cookies from "js-cookie";
import {USER_AUTH_COOKIE} from "../../constants/constants";
import {useAuthTokenFromCookie} from "../../hooks/userAuthTokenFromCookie";
import {useMutation} from "@apollo/client";
import {ADD_USER_PROFILE} from "../../constants/graphql";

export function LoginRoute() {
    const [value, setValue] = useState('')
    const dispatch = useDispatch()
    const [addUserProfile] = useMutation(ADD_USER_PROFILE)

    useAuthTokenFromCookie(null)

    const handleUsernameChange = (e) => {
        setValue(e.target.value)
    }

    const handleLoginButton = () => {
        log.info(`[LoginRoute] handleLoginButton clicked`)
        Cookies.set(USER_AUTH_COOKIE, value, {expires: 7})

        addUserProfile({
            variables: {user_name: value}
        }).catch(e => log.error(`[ADD USER_PROFILE]: Unable to add user profile to graphql server e = ${e}`))

        dispatch({
            type: ACTIVE_USERNAME,
            payload: value
        })

        history.push("/chat")
    }

    log.info(`[LoginRoute] Rendering LoginRoute Component....`)

    return (
        <Grid id="Login" container justify="center" alignItems="center" style={{position: "relative", top: 200}}>
            <Grid item xs={2} container justify="center">
                <TextField
                    value={value}
                    onChange={handleUsernameChange}
                    variant="outlined"
                    placeholder="Username"
                    style={{width: "100%"}}
                />
            </Grid>
            <Grid item style={{marginLeft: 10}}>
                <Button variant={"contained"} color="primary"
                        fullWidth style={{height: 40}}
                        onClick={handleLoginButton}
                >
                    Login
                </Button>
            </Grid>
        </Grid>
    )
}

