import TitleV2 from "@/layouts/TitleV2";
import React from "react";
import styles from "./Process.module.css";
import Timeline from "./Timeline";
import Container from "@/layouts/Container";

function Process() {
  return (
    <div>
      <Container>
        <div className={styles.processSection}>
          <TitleV2 title="Our Process" />
          <Timeline />
        </div>
      </Container>
    </div>
  );
}

export default Process;
