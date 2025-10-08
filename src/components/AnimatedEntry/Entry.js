"use client";

import React, { useRef, useMemo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useScroll } from "@/layouts/ScrollContext";
import styles from "./Entry.module.css";
import Container from "@/layouts/Container";

gsap.registerPlugin(SplitText, ScrollTrigger);

const STATS_DATA = Object.freeze([
  { value: "200%", name: "More Engagement", title: "Boost engagement" },
  { value: "5x", name: "More Reach", title: "Expand reach" },
  {
    value: "50%",
    name: "More Leads",
    title: "Convert more viewers into leads",
  },
]);

const ANIMATION_CONFIG = Object.freeze({
  text: {
    scrollTrigger: {
      start: "top bottom-=500px",
      end: "bottom 40%",
      scrub: true,
      markers: true,
    },
    animation: { color: "white", ease: "power1.inOut" },
  },
  debounceDelay: 300,
});

const StatItem = React.memo(({ stat }) => (
  <div className={styles.statContent}>
    <div className={styles.statValue}>{stat.value}</div>
    <div className={styles.statTitle}>{stat.title}</div>
  </div>
));
StatItem.displayName = "StatItem";

function Entry() {
  const textRef = useRef(null);
  const splitRef = useRef(null);
  const triggersRef = useRef([]);
  const resizeTimerRef = useRef(null);
  const { smoother, waitForReady, isReady, refresh, isMobile, isTablet } =
    useScroll();

  const TEXT_CONTENT =
    "Bored of video content that blends in? Let's take your visuals to the next level stand out with us!";

  // Function to setup text animations
  const setupTextAnimations = useCallback(() => {
    if (!textRef.current) return;

    // Clean up existing split and triggers
    if (splitRef.current) {
      splitRef.current.revert();
      splitRef.current = null;
    }
    triggersRef.current.forEach((t) => t?.kill());
    triggersRef.current = [];

    // Create new split with words instead of lines
    const split = new SplitText(textRef.current, { type: "words" });
    splitRef.current = split;

    // Animate each word
    split.words.forEach((word, i) => {
      const start = `top ${80 - i * 2}%`;
      const end = `bottom ${Math.max(40 - i * 2, 0)}%`;
      const trigger = gsap.timeline({
        scrollTrigger: {
          trigger: word,
          start,
          end,
          scrub: true,
          onEnter: () => gsap.set(word, { color: "white" }),
          onLeaveBack: () => gsap.set(word, { color: "" }),
        },
      });
      triggersRef.current.push(trigger.scrollTrigger);
    });
  }, []);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (resizeTimerRef.current) {
      clearTimeout(resizeTimerRef.current);
    }

    resizeTimerRef.current = setTimeout(() => {
      if (isReady) {
        setupTextAnimations();
        refresh();
      }
    }, ANIMATION_CONFIG.debounceDelay);
  }, [isReady, setupTextAnimations, refresh]);

  // Text animation hook
  useGSAP(
    () => {
      waitForReady(() => {
        setupTextAnimations();
      });

      // Add resize listener
      window.addEventListener("resize", handleResize);

      return () => {
        // Cleanup
        if (splitRef.current) {
          splitRef.current.revert();
          splitRef.current = null;
        }
        triggersRef.current.forEach((t) => t?.kill());
        triggersRef.current = [];

        if (resizeTimerRef.current) {
          clearTimeout(resizeTimerRef.current);
        }

        window.removeEventListener("resize", handleResize);
      };
    },
    { dependencies: [isReady, smoother, setupTextAnimations, handleResize] }
  );

  const formattedText = useMemo(
    () => (
      <p ref={textRef} className={styles.text} data-text={TEXT_CONTENT}>
        {TEXT_CONTENT}
      </p>
    ),
    [TEXT_CONTENT]
  );

  return (
    <section className={styles.entry}>
      <Container>
        <div className={styles.wrapper}>
          {/* {!(isMobile || isTablet) && ( */}
          <div className={styles.contents} style={{ position: "relative" }}>
            {formattedText}
          </div>
          {/* )} */}
          <div className={styles.statistics}>
            {STATS_DATA.map((stat, i) => (
              <StatItem key={i} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default React.memo(Entry);
