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
          <Button
            style={{
              padding: "20px 30px",
              fontWeight: "600",
            }}
            whatsApp
          >
            Book 15-min audit
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default AgencyComparisonPage;
