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
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen";

// Register plugins once globally
if (typeof window !== "undefined" && !gsap.core.globals()["ScrollSmoother"]) {
  gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
}

const ScrollContext = createContext(null);

export function ScrollProvider({ children }) {
  const smootherRef = useRef(null);
  const isInitializingRef = useRef(false);
  const lastWindowSizeRef = useRef({ w: 0, h: 0 });
  const lastContentSizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef(null);
  const initTimeoutRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const refreshTimeoutRef = useRef(null);
  const tweenRef = useRef(null);
  const orientationTimeoutRef = useRef(null);
  const lastRefreshTimeRef = useRef(0);
  const scrollEndTimeoutRef = useRef(null);
  const updateCounterRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  const [smoother, setSmoother] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const MOBILE_BREAKPOINT = 768;
  const TABLET_BREAKPOINT = 1023;
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= MOBILE_BREAKPOINT;
    }
    return false;
  });
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        window.innerWidth > MOBILE_BREAKPOINT &&
        window.innerWidth <= TABLET_BREAKPOINT
      );
    }
    return false;
  });

  useEffect(() => {
    if (!smoother) return;
    smoother.paused(isLoading);
  }, [isLoading, smoother]);

  // Global mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
      setIsTablet(
        window.innerWidth > MOBILE_BREAKPOINT &&
          window.innerWidth <= TABLET_BREAKPOINT
      );
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Enhanced debounced refresh with throttling
  const debouncedRefresh = useCallback((delay = 50, source = "unknown") => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTimeRef.current;

    // Minimum time between refreshes to prevent excessive calls
    if (timeSinceLastRefresh < 50 && source !== "manual") {
      return;
    }

    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);

    refreshTimeoutRef.current = setTimeout(() => {
      if (smootherRef.current && ScrollTrigger) {
        if (process.env.NODE_ENV === "development") {
          console.log(`ScrollTrigger refresh triggered by: ${source}`);
        }

        try {
          lastRefreshTimeRef.current = Date.now();
          ScrollTrigger.refresh();
          if (
            smootherRef.current &&
            typeof smootherRef.current.refresh === "function"
          ) {
            smootherRef.current.refresh();
          }
        } catch (error) {
          console.warn("Refresh failed:", error);
        }
      }
    }, delay);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Clear all timeouts and animation frames
    [
      rafRef,
      initTimeoutRef,
      refreshTimeoutRef,
      orientationTimeoutRef,
      scrollEndTimeoutRef,
    ].forEach((ref) => {
      if (ref.current) {
        if (ref === rafRef) {
          cancelAnimationFrame(ref.current);
        } else {
          clearTimeout(ref.current);
        }
        ref.current = null;
      }
    });

    // Kill active tweens
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }

    // Disconnect resize observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    // Kill smoother instance
    if (smootherRef.current) {
      try {
        smootherRef.current.kill();
      } catch (error) {
        console.warn("Error killing smoother:", error);
      }
      smootherRef.current = null;
    }

    // Kill all ScrollTrigger instances
    try {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    } catch (error) {
      console.warn("Error killing ScrollTriggers:", error);
    }

    setSmoother(null);
    setIsReady(false);
    isInitializingRef.current = false;
    updateCounterRef.current = 0;
  }, []);

  // Setup ResizeObserver with better threshold handling
  const setupResizeObserver = useCallback(() => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    try {
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;

          // Reasonable threshold to avoid sub-pixel changes but catch real resizes
          const threshold = 5;
          const widthChanged =
            Math.abs(width - lastContentSizeRef.current.w) > threshold;
          const heightChanged =
            Math.abs(height - lastContentSizeRef.current.h) > threshold;

          if (widthChanged || heightChanged) {
            lastContentSizeRef.current = { w: width, h: height };
            debouncedRefresh(100, "content-resize");
          }
        }
      });

      const content = document.getElementById("smooth-content");
      if (content) {
        resizeObserverRef.current.observe(content);
        const rect = content.getBoundingClientRect();
        lastContentSizeRef.current = { w: rect.width, h: rect.height };
      }
    } catch (error) {
      console.warn("ResizeObserver setup failed:", error);
    }
  }, [debouncedRefresh]);

  // Create smoother with proper GSAP mobile configuration
  const createSmoother = useCallback(() => {
    if (isInitializingRef.current) return;

    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");

    if (!wrapper || !content) {
      rafRef.current = requestAnimationFrame(createSmoother);
      return;
    }

    isInitializingRef.current = true;

    try {
      // Kill existing instance
      const existing = ScrollSmoother.get();
      if (existing) {
        existing.kill();
      }

      // Create new instance with safe configuration
      const instance = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        smoothTouch: 0.1,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
        onUpdate: function (self) {
          // Safe onUpdate callback - only refresh occasionally to prevent stuck animations
          updateCounterRef.current++;

          // Clear any existing timeout
          if (scrollEndTimeoutRef.current) {
            clearTimeout(scrollEndTimeoutRef.current);
          }

          // Refresh occasionally during scroll (every 100 updates, roughly)
          if (updateCounterRef.current % 100 === 0) {
            scrollEndTimeoutRef.current = setTimeout(() => {
              debouncedRefresh(150, "scroll-update-periodic");
            }, 200);
          }
        },
      });

      if (!instance) {
        throw new Error("Failed to create ScrollSmoother instance");
      }

      smootherRef.current = instance;
      setSmoother(instance);

      // Initialize with delay
      initTimeoutRef.current = setTimeout(() => {
        try {
          setIsReady(true);
          isInitializingRef.current = false;
          ScrollTrigger.refresh();
          setupResizeObserver();

          if (process.env.NODE_ENV === "development") {
            console.log("ScrollSmoother initialized successfully");
          }
        } catch (error) {
          console.warn("ScrollSmoother initialization failed:", error);
          isInitializingRef.current = false;
        }
      }, 150);
    } catch (error) {
      console.warn("ScrollSmoother creation failed:", error);
      isInitializingRef.current = false;

      // Fallback: try again after a delay
      setTimeout(() => {
        if (!smootherRef.current) {
          rafRef.current = requestAnimationFrame(createSmoother);
        }
      }, 1000);
    }
  }, [setupResizeObserver, debouncedRefresh]);

  // Window resize handler
  const handleWindowResize = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Skip if window size hasn't actually changed
    if (
      w === lastWindowSizeRef.current.w &&
      h === lastWindowSizeRef.current.h
    ) {
      return;
    }

    lastWindowSizeRef.current = { w, h };
    setIsReady(false);

    if (smootherRef.current) {
      try {
        debouncedRefresh(100, "window-resize");
        setTimeout(() => setIsReady(true), 150);
        return;
      } catch (error) {
        console.warn("Window resize refresh failed, recreating:", error);
      }
    }

    // Full recreation if smoother is broken
    cleanup();
    rafRef.current = requestAnimationFrame(createSmoother);
  }, [cleanup, createSmoother, debouncedRefresh]);

  // Orientation change handling
  useEffect(() => {
    const handleOrientationChange = () => {
      if (orientationTimeoutRef.current) {
        clearTimeout(orientationTimeoutRef.current);
      }

      setIsReady(false);

      orientationTimeoutRef.current = setTimeout(() => {
        try {
          if (smootherRef.current && ScrollTrigger) {
            ScrollTrigger.refresh(true);
            if (typeof smootherRef.current.refresh === "function") {
              smootherRef.current.refresh();
            }
            setIsReady(true);

            if (process.env.NODE_ENV === "development") {
              console.log("Orientation change refresh completed");
            }
          } else {
            // Recreate if smoother is missing
            cleanup();
            rafRef.current = requestAnimationFrame(createSmoother);
          }
        } catch (error) {
          console.warn("Orientation change refresh failed:", error);
          cleanup();
          rafRef.current = requestAnimationFrame(createSmoother);
        }
      }, 400);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [cleanup, createSmoother]);

  // Throttled resize handler
  useLayoutEffect(() => {
    let ticking = false;

    const throttledWindowResize = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleWindowResize();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("resize", throttledWindowResize, { passive: true });

    // Set initial window size
    if (typeof window !== "undefined") {
      lastWindowSizeRef.current = {
        w: window.innerWidth,
        h: window.innerHeight,
      };
    }

    return () => {
      window.removeEventListener("resize", throttledWindowResize);
    };
  }, [handleWindowResize]);

  // Initial setup
  useLayoutEffect(() => {
    rafRef.current = requestAnimationFrame(createSmoother);
    return cleanup;
  }, [createSmoother, cleanup]);

  useEffect(() => {
    if (isReady && smootherRef.current) {
      // Scroll to top when smoother is ready
      try {
        smootherRef.current.scrollTo(0, false); // Immediate scroll to top (no smooth animation)
        if (process.env.NODE_ENV === "development") {
          console.log("Scrolled to top on page load/refresh");
        }
      } catch (error) {
        console.warn("Failed to scroll to top on page load:", error);
      }
    }
  }, [isReady]);

  // Page lifecycle events
  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) {
        setIsReady(false);
        if (smootherRef.current) {
          debouncedRefresh(50, "pageshow");
          setTimeout(() => setIsReady(true), 100);
        } else {
          rafRef.current = requestAnimationFrame(createSmoother);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && smootherRef.current) {
        debouncedRefresh(100, "visibility-change");
      }
    };

    // Handle viewport changes (especially iOS)
    const handleViewportChange = () => {
      // Simple iOS detection
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS && smootherRef.current) {
        // Set CSS custom property for viewport height
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);

        // Refresh after viewport change
        setTimeout(() => {
          debouncedRefresh(150, "ios-viewport-change");
        }, 100);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleViewportChange, { passive: true });

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [createSmoother, debouncedRefresh]);

  // Scroll end detection for additional stability
  useEffect(() => {
    let scrollTimer = null;
    let lastScrollTime = 0;

    const handleScrollEnd = () => {
      const now = Date.now();
      if (now - lastScrollTime > 150 && smootherRef.current) {
        debouncedRefresh(200, "scroll-end");
      }
    };

    const handleScroll = () => {
      lastScrollTime = Date.now();
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(handleScrollEnd, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [debouncedRefresh]);

  // HMR cleanup for development
  if (
    process.env.NODE_ENV === "development" &&
    typeof module !== "undefined" &&
    module.hot
  ) {
    module.hot.dispose(cleanup);
  }

  // Navigation functionality with error handling
  const navigateToId = useCallback(
    (id, options = {}) => {
      const {
        duration = 1.5,
        ease = "power2.out",
        offset = "top top",
        onComplete = null,
        onStart = null,
      } = options;

      // Kill any existing navigation tween
      if (tweenRef.current) {
        tweenRef.current.kill();
        tweenRef.current = null;
      }

      const performNavigation = () => {
        const targetElement = document.getElementById(id);

        if (!targetElement) {
          console.warn(`Element with id "${id}" not found`);
          return;
        }

        if (onStart) {
          try {
            onStart();
          } catch (error) {
            console.warn("Navigation onStart callback error:", error);
          }
        }

        // Try GSAP navigation first
        if (
          smootherRef.current &&
          typeof smootherRef.current.offset === "function"
        ) {
          try {
            const dest = smootherRef.current.offset(`#${id}`, offset);
            tweenRef.current = gsap.to(smootherRef.current, {
              scrollTop: dest,
              duration,
              ease,
              onComplete: () => {
                tweenRef.current = null;
                // Refresh after navigation
                setTimeout(() => {
                  debouncedRefresh(50, "navigation-complete");
                }, 100);

                if (onComplete) {
                  try {
                    onComplete();
                  } catch (error) {
                    console.warn(
                      "Navigation onComplete callback error:",
                      error
                    );
                  }
                }
              },
              onInterrupt: () => {
                tweenRef.current = null;
              },
            });
            return;
          } catch (error) {
            console.warn("GSAP scroll navigation failed:", error);
          }
        }

        // Fallback to native scrolling
        try {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          if (onComplete) {
            setTimeout(() => {
              try {
                onComplete();
              } catch (error) {
                console.warn(
                  "Navigation fallback onComplete callback error:",
                  error
                );
              }
            }, duration * 1000);
          }
        } catch (error) {
          console.warn("Native scroll navigation failed:", error);
        }
      };

      // Execute navigation when ready
      if (isReady && smootherRef.current) {
        performNavigation();
      } else {
        // Wait for smoother to be ready
        const checkReady = () => {
          if (isReady && smootherRef.current) {
            setTimeout(performNavigation, 50);
          } else {
            setTimeout(checkReady, 50);
          }
        };
        checkReady();
      }
    },
    [isReady, debouncedRefresh]
  );

  // Context value with error handling
  const value = {
    smoother,
    isReady,
    isMobile,
    isTablet,
    isLoading,
    setIsLoading,
    scrollTo: useCallback((target, smooth = true) => {
      try {
        if (
          smootherRef.current &&
          typeof smootherRef.current.scrollTo === "function"
        ) {
          smootherRef.current.scrollTo(target, smooth);
        }
      } catch (error) {
        console.warn("ScrollTo failed:", error);
      }
    }, []),
    navigateToId,
    refresh: useCallback(
      (source = "manual") => {
        debouncedRefresh(0, source);
      },
      [debouncedRefresh]
    ),
    waitForReady: useCallback(
      (callback) => {
        if (typeof callback !== "function") {
          console.warn("waitForReady: callback must be a function");
          return;
        }

        if (isReady && smootherRef.current) {
          setTimeout(() => {
            try {
              callback();
            } catch (error) {
              console.warn("waitForReady callback error:", error);
            }
          }, 50);
        } else {
          const checkReady = () => {
            if (isReady && smootherRef.current) {
              setTimeout(() => {
                try {
                  callback();
                } catch (error) {
                  console.warn("waitForReady callback error:", error);
                }
              }, 50);
            } else {
              setTimeout(checkReady, 50);
            }
          };
          checkReady();
        }
      },
      [isReady]
    ),
  };

  return (
    <ScrollContext.Provider value={value}>
      {/* <LoadingScreen
        loadingTimeline={loadingTimelineRef}
        setIsLoading={setIsLoading}
      /> */}
      <NavBar />
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
    </ScrollContext.Provider>
  );
}

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within ScrollProvider");
  }
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
