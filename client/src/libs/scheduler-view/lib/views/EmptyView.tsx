import React from "react";

const EmptyView = ({ text }) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "30px 0",
      }}
    >
      <h3 style={{ color: "white" }}>{text}</h3>
    </div>
  );
};

export default EmptyView;
