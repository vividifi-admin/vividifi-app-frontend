import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter} from "react-router-dom";
import App from "./App";
import { store } from "./store/index";
import { Provider } from "react-redux";
import { Waiter } from "react-wait";
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Waiter>
        <App />
      </Waiter>
    </Provider>
  </BrowserRouter>
  ,
  document.getElementById("root")
);
