import React from "react";
import styles from "./Reviews.module.css";
import Title from "@/layouts/Title";
import Container from "@/layouts/Container";
import Slide from "./Slide";
import BackgroundGlow from "@/layouts/BackgroundGlow";

function Reviews() {
  return (
    <div className={styles.reviews}>
      <Container>
        <Title>
          The proof is in their <span>words</span>.
        </Title>
        <div className={styles.slider}>
          <Slide />
        </div>
      </Container>
    </div>
  );
}

export default Reviews;
