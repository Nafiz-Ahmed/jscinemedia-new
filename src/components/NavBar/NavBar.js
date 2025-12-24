"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import styles from "./NavBar.module.css";
import Container from "@/layouts/Container";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScroll } from "@/layouts/ScrollContext";
import { useGSAP } from "@gsap/react";
// import GlowingButton from "@/layouts/GlowingButton"; // Unused
import GradientText from "@/layouts/GradientText";
import Link from "next/link";
import Logo from "@/layouts/Logo";
import { useNavigateToId } from "@/layouts/ScrollContext";
import HamBurger from "./HamBurger";
import Button from "@/layouts/Button";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

const ANIMATION_DURATION = {
  BAR: 0.36,
  BAR_FADE: 0.18,
  MOBILE_MENU: 0.5,
  STAGGER: 0.1,
};

export default function NavBar() {
  // State
  const [activeId, setActiveId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);

  // Context
  const { smoother, isMobile, isLoading } = useScroll();
  const navigateToId = useNavigateToId();

  // Refs
  const barRef = useRef(null);
  const linksContainerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef(null);
  const mobileOverlayRef = useRef(null);
  const linkRefs = useRef({});
  const navBarRef = useRef(null);

  // Animation refs
  const tweenRef = useRef(null);
  const barTween = useRef(null);

  // State tracking
  const isMouseOverNavRef = useRef(false);
  const lastActiveIdRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  const timeoutsRef = useRef(new Set());

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
      setHoveredId(null);
      isMouseOverNavRef.current = false;
      setIsMobileMenuOpen(false);
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

  // Clear timeouts on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Handle active ID changes
  useEffect(() => {
    if (!activeId || isMobile || isMouseOverNavRef.current) return;
    lastActiveIdRef.current = activeId;
    animateBarTo(activeId);
  }, [activeId, isMobile, animateBarTo]);

  // Handle bar visibility
  useEffect(() => {
    if (!activeId && !hoveredId && !isMobile) hideBar();
  }, [activeId, hoveredId, isMobile, hideBar]);

  // Mobile menu scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      setShouldRenderMenu(true);
      if (smoother) smoother.stop();
    } else {
      if (smoother) smoother.start();
    }
  }, [isMobileMenuOpen, smoother]);

  // Mobile menu OPEN animation
  useLayoutEffect(() => {
    if (shouldRenderMenu && isMobileMenuOpen) {
      const menu = mobileMenuRef.current;
      const linksContainer = mobileLinksRef.current;
      const overlay = mobileOverlayRef.current;

      if (menu && linksContainer && overlay) {
        const children = gsap.utils.toArray(linksContainer.children);
        gsap.killTweensOf([menu, overlay, ...children]);

        gsap.set(menu, {
          scale: 0.3,
          opacity: 0,
          rotationY: -15,
          transformOrigin: "center top",
        });

        // Ensure overlay starts invisible
        gsap.set(overlay, { opacity: 0 });

        const tl = gsap.timeline();

        // Fade in overlay
        tl.to(overlay, { opacity: 1, duration: 0.3 }, 0);

        // Animate menu
        tl.to(
          menu,
          {
            scale: 1,
            opacity: 1,
            rotationY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.8)",
          },
          0.1
        );
      }
    }
  }, [shouldRenderMenu, isMobileMenuOpen]);

  // Mobile menu CLOSE animation
  useLayoutEffect(() => {
    if (!isMobileMenuOpen && shouldRenderMenu) {
      const menu = mobileMenuRef.current;
      const linksContainer = mobileLinksRef.current;
      const overlay = mobileOverlayRef.current;

      if (menu && linksContainer) {
        const children = gsap.utils.toArray(linksContainer.children);
        gsap.killTweensOf([menu, overlay, ...children]);

        const tl = gsap.timeline({
          onComplete: () => setShouldRenderMenu(false),
        });

        tl.to(
          children,
          {
            y: -20,
            opacity: 0,
            scale: 0.9,
            rotationX: -30,
            duration: 0.3,
            stagger: { amount: 0.15, from: "end" },
            ease: "back.in(1.7)",
          },
          0
        );

        tl.to(
          menu,
          {
            scale: 0.4,
            opacity: 0,
            rotationY: 15,
            duration: 0.4,
            ease: "back.in(1.7)",
          },
          0.1
        );

        tl.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.in" }, 0.2);
      } else {
        setShouldRenderMenu(false);
      }
    }
  }, [isMobileMenuOpen, shouldRenderMenu]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        navBarRef.current &&
        !navBarRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen)
      document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // ScrollTrigger Setup
  useGSAP(
    () => {
      scrollTriggersRef.current.forEach((t) => t?.kill?.());
      scrollTriggersRef.current = [];

      if (isMobile) return;

      const triggers = LINKS.map(({ id }) => {
        const section = document.getElementById(id);
        if (!section) return null;
        return ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveId(id);
              lastActiveIdRef.current = id;
              if (!isMouseOverNavRef.current) animateBarTo(id);
            } else {
              requestAnimationFrame(() => {
                const anyActive = ScrollTrigger.getAll().some(
                  (t) => t.isActive && LINKS.some((l) => l.id === t.trigger?.id)
                );
                if (!anyActive) {
                  setActiveId(null);
                  lastActiveIdRef.current = null;
                  if (!isMouseOverNavRef.current) hideBar();
                }
              });
            }
          },
        });
      }).filter(Boolean);
      scrollTriggersRef.current = triggers;
      return () => triggers.forEach((t) => t?.kill?.());
    },
    { dependencies: [smoother, isMobile, animateBarTo, hideBar] }
  );

  // Unmount cleanup
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      killAnimation(tweenRef);
      killAnimation(barTween);
      scrollTriggersRef.current.forEach((t) => t?.kill?.());
    };
  }, [clearAllTimeouts, killAnimation]);

  return (
    <div
      ref={navBarRef}
      style={{ opacity: isLoading ? 0 : 1 }}
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
                          fontSize: "var(--normal-text)",
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

          {isMobile && (
            <div className={styles.mobileToggle}>
              <HamBurger
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </div>
          )}
        </div>
      </Container>

      {/* MOVED OUTSIDE CONTAINER:
        These elements are now direct children of .navbar.
        This prevents Container padding from constricting the Overlay.
      */}
      {isMobile && shouldRenderMenu && (
        <>
          <div
            className={styles.mobileOverlay}
            ref={mobileOverlayRef}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className={styles.mobileMenu} ref={mobileMenuRef}>
            <div className={styles.mobileLinks} ref={mobileLinksRef}>
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
        </>
      )}
    </div>
  );
}
