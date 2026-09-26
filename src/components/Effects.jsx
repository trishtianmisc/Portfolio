import { useEffect, useRef, useState } from "react";

export function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const min = 2000;
    const hide = () => {
      const wait = Math.max(0, min - (Date.now() - start));
      setTimeout(() => setHidden(true), wait);
    };
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide);
    return () => window.removeEventListener("load", hide);
  }, []);

  if (hidden) return null;

  return (
    <div className={`preloader${hidden ? " hidden" : ""}`}>
      <div className="spinner">
        <div className="spinner1"></div>
      </div>
    </div>
  );
}

const PARTICLE_CONFIG = {
  COUNT: 50,
  SIZE_MIN: 2,
  SIZE_MAX: 4,
  SPEED_MAX: 1.5,
  CONNECTION_DISTANCE: 150,
  CONNECTION_OPACITY: 0.4,
  PARTICLE_COLOR: "rgba(96, 165, 250,",
  CONNECTION_COLOR: "rgba(59, 130, 246,",
};

export function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId = null;
    const mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const create = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * PARTICLE_CONFIG.SPEED_MAX,
      vy: (Math.random() - 0.5) * PARTICLE_CONFIG.SPEED_MAX,
      size:
        Math.random() *
          (PARTICLE_CONFIG.SIZE_MAX - PARTICLE_CONFIG.SIZE_MIN) +
        PARTICLE_CONFIG.SIZE_MIN,
      opacity: Math.random() * 0.5 + 0.3,
    });

    const init = () => {
      resize();
      particles = Array.from({ length: PARTICLE_CONFIG.COUNT }, create);
    };

    const draw = () => {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
        if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100 && distance > 0) {
          const force = (100 - distance) / 100;
          p.vx -= (dx / distance) * force * 0.02;
          p.vy -= (dy / distance) * force * 0.02;
        }
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${PARTICLE_CONFIG.PARTICLE_COLOR} ${p.opacity})`;
        ctx.fill();
      });

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < PARTICLE_CONFIG.CONNECTION_DISTANCE) {
            const opacity =
              (PARTICLE_CONFIG.CONNECTION_DISTANCE - distance) /
              PARTICLE_CONFIG.CONNECTION_DISTANCE;
            ctx.strokeStyle = `${PARTICLE_CONFIG.CONNECTION_COLOR} ${
              opacity * PARTICLE_CONFIG.CONNECTION_OPACITY
            })`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    init();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

export function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    let trailTimer = null;

    const move = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;

      clearTimeout(trailTimer);
      trailTimer = setTimeout(() => {
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
      }, 50);
    };

    const down = () => cursor.classList.add("click");
    const up = () => cursor.classList.remove("click");

    const over = (e) => {
      const el = e.target.closest(
        "a, button, .nav-link, .btn-primary, .btn-secondary, .project-card, .social-link, .pc-card, .gallery-item, input, textarea"
      );
      cursor.classList.toggle("hover", Boolean(el));
    };

    const enter = () => {
      cursor.classList.remove("hidden");
      trail.classList.remove("hidden");
    };
    const leave = () => {
      cursor.classList.add("hidden");
      trail.classList.add("hidden");
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);

    return () => {
      clearTimeout(trailTimer);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mousedown", down);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden"></div>
      <div ref={trailRef} className="cursor-trail hidden"></div>
    </>
  );
}

export function useScrollReveal() {
  useEffect(() => {
    const selector =
      ".scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale";

    const check = () => {
      const trigger = window.innerHeight * 0.85;
      document.querySelectorAll(selector).forEach((el) => {
        if (el.getBoundingClientRect().top < trigger) el.classList.add("animate");
      });
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
}

export function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const update = () => {
      const pos = window.scrollY + 120;
      document.querySelectorAll("section[id]").forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (pos >= top && pos < top + height) setActive(section.id);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return active;
}
