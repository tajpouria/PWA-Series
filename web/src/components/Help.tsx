import * as React from "react";
import { Link, RouteComponentProps } from "@reach/router";

export const Help = (_prop: RouteComponentProps) => (
  <div className="help">
    <nav className="nav nav--primary">
      <Link to="/" className="link">
        App
      </Link>
    </nav>
    <h1 className="help__heading u-center-text">How can help I u?</h1>
  </div>
);
