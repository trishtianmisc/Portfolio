import { useEffect, useRef, useState } from "react";
import {
  Preloader,
  ParticleCanvas,
  CustomCursor,
  useScrollReveal,
  useActiveSection,
} from "./components/Effects";
import ProfileCard from "./components/ProfileCard";
import attnImg from "./assets/attn.png";
import cabangahanImg from "./assets/Cabangahan.png";
import movieImg from "./assets/MovieTicketing.png";
import gcash1 from "./assets/Gcash1.jpg";
import gcash2 from "./assets/Gcash2.png";
import gcash3 from "./assets/Gcash3.jpg";
import gcash4 from "./assets/Gcash4.jpg";
import gcash5 from "./assets/Gcash5.jpg";
import gcash6 from "./assets/Gcash6.png";
import gcash7 from "./assets/Gcash7.png";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

const achievementImages = [
  {
    src: gcash1,
    alt: "Certificate of Participation, GCash ImagNation Innovation Challenge 2026",
    caption: "Certificate of Participation - Top 10 Challenger Teams",
  },
  {
    src: gcash2,
    alt: "Team KitaClick receiving recognition on stage",
    caption: "Team KitaClick on stage",
  },
  {
    src: gcash6,
    alt: "Pitching and working on ideas during the hackathon",
    caption: "Building ideas at the innovation challenge",
  },
  {
    src: gcash3,
    alt: "Team photo at the GCash ImagNation booth",
    caption: "With the team at GCash",
  },
  {
    src: gcash7,
    alt: "Group photo of all participants and GCash executives",
    caption: "All participants and GCash executives",
  },
  {
    src: gcash4,
    alt: "Accepting the award on stage",
    caption: "On stage at the awarding",
  },
  {
    src: gcash5,
    alt: "ImagNation certificate folder",
    caption: "The official ImagNation certificate",
  },
];

const heroStats = [
  { number: "5+", label: "Projects Completed" },
  { number: "8+", label: "Technologies" },
  { number: "100%", label: "Committed" },
];

const skills = [
  {
    title: "FRONTEND",
    text: "React, JavaScript, HTML5, CSS3 - Building responsive and interactive user interfaces",
    icon: "fa-brands fa-react",
    buttons: [
      "fa-brands fa-react",
      "fa-brands fa-js",
      "fa-brands fa-html5",
    ],
  },
  {
    title: "BACKEND",
    text: "Python, Django, PHP, PostgreSQL - Server-side development and database management",
    icon: "fa-brands fa-python",
    buttons: ["fa-brands fa-python", "fa-brands fa-php", "fa-solid fa-database"],
  },
  {
    title: "TOOLS",
    text: "Git, Java, MySQL, VS Code - Development tools, desktop apps and version control",
    icon: "fa-brands fa-git-alt",
    buttons: ["fa-brands fa-git-alt", "fa-brands fa-github", "fa-brands fa-java"],
  },
];

const techIcons = {
  "React Vite": "fa-brands fa-react",
  Django: "fa-brands fa-python",
  PostgreSQL: "fa-solid fa-database",
  Supabase: "fa-solid fa-bolt",
  "Tailwind CSS": "fa-solid fa-wind",
  Python: "fa-brands fa-python",
  PyQt5: "fa-solid fa-window-maximize",
  Java: "fa-brands fa-java",
  JavaFX: "fa-solid fa-mug-hot",
  FXML: "fa-solid fa-code",
  CSS: "fa-brands fa-css3-alt",
  MySQL: "fa-solid fa-database",
};

const projects = [
  {
    badge: "Full Stack",
    name: "ATTN Store",
    image: attnImg,
    description:
      "Inventory and sales management platform with analytics, built for real-world store operations.",
    tech: ["React Vite", "Django", "PostgreSQL", "Supabase", "Tailwind CSS"],
  },
  {
    badge: "Desktop App",
    name: "Cabangahan Connect",
    image: cabangahanImg,
    description:
      "Barangay Management System for efficient governance and transparent operations with automated paper works.",
    tech: ["Python", "PyQt5", "PostgreSQL"],
  },
  {
    badge: "Desktop App",
    name: "Movie Ticketing System",
    image: movieImg,
    description:
      "Modern software solution focused on automation and productivity for cinema ticketing.",
    tech: ["Java", "JavaFX", "FXML", "CSS", "MySQL"],
  },
];

