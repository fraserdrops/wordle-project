import React from "react";

const HeaderBar = (props) => {
  return (
    <div
      style={{
        height: "var(--header-bar-height)",
        borderBottom: "1px solid #d3d6da",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        color: "#eee",
      }}
    >
      <div>{/* <p>How to Play</p> */}</div>
      <h2>Pianle</h2>
      <div style={{ display: "flex" }}>
        {/* <p>Stats</p> */}
        {/* <p>Settings</p> */}
      </div>
    </div>
  );
};

export default HeaderBar;
