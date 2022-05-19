import React , {Suspense} from "react";
import { useLocation, Route, Switch, useHistory } from "react-router-dom";
import _ from "lodash";
import routes from "../../routes";
import Index from "../../pages/Index";
import Login from "../../pages/Login";
import SignUpPage from "../../pages/SignUp";
const Auth = () => {
  const location = useLocation();
  let history = useHistory();
  const handleCheckUser = () => {
    let token = localStorage.getItem("token");
    if (token) {
      return true;
    }
    history.push("/");
    return false;
  };
  const getRoutes = (routes) => {
    return routes.map((index, key) => {
      return (
        <Route
          exact
          path={index.url}
          render={() => <index.component />}
          key={key}
        />
      );
    });
  };
  return (
    <>
      {location.pathname == "/" ? (
        <Switch>
          <Route path="/" component={Index} />
        </Switch>
      ) : location.pathname == "/login" || location.pathname == "/signUp" ? (
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signUp" component={SignUpPage} />
        </Switch>
      ) : (
        <>{handleCheckUser() ? 
        <Suspense fallback={<div>Loading ...</div>}>
          <Switch>{getRoutes(routes)}</Switch>
        </Suspense>

        : null}</>
      )}
    </>
  );
};
export default Auth;
