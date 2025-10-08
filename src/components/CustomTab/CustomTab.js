import { useRef, useState, useCallback, useEffect } from "react";
import styles from "./CustomTab.module.css";
import { gsap } from "gsap";
import GradientText from "@/layouts/GradientText";

/**
 * CustomTab component for animated active bar between two (or more) options.
 * @param {Object} props
 * @param {Array<{id: string, label: string}>} props.elements - Tab options
 * @param {string} props.defaultSelected - The id of the default selected tab
 * @param {boolean} [props.constantSelected] - If true, only hover swap works, click does not change active
 * @param {function} [props.onChange] - Callback when active changes (not called if constantSelected)
 */
export default function CustomTab({
  elements = [],
  defaultSelected,
  constantSelected = false,
  selected,
  onChange,
}) {
  // If 'selected' is provided, use it as the active tab (controlled mode)
  const isControlled = selected !== undefined && selected !== null;
  const [internalActiveId, setInternalActiveId] = useState(defaultSelected);
  const activeId = isControlled ? selected : internalActiveId;
  const [hoveredId, setHoveredId] = useState(null);
  const barRef = useRef(null);
  const containerRef = useRef(null);
  const tabRefs = useRef({});
  const barTween = useRef(null);

  // Animate bar to a tab
  const animateBarTo = useCallback((id, immediate = false) => {
    if (!id || !barRef.current || !containerRef.current) return;
    const tabEl = tabRefs.current[id];
    if (!tabEl) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();
    const position = {
      left: tabRect.left - containerRect.left,
      top: tabRect.top - containerRect.top,
      width: tabRect.width,
      height: tabRect.height,
    };
    if (barTween.current) barTween.current.kill();
    if (immediate) {
      gsap.set(barRef.current, {
        ...position,
        opacity: 1,
        borderRadius: "7px",
        clearProps: "transform",
      });
    } else {
      barTween.current = gsap.to(barRef.current, {
        ...position,
        opacity: 1,
        borderRadius: "7px",
        duration: 0.36,
        ease: "power3.out",
      });
    }
  }, []);

  // Hide bar
  const hideBar = useCallback(() => {
    if (!barRef.current) return;
    if (barTween.current) barTween.current.kill();
    barTween.current = gsap.to(barRef.current, {
      opacity: 0,
      duration: 0.18,
      ease: "power2.out",
    });
  }, []);

  // On hover
  const handleMouseEnter = (id) => {
    setHoveredId(id);
    animateBarTo(id);
  };
  const handleMouseLeave = () => {
    setHoveredId(null);
    animateBarTo(activeId);
  };

  // On click
  const handleClick = (id) => {
    const clickedTab = elements.find((el) => el.id === id);

    // Call its accessibility function if it exists
    if (clickedTab?.accessibility) clickedTab.accessibility();

    if (constantSelected || isControlled) return;
    setInternalActiveId(id);
    if (onChange) onChange(id);
  };

  // Animate bar on mount and when activeId changes
  useEffect(() => {
    if (activeId) animateBarTo(activeId, true);
  }, [activeId, animateBarTo]);

  // Hide bar if nothing selected
  useEffect(() => {
    if (!activeId && !hoveredId) hideBar();
  }, [activeId, hoveredId, hideBar]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (barTween.current) barTween.current.kill();
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {elements.map(({ id, label }) => (
        <div
          key={id}
          ref={(el) => (tabRefs.current[id] = el)}
          className={`${styles.tab} ${activeId === id ? styles.active : ""}`}
          onMouseEnter={() => handleMouseEnter(id)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(id)}
          style={{ userSelect: "none" }}
        >
          {activeId === id ? (
            <GradientText
              style={{
                fontSize: "var(--small-text)",
                fontWeight: 500,
                fontFamily: "var(--font-satoshi)",
                textTransform: "capitalize",
              }}
            >
              {label}
            </GradientText>
          ) : (
            label
          )}
        </div>
      ))}
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
    </div>
  );
}
