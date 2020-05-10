import React from "react";
import "./App.css";
import Stats from "./components/stats";
import Home from "./components/home";
import Details from "./components/details";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  NavLink,
} from "react-router-dom";
import NotFound from "./components/notfound";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <NavLink to="/home" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/details">Details</NavLink>
            </li>
            <li>
              <NavLink to="/stats">Stats</NavLink>
            </li>
            {/* <Link className="active" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link to="/details">Details</Link>
            </li>
            <li>
              <Link to="/stats">Stats</Link>
            </li> */}
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/details">
            <Details />
          </Route>
          <Route path="/stats">
            <Stats />
          </Route>
          <Route exact path={["/home"]}>
            <Home />
          </Route>

          <Redirect exact from="/" to="/home" />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