export default function App() {
  useScrollReveal();
  const active = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const projectsRef = useRef(null);
  const [scrollable, setScrollable] = useState(false);
  const dragRef = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  useEffect(() => {
    const track = projectsRef.current;
    if (!track) return;

    const update = () =>
      setScrollable(track.scrollWidth - track.clientWidth > 5);

    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const onTrackPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = {
      down: true,
      startX: e.clientX,
      startScroll: projectsRef.current.scrollLeft,
      moved: false,
    };
  };

  const onTrackPointerMove = (e) => {
    const track = projectsRef.current;
    const s = dragRef.current;
    if (!track || !s.down) return;

    const dx = e.clientX - s.startX;
    if (!s.moved && Math.abs(dx) > 5) {
      s.moved = true;
      track.classList.add("dragging");
    }
    if (s.moved) {
      track.scrollLeft = s.startScroll - dx;
    }
  };

  const onTrackPointerUp = () => {
    dragRef.current.down = false;
    projectsRef.current?.classList.remove("dragging");
  };

  const scrollProjects = (dir) => {
    const track = projectsRef.current;
    if (!track) return;
    const card = track.querySelector(".project-card");
    const step = card ? card.offsetWidth + 24 : 360;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((i) => (i + 1) % achievementImages.length);
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i - 1 + achievementImages.length) % achievementImages.length);
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    setFormMessage("Thank you for your message! I'll get back to you soon.");
    setTimeout(() => setFormMessage(""), 5000);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <Preloader />
      <ParticleCanvas />
      <CustomCursor />

      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="nav-logo" onClick={closeMenu}>
            TRISHTIAN.
          </a>

          <ul className={`nav-menu${menuOpen ? " active" : ""}`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`nav-link${active === link.href.slice(1) ? " active" : ""}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div
            className={`hamburger${menuOpen ? " active" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Hi, I'm <span className="highlight">Trishtian Capangpangan</span>
              </h1>
              <h2>Software Developer &amp; BSIT Student</h2>
              <p>
                I create modern web applications, software solutions, and
                meaningful digital experiences. Passionate about turning ideas
                into reality through clean code and thoughtful design.
              </p>

              <div className="hero-buttons">
                <a href="#contact" className="btn-primary">
                  Get In Touch
                </a>
                <a href="#projects" className="btn-secondary">
                  View My Work
                </a>
              </div>

              <div className="hero-stats">
                {heroStats.map((stat, i) => (
                  <div className="stat" key={stat.label} style={{ animationDelay: `${1.2 + i * 0.2}s` }}>
                    <span className="stat-number">{stat.number}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <ProfileCard />
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>About Me</h2>
            <div className="section-line"></div>
          </div>

          <div className="about-content">
            <div className="about-text scroll-animate-left">
              <p>
                Hello! I'm Trishtian, an Information Technology student
                passionate about software development, web applications, and
                building solutions that create real-world impact.
              </p>
              <p>
                Throughout my academic journey I have developed various projects
                involving web, mobile, desktop, and database systems, constantly
                improving my technical and problem-solving skills.
              </p>

              <div className="about-stats scroll-animate-scale">
                {heroStats.map((stat) => (
                  <div className="stat-item" key={stat.label}>
                    <h3>{stat.number}</h3>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="skills-section">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>Skills &amp; Technologies</h2>
            <div className="section-line"></div>
          </div>

          <div className="skills-grid">
            {skills.map((skill, i) => (
              <div
                className={`parent scroll-animate${i === 0 ? "-left" : ""}`}
                key={skill.title}
              >
                <div className="card">
                  <div className="logo">
                    <span className="circle circle1"></span>
                    <span className="circle circle2"></span>
                    <span className="circle circle3"></span>
                    <span className="circle circle4"></span>
                    <span className="circle circle5">
                      <i className={skill.icon}></i>
                    </span>
                  </div>
                  <div className="glass"></div>

                  <div className="content">
                    <span className="title">{skill.title}</span>
                    <span className="text">{skill.text}</span>
                  </div>

                  <div className="bottom">
                    <div className="social-buttons-container">
                      {skill.buttons.map((icon, idx) => (
                        <button
                          className={`social-button social-button${idx + 1}`}
                          key={icon}
                          type="button"
                          aria-label={icon}
                        >
                          <i className={icon}></i>
                        </button>
                      ))}
                    </div>

                    <div className="view-more">
                      <span className="view-more-button">View more</span>
                      <svg
                        className="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="projects-section">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>Featured Projects</h2>
            <div className="section-line"></div>
            {scrollable && (
              <div className="projects-controls">
                <button
                  type="button"
                  className="proj-nav-btn"
                  onClick={() => scrollProjects(-1)}
                  aria-label="Scroll to previous projects"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="projects-hint">Scroll or drag to explore</span>
                <button
                  type="button"
                  className="proj-nav-btn"
                  onClick={() => scrollProjects(1)}
                  aria-label="Scroll to next projects"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>

          <div
            className="projects-track"
            ref={projectsRef}
            onPointerDown={onTrackPointerDown}
            onPointerMove={onTrackPointerMove}
            onPointerUp={onTrackPointerUp}
            onPointerLeave={onTrackPointerUp}
          >
            {projects.map((project) => (
              <div className="project-card scroll-animate-scale" key={project.name}>
                <div className="content">
                  <div className="front">
                    <img
                      className="project-image"
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      draggable="false"
                    />
                    <div className="front-shade"></div>

                    <div className="front-content">
                      <small className="badge">{project.badge}</small>
                      <div className="description">
                        <div className="title">
                          <p className="title">
                            <strong>{project.name}</strong>
                          </p>
                          <i className="fa-solid fa-arrow-up-right-from-square project-arrow"></i>
                        </div>
                        <p className="card-footer">{project.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="back">
                    <div className="back-content">
                      <div className="tech-stack">
                        <h3>Technologies Used</h3>
                        <div className="tech-items">
                          {project.tech.map((tech) => (
                            <div className="tech-item" key={tech}>
                              <i className={techIcons[tech] || "fa-solid fa-code"}></i>
                              <span>{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="achievements" className="achievements-section">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>Achievements</h2>
            <div className="section-line"></div>
          </div>

          <div className="achievement-feature scroll-animate-scale">
            <div className="feature-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="feature-body">
              <span className="feature-badge">Top 10 Finalist</span>
              <h3>GCash ImagNation Hackathon 2026</h3>
              <p>
                Selected as one of the Top 10 challenger teams at the GCash
                ImagNation Innovation Challenge, with the theme
                &ldquo;Negosyo Nation: Powering the Next Gen Filipino
                Entrepreneurs.&rdquo;
              </p>
              <div className="feature-meta">
                <span>
                  <i className="fas fa-calendar-alt"></i> September 7&ndash;9, 2026
                </span>
                <span>
                  <i className="fas fa-users"></i> Team KitaClick
                </span>
                <span>
                  <i className="fas fa-location-dot"></i> GCash Office
                </span>
              </div>
            </div>
          </div>

          <div className="gallery scroll-animate">
            {achievementImages.map((image, i) => (
              <figure
                className="gallery-item"
                key={image.src}
                onClick={() => setLightbox(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setLightbox(i)}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
                <figcaption>{image.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header scroll-animate">
            <h2>Get In Touch</h2>
            <div className="section-line"></div>
          </div>

          <div className="contact-content">
            <div className="contact-info scroll-animate-left">
              <h3>Let's work together!</h3>
              <p>
                I'm always interested in new opportunities and exciting
                projects. Whether you have a question or just want to say hi,
                feel free to reach out!
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <i className="fas fa-envelope"></i>
                  <span>ctrishtian@email.com</span>
                </div>
                <div className="contact-method">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Philippines</span>
                </div>
                <div className="contact-method">
                  <i className="fas fa-clock"></i>
                  <span>Available for freelance &amp; internships</span>
                </div>
              </div>

              <div className="social-links">
                <a href="#" className="social-link" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="contact-form scroll-animate-right">
              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" name="name" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="text" name="subject" placeholder="Subject" required />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>

              {formMessage && (
                <div className="form-message success">{formMessage}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <span className="lb-count">
            {lightbox + 1} / {achievementImages.length}
          </span>

          <button
            type="button"
            className="lb-btn lb-close"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            <i className="fas fa-xmark"></i>
          </button>

          <button
            type="button"
            className="lb-btn lb-prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(
                (i) =>
                  (i - 1 + achievementImages.length) % achievementImages.length
              );
            }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <div
            className="lb-stage"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <img
              src={achievementImages[lightbox].src}
              alt={achievementImages[lightbox].alt}
            />
            <div className="lightbox-caption">
              {achievementImages[lightbox].caption}
            </div>
          </div>

          <button
            type="button"
            className="lb-btn lb-next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i + 1) % achievementImages.length);
            }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Trishtian Capangpangan. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
