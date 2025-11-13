"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Process.module.css";
import Title from "@/layouts/Title";
import Container from "@/layouts/Container";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation";
import { useScroll } from "@/layouts/ScrollContext";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const ANIMATION_CONFIG = {
  stackedRotations: [-25, -15, -8, 8, 15, 25],
  cardStagger: 0.15,
  cardDuration: 1.2,
  cardEase: "elastic.out(1, 0.6)",
  svgDuration: 1.5,
  svgEase: "power2.inOut",
  svgDelay: 0.1,
  triggerOffset: 100,
  svgAnimationMode: "simultaneous",
};

// Predefined positions for each breakpoint
// Based on your CSS transforms
const CARD_POSITIONS = {
  desktop: [
    { x: 0, y: 0, rotation: 9 }, // Card 1 (odd - translateY(-80px) rotate(9deg))
    { x: 0, y: -80, rotation: -3 }, // Card 2 (even - rotate(-3deg))
    { x: 0, y: 0, rotation: 9 }, // Card 3 (odd - translateY(-80px) rotate(9deg))
    { x: 0, y: -80, rotation: -3 }, // Card 4 (even - rotate(-3deg))
  ],
  tablet: [
    { x: 0, y: 0, rotation: 9 }, // Card 1 (odd - translateY(0) rotate(9deg))
    { x: 0, y: 0, rotation: -3 }, // Card 2 (even - rotate(-3deg))
    { x: 0, y: 0, rotation: -3 }, // Card 4 (even, order 3 - rotate(-3deg))
    { x: 0, y: 0, rotation: 9 }, // Card 3 (odd, order 4 - translateY(0) rotate(9deg))
  ],
  mobile: [
    { x: 0, y: 0, rotation: 9 }, // Card 1 (odd - translateY(0) rotate(9deg))
    { x: 0, y: 0, rotation: -3 }, // Card 2 (even - rotate(-3deg))
    { x: 0, y: 0, rotation: 9 }, // Card 3 (odd - translateY(0) rotate(9deg))
    { x: 0, y: 0, rotation: -3 }, // Card 4 (even - rotate(-3deg))
  ],
};

const processSteps = [
  {
    id: "1",
    title: "Share Your Vision",
    description:
      "Tell us about your project, goals, and audience. Once we understand your vision, our team gets to work on a tailored editing plan.",
  },
  {
    id: "2",
    title: "We Edit with Purpose",
    description:
      "From cutting unnecessary fluff to adding motion graphics, music, and color grading. We turn raw footage into scroll-stopping, story-driven content.",
  },
  {
    id: "3",
    title: "Review & Refine",
    description:
      "We share the first draft for your feedback. Want tweaks? We'll refine until it's exactly what you envisioned.",
  },
  {
    id: "4",
    title: "Final Delivery",
    description:
      "Your polished video is ready; optimized for the platform you choose. Just download, post, and watch your content shine.",
  },
];

