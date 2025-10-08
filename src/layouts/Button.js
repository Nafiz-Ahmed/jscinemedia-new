"use client";
import React from "react";
import styles from "@/styles/Button.module.css";
import { useNavigateToId } from "@/layouts/ScrollContext";
import goWP from "@/utils/goWP";

export default function Button({
  children,
  onClick = "contact",
  whatsApp = false,
  style = {},
  variant = "default", // "default" | "dark"
  shadow = "normal", // "normal" | "subtle"
}) {
  const navigateToId = useNavigateToId();

  const handleClick = () => {
    if (whatsApp) {
      goWP();
    } else {
      navigateToId(onClick);
    }
  };

  const getClassName = () => {
    const classes = [styles.glowBtn];

    if (variant === "dark") {
      classes.push(styles.dark);
    }

    if (shadow === "subtle") {
      classes.push(styles.subtleShadow);
    }

    return classes.join(" ");
  };

  return (
    <div style={{ ...style }} className={getClassName()} onClick={handleClick}>
      <span>{children}</span>
    </div>
  );
}
