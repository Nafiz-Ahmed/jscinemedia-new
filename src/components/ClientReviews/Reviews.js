"use client";

import React from "react";
import styles from "./Reviews.module.css";
import Title from "@/layouts/Title";
import Container from "@/layouts/Container";
import Slide from "./Slide";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

function Reviews() {
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });

  return (
    <div className={styles.reviews}>
      <Container>
        <div ref={titleRef}>
          <Title>
            <span>The proof</span> is in their words.
          </Title>
        </div>
        <div className={styles.slider}>
          <Slide />
        </div>
      </Container>
    </div>
  );
}

export default Reviews;
