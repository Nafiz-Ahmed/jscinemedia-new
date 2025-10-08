"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import GradientText from "@/layouts/GradientText";
import { useNavigateToId } from "./ScrollContext";
import goWP from "@/utils/goWP";

// Orbit path coordinates
const orbitPath = [
  { gx: 50, gy: 0 }, // top
  { gx: 100, gy: 50 }, // right
  { gx: 50, gy: 100 }, // bottom
  { gx: 0, gy: 50 }, // left
];

// Easing function for smooth transitions
const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Interpolate between two values
const lerp = (start, end, t) => start + (end - start) * t;

// Get position along orbit path
const getOrbitPosition = (progress) => {
  const segment = Math.floor(progress * 4) % 4;
  const t = (progress * 4) % 1;
  const current = orbitPath[segment];
  const next = orbitPath[(segment + 1) % 4];

  return {
    gx: lerp(current.gx, next.gx, t),
    gy: lerp(current.gy, next.gy, t),
  };
};

function GlowingButton({
  children,
  style = {},
  width,
  onClick = "contact",
  whatsApp = false,
}) {
  const circleRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef(null);
  const navigateToId = useNavigateToId();

  // Animation state
  const stateRef = useRef({
    orbitProgress: 0, // Progress along the orbit (0 to 1)
    currentGx: 50,
    currentGy: 0,
    currentGrx: 25,
    currentGry: 50,
    targetGx: 50,
    targetGy: 0,
    targetGrx: 25,
    targetGry: 50,
    isTransitioning: false,
    transitionProgress: 0,
    savedOrbitProgress: 0,
  });

  // Update CSS custom properties
  const updateStyles = useCallback((gx, gy, grx, gry) => {
    if (circleRef.current) {
      const circle = circleRef.current;
      circle.style.setProperty("--gx", `${gx}%`);
      circle.style.setProperty("--gy", `${gy}%`);
      circle.style.setProperty("--grx", `${grx}%`);
      circle.style.setProperty("--gry", `${gry}%`);
    }
  }, []);

  // Main animation loop
  const animate = useCallback(
    (timestamp) => {
      const state = stateRef.current;
      const deltaTime = 16; // ~60fps

      if (state.isTransitioning) {
        // Handle transition to/from center
        state.transitionProgress = Math.min(
          state.transitionProgress + deltaTime / 400,
          1
        ); // 400ms transition
        const progress = easeInOut(state.transitionProgress);

        // Interpolate all values during transition
        state.currentGx = lerp(
          state.currentGx,
          state.targetGx,
          progress * 0.15
        );
        state.currentGy = lerp(
          state.currentGy,
          state.targetGy,
          progress * 0.15
        );
        state.currentGrx = lerp(
          state.currentGrx,
          state.targetGrx,
          progress * 0.15
        );
        state.currentGry = lerp(
          state.currentGry,
          state.targetGry,
          progress * 0.15
        );

        // Check if transition is complete
        if (state.transitionProgress >= 1) {
          state.isTransitioning = false;
          state.currentGx = state.targetGx;
          state.currentGy = state.targetGy;
          state.currentGrx = state.targetGrx;
          state.currentGry = state.targetGry;
        }
      } else if (!isHovered) {
        // Continue orbit animation
        state.orbitProgress += deltaTime / 4000; // 4 second orbit
        if (state.orbitProgress >= 1) state.orbitProgress -= 1;

        const orbitPos = getOrbitPosition(state.orbitProgress);
        state.currentGx = orbitPos.gx;
        state.currentGy = orbitPos.gy;
        state.currentGrx = 25;
        state.currentGry = 50;
      }

      // Update the visual styles
      updateStyles(
        state.currentGx,
        state.currentGy,
        state.currentGrx,
        state.currentGry
      );

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    },
    [isHovered, updateStyles]
  );

  // Start transition to center
  const startHoverTransition = useCallback(() => {
    const state = stateRef.current;
    state.savedOrbitProgress = state.orbitProgress;
    state.targetGx = 50;
    state.targetGy = 50;
    state.targetGrx = 100;
    state.targetGry = 150;
    state.isTransitioning = true;
    state.transitionProgress = 0;
  }, []);

  // Start transition back to orbit
  const startLeaveTransition = useCallback(() => {
    const state = stateRef.current;
    state.orbitProgress = state.savedOrbitProgress;
    const orbitPos = getOrbitPosition(state.orbitProgress);
    state.targetGx = orbitPos.gx;
    state.targetGy = orbitPos.gy;
    state.targetGrx = 25;
    state.targetGry = 50;
    state.isTransitioning = true;
    state.transitionProgress = 0;
  }, []);

  // Initialize animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovered(true);
    startHoverTransition();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startLeaveTransition();
  };

  // Handle click events
  const handleClick = () => {
    if (whatsApp) {
      goWP();
    } else {
      navigateToId(onClick);
    }
  };

  const styles = {
    glowingButton: {
      "--glow": "var(--accent-color)",
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: width ? width : "auto",
      minWidth: "100px",
      minHeight: "37px",
      borderRadius: "8px",
      padding: "1px",
      border: "1px solid #ffffff0e",
      color: "white",
      fontSize: "var(--small-text)",
      overflow: "hidden",
      cursor: "pointer",
      backgroundColor: "#1a1a1a",
    },
    label: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      height: "100%",
      backgroundColor: "#1a1a1a",
      borderRadius: "7px",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      pointerEvents: "none",
      ...style,
    },
    glowingCircle: {
      position: "absolute",
      inset: "-1px",
      borderRadius: "inherit",
      zIndex: 1,
      background: `radial-gradient(
        var(--grx) var(--gry) at var(--gx) var(--gy),
        var(--glow) 0%,
        rgba(171, 171, 171, 0) ${isHovered ? "100%" : "100%"}
      )`,
    },
  };

  return (
    <div
      style={styles.glowingButton}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div ref={circleRef} style={styles.glowingCircle} />
      <span style={styles.label}>
        <GradientText
          style={{
            fontSize: "var(--small-text)",
            fontFamily: "var(--font-montserrat)",
            fontWeight: "500",
          }}
        >
          {children}
        </GradientText>
      </span>
    </div>
  );
}

export default GlowingButton;
