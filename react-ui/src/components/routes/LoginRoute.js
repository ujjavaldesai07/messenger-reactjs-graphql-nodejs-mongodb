import React, {useState} from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import log from "loglevel";
import {useDispatch} from "react-redux";
import {ACTIVE_USER_CREDENTIALS} from "../../actions/types";
import history from "../../history";
import Cookies from "js-cookie";
import {
    CARD_COLOR, SENDER_CHAT_BUBBLE_BACKGROUND,
    TITLE_TEXT_COLOR,
    USER_AUTH_COOKIE
} from "../../constants/constants";
import {useAuthTokenFromCookie} from "../../hooks/useAuthTokenFromCookie";
import {useMutation} from "@apollo/client";
import {ADD_USER_PROFILE} from "../../constants/graphql";
import Typography from "@material-ui/core/Typography";
import md5 from 'md5'
import LoadingBackdrop from "../ui/LoadingBackdrop";

export function LoginRoute() {
    const [loginState, setLoginState] = useState({
        user_name: '', password: '', error_msg: null, error: false})

    const dispatch = useDispatch()
    const [addUserProfile, {loading, error}] = useMutation(ADD_USER_PROFILE)

    // custom hook check whether user has previously logged in
    // and if yes then retrieved details from cookie.
    useAuthTokenFromCookie(null)

    const handleUsernameChange = (e) => {
        setLoginState({...loginState, user_name: e.target.value})
    }

    const handlePasswordChange = (e) => {
        setLoginState({...loginState, password: e.target.value})
    }

    const handleLoginButton = () => {
        log.info(`[LoginRoute] handleLoginButton clicked`)

        // convert password to md5 and send it to server
        let credentials = {
            user_name: loginState.user_name,
            password: md5(loginState.password)
        }

        // create new user profile or verify credentials if the user profile already present.
        addUserProfile({
            variables: credentials
        }).then(res => {
            if (res.data) {
                if (res.data.addUserProfile && !res.data.addUserProfile.failure) {
                    // on success
                    Cookies.set(USER_AUTH_COOKIE, credentials, {expires: 7})
                    dispatch({
                        type: ACTIVE_USER_CREDENTIALS,
                        payload: credentials
                    })

                    if (loginState.error_msg) {
                        setLoginState({...loginState, error: null})
                    }

                    history.push("/")
                } else {
                    // on failure
                    setLoginState({...loginState, error: res.data.addUserProfile.error_msg})
                }
            }
        }).catch(e => log.error(`[ADD USER_PROFILE]: Unable to add user profile to graphql server e = ${e}`))

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
                    required={true}
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

    log.info(`[LoginRoute] Rendering LoginRoute Component....error = ${error}`)

    return (
        <Grid id="Login" container justify="center"
              alignItems="center" style={{position: "relative", top: 200, height: 300}}>
            <Grid item xs={3} container direction="column" spacing={3} justify="center"
                  style={{backgroundColor: CARD_COLOR}}>
                <Grid item container justify="center">
                    <Typography variant="h6" style={{color: TITLE_TEXT_COLOR, fontSize: "1.5rem"}}>
                        Welcome To Messenger
                    </Typography>
                </Grid>
                {renderTextField("Username", handleUsernameChange, loginState.user_name, "text")}
                {renderTextField("Password", handlePasswordChange, loginState.password, "password")}

                {loginState.error_msg ? <Grid item style={{color: "red"}}>
                    {`Error: ${loginState.error_msg}`}
                </Grid> : null}

                <Grid item style={{paddingBottom: 30}}>
                    <Button variant={"contained"} disabled={!loginState.user_name.length || !loginState.password.length}
                            fullWidth style={{
                        height: 50,
                        backgroundColor: SENDER_CHAT_BUBBLE_BACKGROUND, color: TITLE_TEXT_COLOR
                    }}
                            onClick={handleLoginButton}>
                        Login / SignUp
                    </Button>
                </Grid>
                <LoadingBackdrop loading={loading}/>
            </Grid>
        </Grid>
    )
}

