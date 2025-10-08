"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "./LoadingScreen.module.css";
import { useScroll } from "@/layouts/ScrollContext";
import GradientText from "@/layouts/GradientText";

gsap.registerPlugin(SplitText);

function LoadingScreen() {
  const { smoother, isLoading, setIsLoading } = useScroll();
  const textRef = useRef(null);
  const underlineRef = useRef(null);
  const containerRef = useRef(null);
  const wrapperRef = useRef();

  // ========== ANIMATION VARIABLES (TWEAK THESE) ==========
  const ANIMATION_CONFIG = {
    // Durations (in seconds)
    delayStart: 1, // Delay before animation starts
    textInDuration: 0.5,
    underlineGrowDuration: 0.4,
    pauseDuration: 1,
    textOutDuration: 0.5,
    underlineShrinkDuration: 0.5,

    // Stagger
    charStagger: 0.025,

    // Easing
    textInEase: "power3.out",
    underlineGrowEase: "power2.out",
    textOutEase: "power3.in",
    underlineShrinkEase: "power2.in",

    // Timing
    underlineStartPercent: 0.5, // Start underline when text is 50% complete

    // Gap (set in CSS, but noted here for reference)
    textUnderlineGap: "4px", // Update in CSS
  };
  // ========================================================

  useEffect(() => {
    if (!smoother) return;

    // Split text into characters
    const split = new SplitText(textRef.current, { type: "chars" });
    const chars = split.chars;

    const tl = gsap.timeline({
      delay: ANIMATION_CONFIG.delayStart, // Start after 1 second
      onComplete: () => {
        setTimeout(() => {
          setIsLoading(false);
        }, 200);
      },
    });

    gsap.set(wrapperRef.current, { opacity: 1, visibility: "visible" });

    // Set initial state for characters
    gsap.set(chars, { yPercent: 100 });

    // Set initial state for underline
    gsap.set(underlineRef.current, {
      scaleX: 0,
      transformOrigin: "left",
    });

    // Phase 1: Characters slide in from bottom with stagger
    tl.to(chars, {
      yPercent: 0,
      duration: ANIMATION_CONFIG.textInDuration,
      stagger: ANIMATION_CONFIG.charStagger,
      ease: ANIMATION_CONFIG.textInEase,
    });

    // Phase 2: Underline grows from left (starts at 50% of text animation)
    tl.fromTo(
      underlineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1,
        duration: ANIMATION_CONFIG.underlineGrowDuration,
        ease: ANIMATION_CONFIG.underlineGrowEase,
      },
      ANIMATION_CONFIG.textInDuration * ANIMATION_CONFIG.underlineStartPercent
    );

    // Phase 3 & 4: Characters slide out to top AND underline shrinks from right
    tl.to(
      chars,
      {
        yPercent: -100,
        duration: ANIMATION_CONFIG.textOutDuration,
        stagger: ANIMATION_CONFIG.charStagger,
        ease: ANIMATION_CONFIG.textOutEase,
      },
      `+=${ANIMATION_CONFIG.pauseDuration}`
    );

    // Underline shrinks to the right (scales down from right side)
    tl.to(
      underlineRef.current,
      {
        scaleX: 0,
        transformOrigin: "right",
        duration: ANIMATION_CONFIG.underlineShrinkDuration,
        ease: ANIMATION_CONFIG.underlineShrinkEase,
      },
      "-=0.5" // Sync with text exit
    );

    return () => {
      split.revert();
      tl.kill();
    };
  }, [
    smoother,
    setIsLoading,
    ANIMATION_CONFIG.delayStart,
    ANIMATION_CONFIG.textInDuration,
    ANIMATION_CONFIG.charStagger,
    ANIMATION_CONFIG.textInEase,
    ANIMATION_CONFIG.underlineGrowDuration,
    ANIMATION_CONFIG.underlineGrowEase,
    ANIMATION_CONFIG.underlineStartPercent,
    ANIMATION_CONFIG.textOutDuration,
    ANIMATION_CONFIG.textOutEase,
    ANIMATION_CONFIG.pauseDuration,
    ANIMATION_CONFIG.underlineShrinkDuration,
    ANIMATION_CONFIG.underlineShrinkEase,
  ]);

  return (
    <div>
      {isLoading && (
        <div ref={wrapperRef} className={styles.loadingWrapper}>
          <div ref={containerRef} className={styles.loading}>
            <div ref={textRef} className={styles.loadingText}>
              J&S CINEMEDIA
            </div>
            <div ref={underlineRef} className={styles.underline}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoadingScreen;
