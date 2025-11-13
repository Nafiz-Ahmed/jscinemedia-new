"use client";
import React, { useRef, useMemo } from "react";
import styles from "./Hero.module.css";
import Container from "@/layouts/Container";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useNavigateToId, useScroll } from "@/layouts/ScrollContext";
import MovingCirclesBackground from "@/layouts/MovingCirclesBackground";
import GradientText from "@/layouts/GradientText";
import CustomTab from "../CustomTab/CustomTab";
import Video from "../VideoPlayer/Video";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import { useTextRevealAnimation } from "@/hooks/useTextRevealAnimation"; // Import the hook

gsap.registerPlugin(ScrollTrigger);

// Move constants outside component to prevent recreation
const IMAGE_SOURCES = Object.freeze([
  "/images/clientPhotos/p1.jpg",
  "/images/clientPhotos/p2.jpg",
  "/images/clientPhotos/p3.jpeg",
  "/images/clientPhotos/p4.jpg",
]);

const VSL_VIDEO = Object.freeze(
  "Ji01JaxUCBk1bJWQGU1yLtSqTLJ00o53CO9xgyqasOrd8"
);

// Memoized ClientImages component
const ClientImages = React.memo(({ images }) => (
  <div className={styles.clientsImages}>
    {images.map((src, index) => (
      <div key={src} style={{ zIndex: images.length - index }}>
        <Image alt="client" src={src} fill sizes="40px" />
      </div>
    ))}
  </div>
));
ClientImages.displayName = "ClientImages";

// Memoized ClientContent component
const ClientContent = React.memo(() => (
  <div className={styles.clientContent}>
    <h3>Loved by 500+ Businesses worldwide.</h3>
    <p>Our Clients Speak for Us</p>
  </div>
));
ClientContent.displayName = "ClientContent";

function Hero() {
  const cardRef = useRef(null);
  const { waitForReady, isMobile, isReady, loadingTimeline, isLoading } =
    useScroll();
  const tl = useRef(null);
  const navigateToId = useNavigateToId();
  const clientRef = useRef(null);
  const buttonRef = useRef(null);
  const heroTl = useRef(null);

  // Use the text reveal animation hook for the title
  const titleRef = useTextRevealAnimation({
    isLoading: isLoading,
    delay: 0.2,
    yOffset: 40,
    blur: 10,
    stagger: 0.1,
    duration: 1,
    ease: "power2.out",
    scrollTriggerStart: "top bottom-=100px",
    enabled: true,
  });

  const descriptionRef = useTextRevealAnimation({
    isLoading: isLoading,
    delay: 0.4,
  });

  const handleWatchDemo = () => {
    navigateToId("work");
  };

  const handleViewPricing = () => {
    navigateToId("subscribe");
  };

  const TAB_ELEMENTS = Object.freeze([
    {
      id: 1,
      label: "Watch Demo",
      accessibility: handleWatchDemo,
    },
    {
      id: 2,
      label: "View Pricing",
      accessibility: handleViewPricing,
    },
  ]);

  useGSAP(
    () => {
      if (!isReady || isMobile) return;

      waitForReady(() => {
        // Kill old timelines if any
        if (tl.current) {
          tl.current.scrollTrigger?.kill();
          tl.current.kill();
          tl.current = null;
        }

        // Card animation (scroll-triggered)
        if (cardRef.current) {
          const element = cardRef.current;
          gsap.set(element, {
            autoAlpha: 1,
            rotateX: 45,
            transformPerspective: 1000,
          });

          tl.current = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              start: "top bottom",
              end: "center top+=200",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          tl.current.to(element, { rotateX: 0, ease: "power2.out" });
        }
      });

      // Cleanup function
      return () => {
        if (tl.current) {
          tl.current.scrollTrigger?.kill();
          tl.current.kill();
          tl.current = null;
        }
      };
    },
    {
      dependencies: [isReady, isMobile, loadingTimeline],
    }
  );

  return (
    <div className={styles.hero}>
      <MovingCirclesBackground />
      <div className={styles.loading}>
        <LoadingScreen />
      </div>
      <Container>
        <div
          className={styles.heroWrapper}
          style={{
            opacity: isLoading ? "0" : "1",
          }}
        >
          <div className={styles.heroContent}>
            <div style={{ maxWidth: "900px" }}>
              <div className={styles.title} ref={titleRef}>
                <span
                  style={{
                    fontFamily: "var(--font-instrument-serif)",
                    fontStyle: "italic",
                  }}
                >
                  Video Editing
                </span>{" "}
                that Converts Creators, Brands & Agencies
              </div>
            </div>

            <div ref={descriptionRef} className={styles.paragraph}>
              From raw footage to polished videos that grow your audience &
              leads fast turnarounds, subscription pricing.
            </div>

            <div ref={clientRef} className={styles.clientHolder}>
              <ClientImages images={IMAGE_SOURCES} />
              <ClientContent />
            </div>

            <div ref={buttonRef} className={styles.button}>
              <CustomTab
                elements={TAB_ELEMENTS}
                defaultSelected={2}
                constantSelected={true}
                selected={2}
              />
            </div>

            <div ref={cardRef} className={`addAnimation ${styles.card}`}>
              <Video
                maxWidth={false}
                playbackId={VSL_VIDEO}
                poster={"/images/VSL.jpg"}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Hero;
