"use client";
import { useEffect, useRef, useState } from "react";

export default function FlowField({ compact = false }: { compact?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [complexity, setComplexity] = useState(3);
  const [seed, setSeed] = useState(0);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      animation = 0;
    const resize = () => {
      const size = element.getBoundingClientRect();
      element.width = size.width * Math.min(devicePixelRatio, 2);
      element.height = size.height * Math.min(devicePixelRatio, 2);
    };
    const draw = () => {
      const { width: w, height: h } = element;
      context.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) * 0.34;
      context.lineWidth = Math.max(0.8, w / 1000);
      for (let line = 0; line < 7; line++) {
        context.beginPath();
        context.strokeStyle = `hsla(${215 + line * 13 + seed * 25}, 72%, 58%, ${0.8 - line * 0.07})`;
        for (let i = 0; i < 1200; i++) {
          const t = (i / 1200) * Math.PI * 2;
          const phase = frame * 0.004 + line * 0.04 + seed * 0.3;
          const x =
            w / 2 +
            scale *
              (0.7 * Math.cos(t) + 0.28 * Math.cos(t * complexity + phase));
          const y =
            h / 2 +
            scale *
              (0.7 * Math.sin(t) - 0.28 * Math.sin(t * complexity + phase));
          if (i === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.stroke();
      }
      if (playing && !reduced.matches && !document.hidden) {
        frame++;
        animation = requestAnimationFrame(draw);
      }
    };
    const update = () => {
      cancelAnimationFrame(animation);
      draw();
    };
    const observer = new ResizeObserver(() => {
      resize();
      update();
    });
    observer.observe(element);
    reduced.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    resize();
    draw();
    return () => {
      cancelAnimationFrame(animation);
      observer.disconnect();
      reduced.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [playing, complexity, seed]);
  return (
    <div className={`flow-field ${compact ? "flow-compact" : ""}`}>
      <canvas
        ref={canvas}
        aria-label="Animated geometric curves inspired by nested cycles"
      />
      {!compact && (
        <div className="flow-controls">
          <button onClick={() => setPlaying(!playing)}>
            {playing ? "Pause" : "Play"}
          </button>
          <button onClick={() => setSeed(seed + 1)}>New variation</button>
          <label>
            Cycles{" "}
            <input
              type="range"
              min="2"
              max="9"
              value={complexity}
              onChange={(event) => setComplexity(Number(event.target.value))}
            />
            <span>{complexity}</span>
          </label>
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.download = "jitendra-flow-field.png";
              a.href = canvas.current?.toDataURL("image/png") ?? "";
              a.click();
            }}
          >
            Save image
          </button>
        </div>
      )}
    </div>
  );
}
