import React, { useEffect, useRef, useState } from "react";

const calculateSize = (width) => {
  if (width <= 480) {
    return Math.min(220, width - 40);
  }

  if (width <= 768) {
    return Math.min(280, width - 60);
  }

  return 400;
};

const getWindowWidth = () => (typeof window !== "undefined" ? window.innerWidth : 1024);

const AsciiPortrait = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const mouseTargetRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const startTimeRef = useRef(null);
  const [size, setSize] = useState(() => calculateSize(getWindowWidth()));
  const [dataReady, setDataReady] = useState(false);

  const chars = " .:-=+*#%@".split("");

  useEffect(() => {
    const updateSize = () => {
      setSize(calculateSize(getWindowWidth()));
    };

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const processImage = (img, targetSize) => {
    const canvasWidth = targetSize;
    const canvasHeight = targetSize;
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");

    offscreen.width = canvasWidth;
    offscreen.height = canvasHeight;

    const scale = 0.8;
    const imgAspect = img.width / img.height;

    let drawHeight = canvasHeight * scale;
    let drawWidth = drawHeight * imgAspect;

    if (drawWidth > canvasWidth * scale) {
      drawWidth = canvasWidth * scale;
      drawHeight = drawWidth / imgAspect;
    }

    const offsetX = (canvasWidth - drawWidth) / 2;
    const offsetY = (canvasHeight - drawHeight) / 2;

    offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    const imageData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = imageData.data;
    const rawParticles = [];
    const fontSize = targetSize <= 280 ? 5 : 7;
    const colGap = fontSize * 0.7;
    const rowGap = fontSize * 1.1;

    for (let y = 0; y < canvasHeight; y += rowGap) {
      for (let x = 0; x < canvasWidth; x += colGap) {
        const i = (Math.floor(y) * canvasWidth + Math.floor(x)) * 4;
        const alpha = pixels[i + 3];

        if (alpha > 128) {
          const red = pixels[i];
          const green = pixels[i + 1];
          const blue = pixels[i + 2];
          const brightness = (red + green + blue) / (3 * 255);
          const charIndex = Math.floor(brightness * (chars.length - 1));

          rawParticles.push({
            x: Number(x.toFixed(1)),
            y: Number(y.toFixed(1)),
            targetX: Number(x.toFixed(1)),
            targetY: Number(y.toFixed(1)),
            vx: 0,
            vy: 0,
            char: chars[charIndex],
            alpha: Number((0.4 + brightness * 0.6).toFixed(2)),
          });
        }
      }
    }

    return rawParticles;
  };

  useEffect(() => {
    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = "/pic.png";
    img.onload = () => {
      if (cancelled) return;

      particlesRef.current = processImage(img, size);
      setDataReady(true);
      startTimeRef.current = performance.now();
    };

    img.onerror = () => {
      if (!cancelled) {
        particlesRef.current = [];
        setDataReady(false);
      }
    };

    return () => {
      cancelled = true;
    };
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, size, size);

      if (!dataReady || !particlesRef.current.length) return;

      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const mouse = mouseRef.current;
      const mouseTarget = mouseTargetRef.current;
      const isMobileSize = size <= 280;
      const fontSize = isMobileSize ? 5 : 7;

      mouse.x += (mouseTarget.x - mouse.x) * 0.15;
      mouse.y += (mouseTarget.y - mouse.y) * 0.15;

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      particlesRef.current.forEach((particle) => {
        const fadeProgress = Math.min(elapsed / 1.4, 1);
        const easedFade = 1 - Math.pow(1 - fadeProgress, 2);
        const shimmer = Math.sin(elapsed * 2 + particle.x * 0.05 + particle.y * 0.03) * 0.05;
        const alpha = Math.max(0, particle.alpha * easedFade + shimmer);

        const dxToTarget = particle.targetX - particle.x;
        const dyToTarget = particle.targetY - particle.y;
        particle.vx += dxToTarget * 0.015;
        particle.vy += dyToTarget * 0.015;

        if (mouse.active) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = size * 0.18;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 3.5;
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
          }
        }

        particle.vx *= 0.9;
        particle.vy *= 0.9;
        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.fillStyle = `rgba(100, 255, 218, ${alpha})`;
        ctx.fillText(particle.char, particle.x, particle.y);
      });
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseTargetRef.current.x = event.clientX - rect.left;
      mouseTargetRef.current.y = event.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleTouchMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      mouseTargetRef.current.x = touch.clientX - rect.left;
      mouseTargetRef.current.y = touch.clientY - rect.top;
      mouseRef.current.active = true;
      if (event.cancelable) event.preventDefault();
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
      mouseTargetRef.current.x = -1000;
      mouseTargetRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleLeave);

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleLeave);
    };
  }, [size, dataReady]);

  return (
    <canvas
      ref={canvasRef}
      className="simulation-container"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "block",
        cursor: "default",
        touchAction: "none",
        background: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    />
  );
};

export default AsciiPortrait;