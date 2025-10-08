import React from "react";

function GradientText({
  children,
  colors = ["var(--white)", "var(--accent-color)"], // gradient colors (left → right)
  style = {}, // additional styles
}) {
  const gradient = `linear-gradient(to right, ${colors.join(", ")})`;

  return (
    <span
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "var(--title-text)",
        fontWeight: "400",
        display: "inline-block",
        textAlign: "center",
        fontFamily: "var(--font-satoshi)",
        lineHeight: "1.2",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default GradientText;
