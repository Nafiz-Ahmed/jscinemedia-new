"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./NavBar.module.css";
import Container from "@/layouts/Container";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll } from "@/layouts/ScrollContext";
import { useGSAP } from "@gsap/react";
import GlowingButton from "@/layouts/GlowingButton";
import GradientText from "@/layouts/GradientText";
import Link from "next/link";
import Logo from "@/layouts/Logo";
import { useNavigateToId } from "@/layouts/ScrollContext";
import HamBurger from "./HamBurger";
import Button from "@/layouts/Button";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { id: "work", label: "Work" },
  { id: "review", label: "Review" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const ANIMATION_DURATION = {
  BAR: 0.36,
  BAR_FADE: 0.18,
  MOBILE_MENU: 0.3,
};

export default function NavBar() {
  // State
  const [activeId, setActiveId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Context
  const { smoother, isMobile, isLoading } = useScroll();
  const navigateToId = useNavigateToId();

  // Refs
  const barRef = useRef(null);
  const linksContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const linkRefs = useRef({});
  const navBarRef = useRef(null); // Ref for the entire NavBar component

  // Animation refs
  const tweenRef = useRef(null);
  const barTween = useRef(null);

  // State tracking
  const isMouseOverNavRef = useRef(false);
  const lastActiveIdRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  const timeoutsRef = useRef(new Set());
  const scrollPositionRef = useRef(0);

  // Cleanup helper
  const addTimeout = useCallback((timeoutId) => {
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current.clear();
  }, []);

  // Kill animations safely
  const killAnimation = useCallback((animationRef) => {
    if (animationRef.current?.kill) {
      animationRef.current.kill();
      animationRef.current = null;
    }
  }, []);

  // Bar animation functions
  const hideBar = useCallback(() => {
    if (!barRef.current || isMobile) return;

    killAnimation(barTween);
    barTween.current = gsap.to(barRef.current, {
      opacity: 0,
      duration: ANIMATION_DURATION.BAR_FADE,
      ease: "power2.out",
    });
  }, [isMobile, killAnimation]);

  const animateBarTo = useCallback(
    (id, immediate = false) => {
      if (!id || !barRef.current || !linksContainerRef.current || isMobile)
        return;

      const linkEl = linkRefs.current[id];
      if (!linkEl) return;

      try {
        const containerRect = linksContainerRef.current.getBoundingClientRect();
        const linkRect = linkEl.getBoundingClientRect();

        if (!containerRect.width || !linkRect.width) return;

        const position = {
          left: linkRect.left - containerRect.left,
          top: linkRect.top - containerRect.top,
          width: linkRect.width,
          height: linkRect.height,
        };

        killAnimation(barTween);

        const currentOpacity = gsap.getProperty(barRef.current, "opacity") || 0;

        if (currentOpacity === 0 || immediate) {
          gsap.set(barRef.current, {
            ...position,
            borderRadius: "7px",
            clearProps: "transform",
          });
          barTween.current = gsap.to(barRef.current, {
            opacity: 1,
            duration: 0.14,
            ease: "power1.out",
          });
        } else {
          barTween.current = gsap.to(barRef.current, {
            ...position,
            opacity: 1,
            borderRadius: "7px",
            duration: ANIMATION_DURATION.BAR,
            ease: "power3.out",
          });
        }
      } catch (error) {
        console.warn("Bar animation error:", error);
      }
    },
    [isMobile, killAnimation]
  );

  // Navigation click handler
  const handleNavigationClick = useCallback(
    (e, id) => {
      e.preventDefault();

      // Reset states
      setHoveredId(null);
      isMouseOverNavRef.current = false;
      setIsMobileMenuOpen(false); // Close menu on navigation
      clearAllTimeouts();
      navigateToId(id);
    },
    [clearAllTimeouts, navigateToId]
  );

  // Mouse event handlers
  const handleLinkMouseEnter = useCallback(
    (id) => {
      if (isMobile) return;

      clearAllTimeouts();
      isMouseOverNavRef.current = true;
      setHoveredId(id);
      animateBarTo(id);
    },
    [isMobile, clearAllTimeouts, animateBarTo]
  );

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;

    const timeoutId = addTimeout(
      setTimeout(() => {
        isMouseOverNavRef.current = false;
        setHoveredId(null);

        if (lastActiveIdRef.current) {
          animateBarTo(lastActiveIdRef.current);
        } else {
          hideBar();
        }
      }, 50)
    );

    return timeoutId;
  }, [isMobile, addTimeout, animateBarTo, hideBar]);

  // Handle clicks outside the mobile menu
  const handleClickOutside = useCallback(
    (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        navBarRef.current && // Ensure clicks inside the main navbar don't close it
        !navBarRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    },
    [isMobileMenuOpen]
  );

  // Effect to add/remove click outside listener
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, handleClickOutside]);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Handle active ID changes
  useEffect(() => {
    if (!activeId || isMobile || isMouseOverNavRef.current) return;

    lastActiveIdRef.current = activeId;
    animateBarTo(activeId);
  }, [activeId, isMobile, animateBarTo]);

  // Handle bar visibility
  useEffect(() => {
    if (!activeId && !hoveredId && !isMobile) {
      hideBar();
    }
  }, [activeId, hoveredId, isMobile, hideBar]);

  // Mobile menu animation and ScrollSmoother pause
  useEffect(() => {
    if (!mobileMenuRef.current || !isMobile) return;

    try {
      const menu = mobileMenuRef.current;

      if (isMobileMenuOpen) {
        // Store current scroll position
        scrollPositionRef.current = window.pageYOffset;

        // Animate menu in
        gsap.set(menu, { display: "flex", opacity: 0, y: -20 });
        gsap.to(menu, {
          opacity: 1,
          y: 0,
          duration: ANIMATION_DURATION.MOBILE_MENU,
          ease: "power2.out",
        });

        // Pause ScrollSmoother
        if (smoother) {
          smoother.paused(true);
        }
      } else {
        // Animate menu out
        gsap.to(menu, {
          opacity: 0,
          y: -20,
          duration: ANIMATION_DURATION.MOBILE_MENU,
          ease: "power2.out",
          onComplete: () => gsap.set(menu, { display: "none" }),
        });

        // Resume ScrollSmoother
        if (smoother && typeof smoother.paused === "function") {
          smoother.paused(false);
        }
      }
    } catch (error) {
      console.warn("Mobile menu animation error:", error);
    }
  }, [isMobileMenuOpen, isMobile, smoother]);

  // ScrollTrigger setup
  useGSAP(
    () => {
      // Cleanup existing triggers
      scrollTriggersRef.current.forEach((trigger) => trigger?.kill?.());
      scrollTriggersRef.current = [];

      if (isMobile) return;

      const triggers = LINKS.map(({ id }) => {
        const section = document.getElementById(id);
        if (!section) return null;

        try {
          return ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (self.isActive) {
                setActiveId(id);
                lastActiveIdRef.current = id;
                if (!isMouseOverNavRef.current) {
                  animateBarTo(id);
                }
              } else {
                requestAnimationFrame(() => {
                  const anyActive = ScrollTrigger.getAll().some(
                    (t) =>
                      t.trigger?.id &&
                      LINKS.some((link) => link.id === t.trigger.id) &&
                      t.isActive
                  );

                  if (!anyActive) {
                    setActiveId(null);
                    lastActiveIdRef.current = null;
                    if (!isMouseOverNavRef.current) {
                      hideBar();
                    }
                  }
                });
              }
            },
          });
        } catch (error) {
          console.warn(`ScrollTrigger error for ${id}:`, error);
          return null;
        }
      }).filter(Boolean);

      scrollTriggersRef.current = triggers;

      return () => triggers.forEach((trigger) => trigger?.kill?.());
    },
    { dependencies: [smoother, isMobile, animateBarTo, hideBar] }
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      killAnimation(tweenRef);
      killAnimation(barTween);
      scrollTriggersRef.current.forEach((trigger) => trigger?.kill?.());

      // Ensure body styles are cleaned up
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [clearAllTimeouts, killAnimation]);

  return (
    <div
      ref={navBarRef} // Attach ref to the main NavBar div
      style={{
        opacity: isLoading ? 0 : 1,
      }}
      className={styles.navbar}
    >
      <Container>
        <div
          className={styles.navContent}
          ref={linksContainerRef}
          onMouseLeave={handleMouseLeave}
        >
          <Link href="/">
            <Logo width={120} height={60} />
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <div className={styles.links}>
                {LINKS.map(({ id, label }) => (
                  <div
                    key={id}
                    ref={(el) => (linkRefs.current[id] = el)}
                    className={`${styles.link} ${
                      activeId === id ? styles.active : ""
                    }`}
                    onMouseEnter={() => handleLinkMouseEnter(id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => handleNavigationClick(e, id)}
                  >
                    {activeId === id ? (
                      <GradientText
                        style={{
                          fontSize: "var(--small-text)",
                          fontWeight: "500",
                          fontFamily: "var(--font-satoshi)",
                        }}
                      >
                        {label}
                      </GradientText>
                    ) : (
                      label
                    )}
                  </div>
                ))}
              </div>

              <div
                ref={barRef}
                className={styles.activeBar}
                style={{
                  position: "absolute",
                  opacity: 0,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              <div className={styles.button}>
                <Button shadow="subtle" whatsApp>
                  Let&apos;s talk
                </Button>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <div className={styles.mobileToggle}>
              <HamBurger
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <div
            ref={mobileMenuRef}
            className={`${styles.mobileMenu} ${
              isMobileMenuOpen ? styles.open : ""
            }`}
            style={{ display: "none" }}
          >
            <div className={styles.mobileLinks}>
              {LINKS.map(({ id, label }) => (
                <div
                  key={id}
                  className={`${styles.mobileLink} ${
                    activeId === id ? styles.active : ""
                  }`}
                  onClick={(e) => handleNavigationClick(e, id)}
                >
                  {label}
                </div>
              ))}

              <div className={styles.mobileCTA}>
                <Button
                  shadow="subtle"
                  whatsApp
                  style={{ width: "100%", maxWidth: "280px" }}
                >
                  Let&apos;s talk
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
