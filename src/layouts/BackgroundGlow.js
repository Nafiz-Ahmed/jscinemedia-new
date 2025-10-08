import React from "react";

function BackgroundGlow(props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        background: "var(--background-glow-center)",
        zIndex: 1,
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: "1200px",
        maxHeight: "1200px",
        minWidth: "500px",
        ...props,
      }}
    ></div>
  );
}

export default BackgroundGlow;
