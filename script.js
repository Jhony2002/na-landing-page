document.body.classList.add("loading");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.querySelector(".loader");
const loaderBar = document.querySelector(".loader__line i");
const loaderCount = document.querySelector(".loader__count");

function finishLoading() {
  loader.classList.add("is-done");
  document.body.classList.remove("loading");
  document.querySelectorAll(".hero__title .line > span").forEach((line, index) => {
    line.animate(
      [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
      { duration: 1000, delay: index * 110, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
    );
  });
}

if (prefersReducedMotion) {
  finishLoading();
} else {
  let progress = 0;
  const loadingTimer = window.setInterval(() => {
    progress += Math.ceil(Math.random() * 12);
    progress = Math.min(progress, 100);
    loaderBar.style.width = `${progress}%`;
    loaderCount.textContent = String(progress).padStart(2, "0");
    if (progress === 100) {
      window.clearInterval(loadingTimer);
      window.setTimeout(finishLoading, 300);
    }
  }, 70);
}

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
menu.inert = true;

function setMenu(open) {
  menu.classList.toggle("is-open", open);
  menu.inert = !open;
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}

menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const backToTop = document.querySelector(".back-to-top");
const updateBackToTop = () => {
  backToTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.65);
};
window.addEventListener("scroll", updateBackToTop, { passive: true });
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});
updateBackToTop();

const marquee = document.querySelector(".marquee");
const marqueeToggle = document.querySelector(".marquee__toggle");
marqueeToggle.addEventListener("click", () => {
  const paused = marquee.classList.toggle("is-paused");
  marqueeToggle.textContent = paused ? "▶" : "Ⅱ";
  marqueeToggle.setAttribute("aria-label", paused ? "Retomar animação" : "Pausar animação");
});

if (!CSS.supports("animation-timeline", "scroll()")) {
  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const progress = available > 0 ? window.scrollY / available : 0;
    document.documentElement.style.setProperty("--scroll-progress", progress);
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

document.querySelectorAll(".service button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".service");
    const wasOpen = item.classList.contains("is-open");
    document.querySelectorAll(".service.is-open").forEach((openItem) => {
      openItem.classList.remove("is-open");
      openItem.querySelector("button").setAttribute("aria-expanded", "false");
    });
    if (!wasOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

if (window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
  const cursor = document.querySelector(".cursor");
  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function moveCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(moveCursor);
  }
  moveCursor();

  document.querySelectorAll(".cursor-view").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-view"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-view"));
  });

  document.querySelectorAll(".project").forEach((project) => {
    const image = project.querySelector(".project__image");
    project.addEventListener("mousemove", (event) => {
      const box = project.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width;
      const y = (event.clientY - box.top) / box.height;
      image.style.setProperty("--tilt-x", `${(x - 0.5) * 5}deg`);
      image.style.setProperty("--tilt-y", `${(0.5 - y) * 5}deg`);
      image.style.setProperty("--spot-x", `${x * 100}%`);
      image.style.setProperty("--spot-y", `${y * 100}%`);
    });
    project.addEventListener("mouseleave", () => {
      image.style.setProperty("--tilt-x", "0deg");
      image.style.setProperty("--tilt-y", "0deg");
    });
  });

  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const box = element.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      element.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
    });
    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });

  const shape = document.querySelector(".shape");
  window.addEventListener(
    "scroll",
    () => {
      shape.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    },
    { passive: true }
  );
}
