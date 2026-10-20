function initMobileNav() {
  const siteHeader = document.querySelector(".site-header");
  if (!siteHeader) return;

  const toggle = siteHeader.querySelector(".nav-toggle");
  const nav = siteHeader.querySelector(".main-nav");
  if (!toggle || !nav) return;

  const mq = window.matchMedia("(max-width: 720px)");

  function setOpen(open) {
    siteHeader.classList.toggle("is-nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", open && mq.matches);
  }

  function closeNav() {
    setOpen(false);
  }

  toggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.contains("is-nav-open");
    setOpen(!isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mq.matches) closeNav();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  mq.addEventListener("change", () => {
    if (!mq.matches) closeNav();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileNav);
} else {
  initMobileNav();
}
