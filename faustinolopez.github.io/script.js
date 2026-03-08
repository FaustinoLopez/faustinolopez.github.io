const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealTargets = document.querySelectorAll(".glass-card, .section-shell");
const sectionEls = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll('.site-header nav a[href^="#"]');

if (revealTargets.length > 0 && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealTargets.forEach((el) => {
    el.classList.add("js-reveal");
    revealObserver.observe(el);
  });
}

if (sectionEls.length > 0 && navLinks.length > 0 && "IntersectionObserver" in window) {
  const linkMap = new Map();

  navLinks.forEach((link) => {
    const id = link.getAttribute("href");
    if (id) {
      linkMap.set(id.slice(1), link);
    }
  });

  const activeObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length === 0) {
        return;
      }

      const activeId = visible[0].target.id;

      navLinks.forEach((link) => {
        link.classList.remove("is-active");
      });

      const activeLink = linkMap.get(activeId);
      if (activeLink) {
        activeLink.classList.add("is-active");
      }
    },
    { threshold: [0.2, 0.5, 0.75], rootMargin: "-16% 0px -55% 0px" }
  );

  sectionEls.forEach((section) => {
    activeObserver.observe(section);
  });
}

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const finalSubject = subject || "New Portfolio Inquiry";
    const bodyLines = [
      `Name: ${name || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      "",
      message || "No message provided."
    ];

    const mailtoHref =
      `mailto:faustinolopezdev@gmail.com?subject=${encodeURIComponent(finalSubject)}` +
      `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailtoHref;
  });
}
