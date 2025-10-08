import React from "react";
import styles from "@/styles/Grid.module.css";

export default function Grid({ children, columns = 2 }) {
  return (
    <div className={styles.grid} data-columns={columns}>
      {children}
    </div>
  );
}
