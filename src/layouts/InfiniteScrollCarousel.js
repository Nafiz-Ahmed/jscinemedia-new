"use client";
import React, { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

const InfiniteScrollCarousel = ({
  children,
  speed = 1,
  direction = "forward",
  pauseOnHover = false,
  style = {},
  axis = "x",
  containerHeight,
  gap = 16,
  padding,
}) => {
  const options = useMemo(
    () => ({
      axis,
      loop: true,
      align: "start",
      containScroll: false,
      dragFree: true,
      watchDrag: true,
      skipSnaps: false,
      inViewThreshold: 0,
    }),
    [axis]
  );

  const plugins = useMemo(
    () => [
      AutoScroll({
        speed,
        direction: direction === "forward" ? "forward" : "backward",
        stopOnInteraction: false,
        stopOnMouseEnter: pauseOnHover,
        startDelay: 0,
        playOnInit: true,
      }),
      WheelGesturesPlugin({
        // ✅ Add wheel support
        forceWheelAxis: axis, // lock to 'x' or 'y'
        wheelDraggingClass: "is-wheel-dragging",
      }),
    ],
    [speed, direction, pauseOnHover, axis]
  );

  const [emblaRef] = useEmblaCarousel(options, plugins);

  const duplicatedChildren = useMemo(() => {
    const childArray = React.Children.toArray(children);
    const count = childArray.length;

    if (count >= 6) return childArray;
    if (count === 1)
      return [...childArray, ...childArray, ...childArray, ...childArray];
    if (count === 2) return [...childArray, ...childArray, ...childArray];
    return [...childArray, ...childArray];
  }, [children]);

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
