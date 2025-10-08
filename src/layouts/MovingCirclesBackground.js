"use client";
import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";

const MovingCirclesBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const circlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const contextRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Pre-computed config
  const config = useMemo(() => {
    const circleCount = 55;
    const colors = ["#b5d42985", "#000000"]; // two distinct colors
    const randoms = new Float32Array(circleCount * 6);

    if (typeof window !== "undefined" && window.crypto) {
      const cryptoArray = new Uint32Array(circleCount * 6);
      window.crypto.getRandomValues(cryptoArray);
      for (let i = 0; i < cryptoArray.length; i++) {
        randoms[i] = cryptoArray[i] / 4294967295;
      }
    } else {
      for (let i = 0; i < randoms.length; i++) randoms[i] = Math.random();
    }

    return {
      CIRCLE_COUNT: circleCount,
      MIN_SPEED: 0.5,
      MAX_SPEED: 2,
      COLORS: colors,
      PRE_RANDOMS: randoms,
    };
  }, []);

  const [radiusRange, setRadiusRange] = useState({
    minRadius: 50,
    maxRadius: 180,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const vw = window.innerWidth;
      const minRadius = Math.max(50, vw * 0.15);
      const maxRadius = Math.min(180, vw * 0.25);
      setRadiusRange({ minRadius, maxRadius });
    }
  }, []);

  const initCircles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const { minRadius, maxRadius } = radiusRange;
    const rDiff = maxRadius - minRadius;
    const speedRange = config.MAX_SPEED - config.MIN_SPEED;

    let circles = circlesRef.current;
    if (circles.length !== config.CIRCLE_COUNT) {
      circles = new Array(config.CIRCLE_COUNT);
      circlesRef.current = circles;
    }

    const randoms = config.PRE_RANDOMS;
    const colorCount = config.COLORS.length;

    for (let i = 0; i < config.CIRCLE_COUNT; i++) {
      const base = i * 6;
      const r0 = randoms[base];
      const r1 = randoms[base + 1];
      const r2 = randoms[base + 2];
      const r3 = randoms[base + 3];
      const r4 = randoms[base + 4];
      const r5 = randoms[base + 5];

      if (!circles[i]) circles[i] = {};

      const c = circles[i];
      c.x = r0 * w;
      c.y = r1 * h;
      c.vx = (r2 - 0.5) * speedRange + config.MIN_SPEED;
      c.vy = (r3 - 0.5) * speedRange + config.MIN_SPEED;
      c.radius = r4 * rDiff + minRadius;
      c.colorIndex = Math.floor(r5 * colorCount); // ensures mixed colors
    }
  }, [config, radiusRange]);

  const updateCircles = useCallback((deltaTime) => {
    const circles = circlesRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !circles) return;

    const w = canvas.width;
    const h = canvas.height;
    const t = deltaTime * 60;

    for (let i = 0; i < circles.length; i++) {
      const c = circles[i];
      const nx = c.x + c.vx * t;
      const ny = c.y + c.vy * t;
      const r = c.radius;

      if (nx <= r) {
        c.x = r;
        c.vx = -c.vx;
      } else if (nx >= w - r) {
        c.x = w - r;
        c.vx = -c.vx;
      } else {
        c.x = nx;
      }

      if (ny <= r) {
        c.y = r;
        c.vy = -c.vy;
      } else if (ny >= h - r) {
        c.y = h - r;
        c.vy = -c.vy;
      } else {
        c.y = ny;
      }
    }
  }, []);

  const render = useCallback(() => {
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    const circles = circlesRef.current;
    if (!ctx || !canvas || !circles) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "source-over"; // normal blending for clarity

    const colors = config.COLORS;

    for (let colorIndex = 0; colorIndex < colors.length; colorIndex++) {
      const color = colors[colorIndex];
      ctx.fillStyle = color;

      // Glow only for #b5d42985
      if (color === "#b5d42985") {
        ctx.shadowBlur = 150;
        ctx.shadowColor = "#b5d429";
        ctx.globalCompositeOperation = "lighter"; // additive blending for glow
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.beginPath();
      for (let i = 0; i < circles.length; i++) {
        const c = circles[i];
        if (c.colorIndex === colorIndex) {
          ctx.moveTo(c.x + c.radius, c.y);
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }, [config.COLORS]);

  const animate = useCallback(
    (time) => {
      if (!isInitializedRef.current) return;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (delta > 0 && delta < 0.1) {
        updateCircles(delta);
        render();
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [updateCircles, render]
  );

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    if (!contextRef.current) {
      contextRef.current = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
    }

    const ctx = contextRef.current;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    initCircles();
  }, [initCircles]);

  const initialize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isInitializedRef.current) return;
    handleResize();
    isInitializedRef.current = true;
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
  }, [animate, handleResize]);

  useEffect(() => {
    if (typeof window !== "undefined") initialize();

    let resizeTimeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", throttledResize, { passive: true });
    }

    return () => {
      isInitializedRef.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", throttledResize);
      }
      clearTimeout(resizeTimeout);
    };
  }, [initialize, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
        filter: "blur(40px)", // crisp, deep glow
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    />
  );
};

export default MovingCirclesBackground;
