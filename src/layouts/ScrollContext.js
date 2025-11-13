"use client";
import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";
import ScrollSmoother from "gsap/ScrollSmoother";
import ScrollTrigger from "gsap/ScrollTrigger";
import NavBar from "@/components/NavBar/NavBar";

// Register plugins globally
if (typeof window !== "undefined" && !gsap.core.globals()["ScrollSmoother"]) {
  gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
}

const ScrollContext = createContext(null);

export function ScrollProvider({ children }) {
  const smootherRef = useRef(null);
  const cursorRef = useRef(null);

  const [smoother, setSmoother] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const MOBILE_BREAKPOINT = 768;
  const TABLET_BREAKPOINT = 1023;
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth <= MOBILE_BREAKPOINT
      : false
  );
  const [isTablet, setIsTablet] = useState(
    typeof window !== "undefined"
      ? window.innerWidth > MOBILE_BREAKPOINT &&
          window.innerWidth <= TABLET_BREAKPOINT
      : false
  );

  // Update mobile/tablet state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
      setIsTablet(
        window.innerWidth > MOBILE_BREAKPOINT &&
          window.innerWidth <= TABLET_BREAKPOINT
      );
      smootherRef.current?.refresh();
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize ScrollSmoother
  useLayoutEffect(() => {
    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");
    if (!wrapper || !content) return;

    try {
      smootherRef.current?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());

      const instance = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1,
        smoothTouch: 0.1,
        effects: true,
        normalizeScroll: true,
      });

      smootherRef.current = instance;
      setSmoother(instance);
      setIsReady(true);
    } catch (e) {
      console.warn("ScrollSmoother init failed:", e);
    }

    return () => {
      smootherRef.current?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      smootherRef.current = null;
      setIsReady(false);
    };
  }, []);

  // Pause smoother during loading
  useEffect(() => {
    smootherRef.current?.paused(isLoading);
  }, [isLoading]);

  // Cursor follower (desktop only)
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

  // Navigation helper
  const navigateToId = useCallback(
    (id, { duration = 1.5, ease = "power2.out", onComplete, onStart } = {}) => {
      if (!smootherRef.current) return;
      const target = document.getElementById(id);
      if (!target) return console.warn(`Element with id "${id}" not found`);

      try {
        onStart?.();
      } catch (e) {
        console.warn("onStart callback error:", e);
      }

      try {
        smootherRef.current.scrollTo(target, true);
        setTimeout(() => {
          onComplete?.();
        }, duration * 1000);
      } catch (e) {
        console.warn("navigateToId failed:", e);
      }
    },
    []
  );

  // Context value
  const value = {
    smoother,
    isReady,
    isMobile,
    isTablet,
    isLoading,
    setIsLoading,
    scrollTo: useCallback((target, smooth = true) => {
      smootherRef.current?.scrollTo(target, smooth);
    }, []),
    navigateToId,
    refresh: useCallback(() => smootherRef.current?.refresh(), []),
    waitForReady: useCallback(
      (callback) => {
        if (!callback || typeof callback !== "function") return;
        const check = () => {
          if (isReady && smootherRef.current) callback();
          else requestAnimationFrame(check);
        };
        check();
      },
      [isReady]
    ),
  };

  return (
    <ScrollContext.Provider value={value}>
      <NavBar />
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
      {!isMobile && !isTablet && (
        <div
          ref={cursorRef}
          style={{
            position: "fixed",
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
