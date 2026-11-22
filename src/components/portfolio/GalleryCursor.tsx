"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiArrowUpRight } from "react-icons/fi";

export default function GalleryCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    const element = cursor.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
      fine = matchMedia("(pointer: fine)");
    let frame = 0,
      x = 0,
      y = 0,
      tx = 0,
      ty = 0,
      visible = false;
    const hide = () => {
      visible = false;
      element.dataset.active = "false";
    };
    const animate = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      element.style.transform = `translate3d(${x - 34}px,${y - 34}px,0)`;
      frame =
        visible && Math.abs(tx - x) + Math.abs(ty - y) > 0.2
          ? requestAnimationFrame(animate)
          : 0;
    };
    const move = (event: PointerEvent) => {
      if (
        reduced.matches ||
        !fine.matches ||
        !(event.target instanceof Element)
      ) {
        hide();
        return;
      }
      const card = event.target.closest(".project-card");
      if (!card) {
        hide();
        return;
      }
      tx = event.clientX;
      ty = event.clientY;
      if (!visible) {
        x = tx;
        y = ty;
        visible = true;
      }
      element.dataset.active = "true";
      if (!frame) frame = requestAnimationFrame(animate);
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    reduced.addEventListener("change", hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      reduced.removeEventListener("change", hide);
    };
  }, [ready]);
  if (!ready) return null;
  return createPortal(
    <div className="gallery-cursor" ref={cursor} aria-hidden="true">
      <FiArrowUpRight />
      <span>View</span>
    </div>,
    document.body,
  );
}
