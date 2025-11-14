"use client";
import React, { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import AutoScroll from "embla-carousel-auto-scroll";

const InfiniteScrollCarousel = ({
  children,
  speed = 1,
  direction = "forward",
  pauseOnHover = false,
  style = {},
  axis = "x",
  containerHeight,
  gap = 16,
  dragAble = false,
  wheelGesture = false,
  padding,
  pauseOnVideoPlay = false,
}) => {
  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(
    () => ({
      axis,
      loop: true,
      align: "start",
      containScroll: false,
      dragFree: false,
      watchDrag: dragAble,
      skipSnaps: false,
      inViewThreshold: 0,
    }),
    [axis, dragAble]
  );

  // Memoize plugins to prevent recreation on each render
  const plugins = useMemo(
    () =>
      [
        AutoScroll({
          speed,
          direction: direction === "forward" ? "forward" : "backward",
          stopOnInteraction: false,
          stopOnMouseEnter: pauseOnHover || pauseOnVideoPlay,
          startDelay: 0,
          playOnInit: true,
        }),
        wheelGesture ? WheelGesturesPlugin() : null,
      ].filter(Boolean),
    [speed, direction, pauseOnHover, wheelGesture, pauseOnVideoPlay]
  );

  const [emblaRef] = useEmblaCarousel(options, plugins);

  // Ultra-efficient duplication logic - memoized
  const duplicatedChildren = useMemo(() => {
    const childArray = React.Children.toArray(children);
    const count = childArray.length;

    // No duplication needed if enough content
    if (count >= 6) return childArray;

    if (count === 1)
      return [...childArray, ...childArray, ...childArray, ...childArray];
    if (count === 2) return [...childArray, ...childArray, ...childArray];
    return [...childArray, ...childArray]; // 3-5 items
  }, [children]);

  // Memoize styles to prevent recalculation
  const emblaStyles = useMemo(
    () => ({
      overflow: "hidden",
      width: "100%",
      height: axis === "y" ? containerHeight : "auto",
      ...style,
    }),
    [axis, containerHeight, style]
  );

  const containerStyles = useMemo(
    () => ({
      display: "flex",
      padding: padding ? padding : "",
      gap: `${gap}px`,
      ...(axis === "y" && {
        flexDirection: "column",
        height: containerHeight,
      }),
    }),
    [axis, containerHeight, gap, padding]
  );

  // Simplified slide styles - no manual margin management needed for interior slides
  const slideStyles = useMemo(
    () => ({
      flex: "0 0 auto",
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  return (
    <div style={emblaStyles} ref={emblaRef}>
      <div style={containerStyles}>
        {duplicatedChildren.map((child, index) => {
          const isLast = index === duplicatedChildren.length - 1;
          const lastMarginStyle =
            isLast && axis === "x"
              ? { marginRight: `${gap}px` }
              : isLast && axis === "y"
              ? { marginBottom: `${gap}px` }
              : {};

          return (
            <div
              key={`slide-${index}`}
              style={{ ...slideStyles, ...lastMarginStyle }}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InfiniteScrollCarousel;
