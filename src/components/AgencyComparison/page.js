"use client";

import Container from "@/layouts/Container";
import React from "react";
import AgencyComparison from "./AgencyComparison";
import Title from "@/layouts/Title";
import BackgroundGlow from "@/layouts/BackgroundGlow";
import Button from "@/layouts/Button";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

function AgencyComparisonPage() {
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });

  return (
    <div
      style={{
        padding: "100px 0",
        position: "relative",
      }}
    >
      <BackgroundGlow width="90vw" left="-50%" top="40%" />
      <div ref={titleRef}>
        <Title>
          Trusted by many, chosen for a <span>reason</span>.
        </Title>
      </div>
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <AgencyComparison />
          <Button whatsApp>Book 15-min audit</Button>
        </div>
      </Container>
    </div>
  );
}

export default AgencyComparisonPage;
