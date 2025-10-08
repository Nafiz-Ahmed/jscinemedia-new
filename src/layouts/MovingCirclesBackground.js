import React, { useEffect, useRef } from "react";

const MovingCirclesBackground = ({
  circleCount = 40,
  minRadius = 120,
  maxRadius = 230,
  blackRatio = 0.7,
  glowColor = "#b4d429",
  glowIntensity = 60,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const circlesRef = useRef([]);
  const lastTimeRef = useRef(0);

  const config = {
    count: circleCount,
    minSpeed: 0.9,
    maxSpeed: 2,
    blackRatio,
    glowIntensity,
    glowColor,
    minRadius,
    maxRadius,
  };

  const initCircles = (canvas) => {
    const circles = [];

    const blackCount = Math.floor(config.count * config.blackRatio);
    const glowCount = config.count - blackCount;

    const allColors = [
      ...Array(blackCount).fill("#000000"),
      ...Array(glowCount).fill(config.glowColor),
    ];

    // Shuffle colors for random distribution
    allColors.sort(() => Math.random() - 0.5);

    for (let i = 0; i < config.count; i++) {
      const speed =
        (Math.random() - 0.5) * (config.maxSpeed - config.minSpeed) +
        config.minSpeed;
      const radius =
        Math.random() * (config.maxRadius - config.minRadius) +
        config.minRadius;

      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: speed,
        vy: speed,
        radius,
        color: allColors[i],
        z: Math.random(),
      });
    }

    circlesRef.current = circles.sort((a, b) => a.z - b.z);
  };

  const animate = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = time;

    circlesRef.current.forEach((c) => {
      c.x += c.vx * delta * 60;
      c.y += c.vy * delta * 60;

      if (c.x - c.radius <= 0 || c.x + c.radius >= canvas.width) {
        c.vx *= -1;
        c.x = Math.max(c.radius, Math.min(canvas.width - c.radius, c.x));
      }
      if (c.y - c.radius <= 0 || c.y + c.radius >= canvas.height) {
        c.vy *= -1;
        c.y = Math.max(c.radius, Math.min(canvas.height - c.radius, c.y));
      }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circlesRef.current.forEach((c) => {
      if (c.color === config.glowColor) {
        ctx.shadowBlur = config.glowIntensity;
        ctx.shadowColor = config.glowColor;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0;
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    initCircles(canvas);
  };

  useEffect(() => {
    handleResize();
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -10,
        pointerEvents: "none",
        filter: "blur(75px)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default MovingCirclesBackground;
