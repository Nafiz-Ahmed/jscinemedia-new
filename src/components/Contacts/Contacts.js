"use client";
import React, { useState } from "react";
import styles from "./Contacts.module.css";
import GradientText from "@/layouts/GradientText";
import Container from "@/layouts/Container";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import { useInView } from "@/hooks/useInView";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";
import Title from "@/layouts/Title";

function Contacts() {
  const [height, setHeight] = useState("600px");
  const { ref, isInView } = useInView({ threshold: 0.25 });

  useCalendlyEventListener({
    onPageHeightResize: (e) => setHeight(e.data.payload.height),
  });

  return (
    <Container>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <Title>
            Ready to <span>level up?</span> Let’s connect.
          </Title>
        </div>
        <div ref={ref} className={styles.calendly}>
          {/* Use InlineWidget's LoadingSpinner prop for loader */}
          <InlineWidget
            url="https://calendly.com/sazzadedits/30min"
            pageSettings={{
              hideEventTypeDetails: true,
              hideLandingPageDetails: true,
            }}
            styles={{
              width: "100%",
              height,
              minHeight: "600px",
              pointerEvents: "auto",
              border: "1px solid var(--border-color)",
              borderRadius: "15px",
              overflow: "hidden",
            }}
            LoadingSpinner={() => (
              <div
                style={{
                  width: "100%",
                  height: height,
                  minHeight: "600px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(13,12,12,0.8)",
                  borderRadius: "15px",
                }}
              >
                <TailChase size={40} speed={1.75} color="var(--accent-color)" />
              </div>
            )}
          />
        </div>
      </div>
    </Container>
  );
}

export default Contacts;
