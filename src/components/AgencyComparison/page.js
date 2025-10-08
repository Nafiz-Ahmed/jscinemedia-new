import Container from "@/layouts/Container";
import React from "react";
import AgencyComparison from "./AgencyComparison";
import Title from "@/layouts/Title";
import BackgroundGlow from "@/layouts/BackgroundGlow";
import GlowingButton from "@/layouts/GlowingButton";
import Button from "@/layouts/Button";

function page() {
  return (
    <div
      style={{
        padding: "100px 0",
        position: "relative",
      }}
    >
      <BackgroundGlow width="90vw" left="-50%" top="40%" />
      <Title>
        Trusted by many, chosen for a <span>reason</span>.
      </Title>
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
          {/* <GlowingButton whatsApp style={{ padding: "15px 24px" }}>
            Let&apos;s talk
          </GlowingButton> */}
          <Button whatsApp>Book 15-min audit</Button>
        </div>
      </Container>
    </div>
  );
}

export default page;