function Process() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const svgsRef = useRef([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const timelineRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const { isLoading } = useScroll();
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
  });

  const getBreakpoint = () => {
    const width = window.innerWidth;
    if (width <= 768) return "mobile";
    if (width <= 1023) return "tablet";
    return "desktop";
  };

  const getRandomRotation = () => {
    const rotations = ANIMATION_CONFIG.stackedRotations;
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  useEffect(() => {
    const setupAnimation = () => {
      const container = containerRef.current;
      const cards = cardsRef.current.filter(Boolean);
      const svgs = svgsRef.current.filter(Boolean);

      if (!container || cards.length === 0) return;

      // Kill existing animations
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      const breakpoint = getBreakpoint();
      const targetStates = CARD_POSITIONS[breakpoint];

      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;

      // Set initial stacked (center) state
      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX =
          cardRect.left - containerRect.left + cardRect.width / 2;
        const cardCenterY =
          cardRect.top - containerRect.top + cardRect.height / 2;

        const deltaX = centerX - cardCenterX;
        const deltaY = centerY - cardCenterY;
        const randomRotation = getRandomRotation();

        gsap.set(card, {
          x: deltaX,
          y: deltaY,
          rotation: randomRotation,
          zIndex: cards.length - index,
        });
      });

      // Hide SVGs
      gsap.set(svgs, { opacity: 0 });
      gsap.set(
        svgs.map((svg) => svg.querySelector("path")),
        { drawSVG: "0%" }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: `top bottom-=${ANIMATION_CONFIG.triggerOffset}`,
          once: false,
          onEnter: () => setHasAnimated(true),
        },
      });

      timelineRef.current = tl;

      // Animate cards from stacked center → their predefined positions
      tl.to(cards, {
        x: (i) => targetStates[i].x,
        y: (i) => targetStates[i].y,
        rotation: (i) => targetStates[i].rotation,
        duration: ANIMATION_CONFIG.cardDuration,
        ease: ANIMATION_CONFIG.cardEase,
        stagger: ANIMATION_CONFIG.cardStagger,
        zIndex: 1,
      });

      if (ANIMATION_CONFIG.svgAnimationMode === "simultaneous") {
        const cardAnimationDuration =
          ANIMATION_CONFIG.cardDuration +
          ANIMATION_CONFIG.cardStagger * (cards.length - 1);
        const svgStartTime = cardAnimationDuration * 0.4; // Start at 40% of card animation

        tl.to(svgs, { opacity: 1, duration: 0.3 }, svgStartTime).to(
          svgs.map((svg) => svg.querySelector("path")),
          {
            drawSVG: "100%",
            duration: ANIMATION_CONFIG.svgDuration,
            ease: ANIMATION_CONFIG.svgEase,
            stagger: 0.1,
          },
          "<"
        );
      }

      // Store ScrollTrigger reference
      scrollTriggerRef.current = ScrollTrigger.getById(tl.scrollTrigger.id);
    };

    setupAnimation();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setHasAnimated(false);
        setupAnimation();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div>
      <Container>
        <div ref={titleRef}>
          <Title>
            How we make <span> things happen</span>.
          </Title>
        </div>

        <div ref={containerRef} className={styles.processContainer}>
          {/* SVG connectors */}
          <div
            ref={(el) => (svgsRef.current[0] = el)}
            className={styles.stepSvgOne}
          >
            <StepSvgOne />
          </div>
          <div
            ref={(el) => (svgsRef.current[1] = el)}
            className={styles.stepSvgTwo}
          >
            <StepSvgTwo />
          </div>
          <div
            ref={(el) => (svgsRef.current[2] = el)}
            className={styles.stepSvgThree}
          >
            <StepSvgOne />
          </div>

          {/* Process cards */}
          {processSteps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`${styles.processStep} ${styles[`step${step.id}`]}`}
            >
              <span className={styles.stepId}>{step.id}</span>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Process;

// --- SVG COMPONENTS ---
const StepSvgOne = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 247 69"
  >
    <path
      d="M 10.716 56.236 C 10.716 56.236 38.876 9.087 88.573 3.406 C 138.271 -2.276 172.885 11.384 233.016 57.669 M 10.586 50.115 C 14.483 50.115 17.643 53.285 17.643 57.197 C 17.643 61.108 14.483 64.279 10.586 64.279 C 6.688 64.279 3.529 61.108 3.529 57.197 C 3.529 53.285 6.688 50.115 10.586 50.115 Z M 232.886 50.115 C 236.783 50.115 239.943 53.285 239.943 57.197 C 239.943 61.108 236.783 64.279 232.886 64.279 C 228.988 64.279 225.829 61.108 225.829 57.197 C 225.829 53.285 228.988 50.115 232.886 50.115 Z"
      stroke="var(--accent-color, #b4d429)"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="transparent"
    />
  </svg>
);

const StepSvgTwo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 106 179"
  >
    <path
      d="M 95.993 11.704 C 43.708 8.765 57.558 98.411 77.749 93.631 C 97.94 88.852 48.295 23.589 19.858 39.508 C -8.579 55.425 10.736 95.485 15.297 103.641 C 19.859 111.796 46.874 150.721 92.134 170.369 M 92.468 163.464 C 96.205 163.464 99.234 166.488 99.234 170.219 C 99.234 173.949 96.205 176.974 92.468 176.974 C 88.731 176.974 85.702 173.949 85.702 170.219 C 85.702 166.488 88.731 163.464 92.468 163.464 Z M 95.851 4.728 C 99.588 4.728 102.617 7.752 102.617 11.483 C 102.617 15.214 99.588 18.238 95.851 18.238 C 92.114 18.238 89.085 15.214 89.085 11.483 C 89.085 7.752 92.114 4.728 95.851 4.728 Z"
      stroke="var(--accent-color, #b4d429)"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="transparent"
    />
  </svg>
);
