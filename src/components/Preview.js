import React, { Fragment } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import CodeView from "./forms/CodeView";
import BoilerplateGenerator from "./forms/BoilerplateGenerator";

export default function Preview({
  state,
  showCode,
  setShowCode,
  showGenerator,
  setShowGenerator,
}) {
  return (
    <Fragment>
      <SwaggerUI spec={state} />
      <CodeView state={state} showCode={showCode} setShowCode={setShowCode} />
      <BoilerplateGenerator
        state={state}
        showGenerator={showGenerator}
        setShowGenerator={setShowGenerator}
      />
    </Fragment>
  );
}
