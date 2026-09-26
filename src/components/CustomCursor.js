import { html, useEffect, useRef, useState } from "../utils/html.js";

/**
 * Desktop Custom Cursor with RequestAnimationFrame Lerp & Context-Aware Expansion
 */
export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [cursorText, setCursorText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768 || "ontouchstart" in window) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = null;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      const target = e.target;
      const interactive = target
        ? target.closest("[data-cursor]") ||
          target.closest("button") ||
          target.closest("a")
        : null;

      if (interactive) {
        const label = interactive.getAttribute("data-cursor") || "EXPLORE";
        setCursorText(label);
        setIsExpanded(true);
      } else {
        setCursorText("");
        setIsExpanded(false);
      }
    };

    const renderCursor = () => {
      rafId = requestAnimationFrame(renderCursor);
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    renderCursor();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return html`
    <div className="custom-cursor-layer" aria-hidden="true">
      <div ref=${dotRef} className="cursor-dot" />
      <div
        ref=${ringRef}
        className=${`cursor-ring ${isExpanded ? "is-expanded" : ""}`}
      >
        <span className="cursor-ring-label">${cursorText}</span>
      </div>
    </div>
  `;
}
