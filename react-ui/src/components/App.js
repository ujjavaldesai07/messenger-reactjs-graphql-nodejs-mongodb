import React from "react";
import history from "../history";
import {Router, Route, Switch} from 'react-router-dom';
import log from "loglevel"
import {LoginRoute} from "./routes/LoginRoute";
import ChatRoute from "./routes/ChatRoute";

const App = () => {
    log.info(`[App]: Rendering App Component`)

    return (
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={LoginRoute}/>
                <Route path="/chat" exact component={ChatRoute}/>
            </Switch>
        </Router>
    )
}

export default App;