import { useEffect, useRef, useState } from "react";
import avatar from "../assets/TrishtianW.png";

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v, fromMin, fromMax, toMin, toMax) =>
  round(toMin + ((toMax - toMin) * (v - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export default function ProfileCard() {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;

    const update = (offsetX, offsetY) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const props = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(
          Math.hypot(percentY - 50, percentX - 50) / 50,
          0,
          1
        )}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(props).forEach(([k, v]) => wrap.style.setProperty(k, v));
    };

    const smoothAnimation = (duration, startX, startY) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const loop = (now) => {
        const progress = clamp(((now - startTime) / duration) * 100, 0, 100);
        const eased = easeInOutCubic(progress / 100);
        update(
          adjust(eased, 0, 1, startX, targetX),
          adjust(eased, 0, 1, startY, targetY)
        );
        if (progress < 100) rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    };

    const cancel = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onEnter = () => {
      cancel();
      setActive(true);
    };

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      update(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onLeave = (e) => {
      const rect = card.getBoundingClientRect();
      smoothAnimation(600, e.clientX - rect.left, e.clientY - rect.top);
      setActive(false);
    };

    update(wrap.clientWidth - 70, 60);
    smoothAnimation(1500, wrap.clientWidth - 70, 60);

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    return () => {
      cancel();
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper${active ? " active" : ""}`}
      id="profileCard"
    >
      <section ref={cardRef} className={`pc-card${active ? " active" : ""}`}>
        <div className="pc-inside">
          <div className="pc-shine"></div>
          <div className="pc-glare"></div>

          <div className="pc-content pc-avatar-content">
            <img
              className="avatar"
              src={avatar}
              alt="Trishtian Capangpangan avatar"
              loading="lazy"
            />
            <div className="pc-user-info">
              <div className="pc-user-details">
                <div className="pc-mini-avatar">
                  <img src={avatar} alt="Trishtian mini avatar" loading="lazy" />
                </div>
                <div className="pc-user-text">
                  <div className="pc-handle">@trishtian</div>
                  <div className="pc-status">Available for Work</div>
                </div>
              </div>
              <a href="#contact" className="pc-contact-btn">
                Hire Me
              </a>
            </div>
          </div>

          <div className="pc-content">
            <div className="pc-details">
            
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
