"use client";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis"; // Make sure to install: npm i lenis
import NavBar from "@/components/NavBar/NavBar";

// Register ScrollTrigger (ScrollSmoother is no longer needed)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ScrollContext = createContext(null);

export function ScrollProvider({ children }) {
  // Refs
  const lenisRef = useRef(null);
  const cursorRef = useRef(null);
  const tickerRef = useRef(null);

  // State
  const [lenisInstance, setLenisInstance] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Breakpoints
  const MOBILE_BREAKPOINT = 768;
  const TABLET_BREAKPOINT = 1023;
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // 1. Handle Resize & Breakpoints
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= MOBILE_BREAKPOINT);
      setIsTablet(w > MOBILE_BREAKPOINT && w <= TABLET_BREAKPOINT);
      // Lenis auto-resizes, but we force ScrollTrigger to check positions
      ScrollTrigger.refresh();
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Initialize Lenis (Replaces ScrollSmoother)
  useLayoutEffect(() => {
    // Cleanup previous instances
    if (lenisRef.current) lenisRef.current.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false, // Lenis usually recommends native touch on mobile
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // --- CRITICAL: Sync Lenis with GSAP ScrollTrigger ---
    lenis.on("scroll", ScrollTrigger.update);

    // Create a ticker to update Lenis on every GSAP frame
    tickerRef.current = (time) => {
      lenis.raf(time * 1000);
    };

    // Add to GSAP ticker and disable lag smoothing for instant sync
    gsap.ticker.add(tickerRef.current);
    gsap.ticker.lagSmoothing(0);

    setIsReady(true);

    return () => {
      // Cleanup
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      setIsReady(false);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // 3. Pause/Resume Logic (Mapped to Loading)
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isLoading) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isLoading]);

  // 4. Cursor Follower (Unchanged)
  useEffect(() => {
    if (!cursorRef.current || isMobile || isTablet) return;

    const cursor = cursorRef.current;
    gsap.set(cursor, { opacity: 0, scale: 0 });

    const moveCursor = (e) =>
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
        opacity: 1,
        scale: 1,
      });

    const hideCursor = () =>
      gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.2 });

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", hideCursor);
    window.addEventListener("mousedown", () =>
      gsap.to(cursor, { scale: 0.8, duration: 0.2 })
    );
    window.addEventListener("mouseup", () =>
      gsap.to(cursor, { scale: 1, duration: 0.2 })
    );

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", hideCursor);
      window.removeEventListener("mousedown", () => {});
      window.removeEventListener("mouseup", () => {});
    };
  }, [isMobile, isTablet]);

  // 5. Navigate Helper (Refactored for Lenis)
  const navigateToId = useCallback(
    (id, { duration = 1.5, ease, onComplete, onStart } = {}) => {
      if (!lenisRef.current) return;
      const target = document.getElementById(id);
      if (!target) return console.warn(`Element with id "${id}" not found`);

      try {
        if (onStart) onStart();

        lenisRef.current.scrollTo(target, {
          duration: duration, // Lenis accepts duration in seconds usually, or depends on config
          // Note: Lenis default scrollTo uses its internal easing.
          // If you need specific easing you might need a GSAP tween of the scroll position,
          // but usually Lenis native scrollTo is smoother.
          lock: true,
          onComplete: () => {
            if (onComplete) onComplete();
          },
        });
      } catch (e) {
        console.warn("navigateToId failed:", e);
      }
    },
    []
  );

  // 6. Context Value Construction
  const value = useMemo(
    () => ({
      // We map 'lenis' to 'smoother' to keep your app from breaking if it uses context.smoother
      smoother: lenisInstance,
      lenis: lenisInstance, // New standard key
      isReady,
      isMobile,
      isTablet,
      isLoading,
      setIsLoading,
      scrollTo: (target, smooth = true) => {
        lenisRef.current?.scrollTo(target, { immediate: !smooth });
      },
      navigateToId,
      refresh: () => {
        lenisRef.current?.resize();
        ScrollTrigger.refresh();
      },
      waitForReady: (callback) => {
        if (!callback || typeof callback !== "function") return;
        const check = () => {
          if (lenisRef.current) callback();
          else requestAnimationFrame(check);
        };
        check();
      },
    }),
    [lenisInstance, isReady, isMobile, isTablet, isLoading, navigateToId]
  );

  return (
    <ScrollContext.Provider value={value}>
      <NavBar />
      {/* NOTE: I removed <div id="smooth-wrapper"> because Lenis works best 
         scrolling the html/body directly. This is cleaner and less buggy.
      */}
      {children}

      {!isMobile && !isTablet && (
        <div
          id="custom-cursor"
          ref={cursorRef}
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#b4d429",
            pointerEvents: "none",
            zIndex: 999999,
            transform: "translate(-50%, -50%)",
            mixBlendMode: "difference",
          }}
        />
      )}
    </ScrollContext.Provider>
  );
}

// --- Hooks (Unchanged) ---
export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context)
    throw new Error("useScroll must be used within a ScrollProvider");
  return context;
};

export const useScrollRefresh = () => {
  const { refresh } = useScroll();
  return refresh;
};

export const useNavigateToId = () => {
  const { navigateToId } = useScroll();
  return navigateToId;
};
