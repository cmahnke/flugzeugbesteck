/* Flugzeugbesteck — Interaction.
   Carousel, cutlery drawer (opens on scroll) and mobile menu.
   Without JavaScript everything stays visible and operable: the drawer is
   server-rendered and fully expanded, the carousel can be used by swiping,
   and the navigation stays in flow. */

function initCarousels(): void {
  document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((carousel) => {
    const viewport = carousel.querySelector<HTMLElement>(".carousel__viewport");
    const prev = carousel.querySelector<HTMLButtonElement>("[data-carousel-prev]");
    const next = carousel.querySelector<HTMLButtonElement>("[data-carousel-next]");
    const counter = carousel.querySelector<HTMLElement>("[data-carousel-count]");
    if (!viewport || !prev || !next) return;

    const slides = Array.from(viewport.children);
    if (slides.length < 2) {
      prev.disabled = true;
      next.disabled = true;
      return;
    }

    const zweistellig = (n: number): string => (n < 10 ? "0" : "") + String(n);
    const index = (): number =>
      Math.min(slides.length - 1, Math.max(0, Math.round(viewport.scrollLeft / viewport.clientWidth)));

    const melde = (): void => {
      const i = index();
      if (counter) counter.textContent = zweistellig(i + 1) + " / " + zweistellig(slides.length);
      prev.disabled = i === 0;
      next.disabled = i === slides.length - 1;
    };

    const blatt = (richtung: number): void => {
      viewport.scrollLeft = (index() + richtung) * viewport.clientWidth;
    };

    prev.addEventListener("click", () => blatt(-1));
    next.addEventListener("click", () => blatt(1));
    let wartend = false;
    viewport.addEventListener(
      "scroll",
      () => {
        if (wartend) return;
        wartend = true;
        window.requestAnimationFrame(() => {
          wartend = false;
          melde();
        });
      },
      { passive: true },
    );
    window.addEventListener("resize", melde);
    melde();
  });
}

function initDrawers(): void {
  const schubladen = Array.from(document.querySelectorAll<HTMLElement>(".drawer"));
  if (!schubladen.length) return;
  if (!("IntersectionObserver" in window)) {
    schubladen.forEach((el) => el.classList.add("is-open"));
    return;
  }
  const io = new IntersectionObserver(
    (eintraege) => {
      eintraege.forEach((eintrag) => {
        if (eintrag.isIntersecting) {
          eintrag.target.classList.add("is-open");
          io.unobserve(eintrag.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  schubladen.forEach((el) => io.observe(el));
}

function initNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
  const panel = document.getElementById("site-nav");
  if (!toggle || !panel) return;
  let offen = false;
  const hintergrund = Array.from(document.body.children).filter((el) => el.tagName !== "HEADER");

  const setze = (zustand: boolean): void => {
    offen = zustand;
    document.documentElement.classList.toggle("nav-open", zustand);
    toggle.setAttribute("aria-expanded", zustand ? "true" : "false");
    document.body.classList.toggle("nav-locked", zustand);
    if ("inert" in HTMLElement.prototype) {
      hintergrund.forEach((el) => {
        (el as HTMLElement).inert = zustand;
      });
    }
    if (zustand) {
      const erster = panel.querySelector<HTMLElement>("a");
      if (erster) erster.focus();
    }
  };

  toggle.addEventListener("click", () => setze(!offen));
  panel.addEventListener("click", (ereignis) => {
    const ziel = ereignis.target as HTMLElement;
    if (ziel.closest("a")) setze(false);
  });
  document.addEventListener("keydown", (ereignis) => {
    if (ereignis.key === "Escape" && offen) {
      setze(false);
      toggle.focus();
    }
  });
  const mobil = window.matchMedia("(max-width: 639px)");
  const beiWechsel = (e: MediaQueryListEvent): void => {
    if (!e.matches) setze(false);
  };
  if (mobil.addEventListener) {
    mobil.addEventListener("change", beiWechsel);
  } else if (mobil.addListener) {
    mobil.addListener(beiWechsel);
  }
}

function init(): void {
  initCarousels();
  initDrawers();
  initNav();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
