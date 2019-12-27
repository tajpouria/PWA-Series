import * as React from "react";
import { render } from "react-dom";
import { Router } from "@reach/router";

import "./styles.css";
import * as serviceWorker from "./serviceWorker";

import { App } from "./components/App";
import { Help } from "./components/Help";

require("dotenv").config();

const rootElement = document.getElementById("root");
render(
  <Router>
    <App path="/" />
    <Help path="/help" />
  </Router>,
  rootElement
);

// serviceWorker.register();
