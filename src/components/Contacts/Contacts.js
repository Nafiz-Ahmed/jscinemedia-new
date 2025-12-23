"use client";
import React, { useState } from "react";
import styles from "./Contacts.module.css";
// import GradientText from "@/layouts/GradientText"; // Unused in your snippet, kept if needed
import Container from "@/layouts/Container";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import { useInView } from "@/hooks/useInView";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";
import Title from "@/layouts/Title";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

function Contacts() {
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });

  const [height, setHeight] = useState("600px");
  // const { ref, isInView } = useInView({ threshold: 0.25 });

  useCalendlyEventListener({
    onPageHeightResize: (e) => setHeight(e.data.payload.height),
  });

  // Helper to toggle global cursor state
  const handleMouseEnter = () =>
    document.body.classList.add("hovering-iframe-wrapper");
  const handleMouseLeave = () =>
    document.body.classList.remove("hovering-iframe-wrapper");

  const handleMouseEnterIframe = () =>
    document.body.classList.add("hovering-iframe");
  const handleMouseLeaveIframe = () =>
    document.body.classList.remove("hovering-iframe");

  return (
    <Container>
      <div
        /* 2. Toggles the class that hides your custom cursor via CSS */
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={styles.wrapper}
      >
        <div ref={titleRef} className={styles.title}>
          <Title>
            Ready to <span>level up?</span> Let’s connect.
          </Title>
        </div>

        {/* --- WRAPPER UPDATES --- */}
        <div
          onMouseEnter={handleMouseEnterIframe}
          onMouseLeave={handleMouseLeaveIframe}
          className={styles.calendly}
        >
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
              minWidth: "320px", // Critical for proper rendering
              pointerEvents: "auto", // Keeps interaction enabled
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
