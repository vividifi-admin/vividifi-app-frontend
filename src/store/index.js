import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { getSeries } from "./actions/series";
import { reducers } from "./reducers/index";

export const store = createStore(reducers, compose(applyMiddleware(thunk),
// window.__REDUX_DEVTOOLS_EXTENSION__ &&
// window.__REDUX_DEVTOOLS_EXTENSION__()
));
if (window.location.pathname === "/" || window.location.pathname === "/login") {
} else {
  store.dispatch(getSeries());
}
