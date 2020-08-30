import React, {useState} from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import log from "loglevel";
import {useDispatch} from "react-redux";
import {ACTIVE_USERNAME} from "../../actions/types";
import history from "../../history";
import Cookies from "js-cookie";
import {
    CARD_COLOR, SENDER_CHAT_BUBBLE_BACKGROUND,
    SIDEBAR_PANEL_COLOR,
    TITLE_TEXT_COLOR,
    TOOLBAR_PANEL_COLOR,
    USER_AUTH_COOKIE
} from "../../constants/constants";
import {useAuthTokenFromCookie} from "../../hooks/userAuthTokenFromCookie";
import {useMutation} from "@apollo/client";
import {ADD_USER_PROFILE} from "../../constants/graphql";
import Typography from "@material-ui/core/Typography";

export function LoginRoute() {
    const [loginState, setLoginState] = useState({user_name: '', password: ''})
    const dispatch = useDispatch()
    const [addUserProfile] = useMutation(ADD_USER_PROFILE)

    useAuthTokenFromCookie(null)

    const handleUsernameChange = (e) => {
        setLoginState({...loginState, user_name: e.target.value})
    }

    const handlePasswordChange = (e) => {
        setLoginState({...loginState, password: e.target.value})
    }

    const handleLoginButton = () => {
        log.info(`[LoginRoute] handleLoginButton clicked`)
        Cookies.set(USER_AUTH_COOKIE, loginState, {expires: 7})

        addUserProfile({
            variables: {user_name: loginState}
        }).catch(e => log.error(`[ADD USER_PROFILE]: Unable to add user profile to graphql server e = ${e}`))

        dispatch({
            type: ACTIVE_USERNAME,
            payload: loginState
        })

        history.push("/")
    }

    const renderTextField = (label, handler, textValue, fieldType) => {
        return (
            <Grid item style={{backgroundColor: CARD_COLOR}}>
                <TextField
                    value={textValue}
                    onChange={handler}
                    variant="outlined"
                    placeholder={label}
                    label={label}
                    fullWidth
                    type={fieldType}
                    InputLabelProps={{
                        style: {color: TITLE_TEXT_COLOR}
                    }}
                    InputProps={{
                        style: {color: TITLE_TEXT_COLOR}
                    }}
                />
            </Grid>
        )
    }

    log.info(`[LoginRoute] Rendering LoginRoute Component....`)

    return (
        <Grid id="Login" container justify="center"
              alignItems="center" style={{position: "relative", top: 200, height: 300}}>
            <Grid item xs={3} container direction="column" spacing={3} justify="center" style={{backgroundColor: CARD_COLOR}}>
                <Grid item container justify="center">
                    <Typography variant="h6" style={{color: TITLE_TEXT_COLOR, fontSize: "1.5rem"}}>
                        Welcome To Messenger
                    </Typography>
                </Grid>
                {renderTextField("Username", handleUsernameChange, loginState.user_name, "text")}
                {renderTextField("Password", handlePasswordChange, loginState.password, "password")}

                <Grid item style={{ paddingBottom: 30}}>
                    <Button variant={"contained"}
                            fullWidth style={{height: 50,
                        backgroundColor: SENDER_CHAT_BUBBLE_BACKGROUND, color: TITLE_TEXT_COLOR}}
                            onClick={handleLoginButton}>
                        Login / SignUp
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

