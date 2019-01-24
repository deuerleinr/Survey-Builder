import React from "react";
import { Route, withRouter } from "react-router-dom";
import SurveysHome from "./SurveysHome";

function Surveys(props) {
  const prefix = props.match.path;

  return (
    <React.Fragment>
      <Route exact path={prefix} component={SurveysHome} />
    </React.Fragment>
  );
}
