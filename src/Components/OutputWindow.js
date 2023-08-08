import React from "react";
import "./Output.scss";

const OutputWindow = ({ outputDetails }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="compilation_error">
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="accepted">
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="time_limit_exceeded">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className="error">
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };
  return (
    <>
      {/* <h1 className="output_container">
        Output
      </h1> */}
      <div className="output_content">
      <h1 className="output_container">
        Output
      </h1>
        {outputDetails ? <>{getOutput()}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;