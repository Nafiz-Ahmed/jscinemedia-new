import React from "react";
import styles from "@/styles/Title.module.css";
import Container from "./Container";

function Title({ children }) {
  return (
    <Container>
      <div className={styles.title}>{children}</div>
    </Container>
  );
}

export default Title;
