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
const contactFormStatus = document.getElementById("contact-form-status");

const setContactFormStatus = (message, isError = false, isSuccess = false) => {
  if (!contactFormStatus) {
    return;
  }

  contactFormStatus.textContent = message;
  contactFormStatus.classList.toggle("is-error", isError);
  contactFormStatus.classList.toggle("is-success", isSuccess);
};

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const defaultButtonText = submitButton ? submitButton.textContent : "Send Email";

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = contactForm.getAttribute("action");
    if (!endpoint) {
      setContactFormStatus(
        "Form endpoint missing. Please email me directly at faustinolopezdev@gmail.com.",
        true
      );
      return;
    }

    const formData = new FormData(contactForm);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    setContactFormStatus("Sending your message...");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to send message.");
      }

      contactForm.reset();
      setContactFormStatus("Thanks! Your message was sent. I will reply within 24 hours.", false, true);
    } catch (error) {
      setContactFormStatus(
        "Message failed to send. Please email me directly at faustinolopezdev@gmail.com.",
        true
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
    }
  });
}
