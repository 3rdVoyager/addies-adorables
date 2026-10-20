function buildGallery(gallery) {
  if (gallery.dataset.galleryEnhanced === "true") return;

  const images = Array.from(gallery.querySelectorAll(":scope > img"));
  if (images.length === 0) return;

  const crop = gallery.dataset.crop ?? "natural";
  const controls = gallery.dataset.controls !== "false";
  const indicators = gallery.dataset.indicators !== "false";
  const autoScroll = gallery.dataset.autoscroll === "true";
  const interval = Number(gallery.dataset.interval) || 5000;
  const pauseOnHover = gallery.dataset.pauseOnHover !== "false";

  gallery.dataset.galleryEnhanced = "true";
  gallery.dataset.galleryAutoScroll = autoScroll && images.length > 1 ? "true" : "false";
  gallery.dataset.galleryInterval = String(interval);
  gallery.dataset.galleryPauseOnHover = pauseOnHover ? "true" : "false";

  const viewport = document.createElement("div");
  viewport.className = "gallery__viewport";
  viewport.setAttribute("tabindex", "0");
  viewport.setAttribute("aria-label", "Image gallery");

  const track = document.createElement("div");
  track.className = "gallery__track";

  images.forEach((img) => {
    img.classList.add("content-image", "content-image--full", `content-image--${crop}`);
    img.setAttribute("loading", "lazy");
    const slide = document.createElement("div");
    slide.className = "gallery__slide";
    slide.appendChild(img);
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  gallery.appendChild(viewport);

  if (!controls && !indicators) {
    wireSwipeOnly();
    return;
  }

  const hasMultiple = images.length > 1;

  if (controls && hasMultiple) {
    gallery.classList.add("gallery--has-controls");
    const controlsWrap = document.createElement("div");
    controlsWrap.className = "gallery__controls";

    const prev = document.createElement("button");
    prev.type = "button";
    prev.setAttribute("data-gallery-previous", "");
    prev.setAttribute("aria-label", "Previous image");
    const prevIcon = document.createElement("span");
    prevIcon.setAttribute("aria-hidden", "true");
    prevIcon.textContent = "←";
    prev.appendChild(prevIcon);

    const next = document.createElement("button");
    next.type = "button";
    next.setAttribute("data-gallery-next", "");
    next.setAttribute("aria-label", "Next image");
    const nextIcon = document.createElement("span");
    nextIcon.setAttribute("aria-hidden", "true");
    nextIcon.textContent = "→";
    next.appendChild(nextIcon);

    controlsWrap.appendChild(prev);
    controlsWrap.appendChild(next);
    gallery.appendChild(controlsWrap);
  }

  if (indicators && hasMultiple) {
    const dots = document.createElement("div");
    dots.className = "gallery__indicators";
    dots.setAttribute("aria-label", "Choose gallery image");
    images.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("data-gallery-indicator", String(index));
      dot.setAttribute("aria-label", `Show image ${index + 1}`);
      if (index === 0) dot.setAttribute("aria-current", "true");
      dots.appendChild(dot);
    });
    gallery.appendChild(dots);
  }

  wireSwipeOnly();

  function wireSwipeOnly() {
    const slides = gallery.querySelectorAll(".gallery__slide");
    const previous = gallery.querySelector("[data-gallery-previous]");
    const next = gallery.querySelector("[data-gallery-next]");
    const dots = gallery.querySelectorAll("[data-gallery-indicator]");

    if (!viewport || slides.length < 2) return;

    let currentIndex = 0;
    let timer;

    const showSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      viewport.scrollTo({
        left: currentIndex * viewport.clientWidth,
        behavior: "smooth",
      });

      dots.forEach((dot, dotIndex) => {
        dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
      });
    };

    const stopAutoScroll = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const startAutoScroll = () => {
      stopAutoScroll();
      if (gallery.dataset.galleryAutoScroll !== "true") return;
      timer = window.setInterval(() => showSlide(currentIndex + 1), interval);
    };

    previous?.addEventListener("click", () => showSlide(currentIndex - 1));
    next?.addEventListener("click", () => showSlide(currentIndex + 1));

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(Number(dot.dataset.galleryIndicator));
      });
    });

    if (pauseOnHover) {
      gallery.addEventListener("mouseenter", stopAutoScroll);
      gallery.addEventListener("mouseleave", startAutoScroll);
      gallery.addEventListener("focusin", stopAutoScroll);
      gallery.addEventListener("focusout", startAutoScroll);
    }

    startAutoScroll();
  }
}

function enhanceGalleries() {
  document.querySelectorAll("[data-gallery]").forEach(buildGallery);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", enhanceGalleries);
} else {
  enhanceGalleries();
}

document.addEventListener("astro:page-load", enhanceGalleries);
