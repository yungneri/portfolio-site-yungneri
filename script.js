const portfolioConfig = {
  brandName: "Yung Neri",
  email: "yungnerivideo@gmail.com",
  socialLinks: {
    instagram: "https://www.instagram.com/yung.neri/",
    youtube: "https://www.youtube.com/@YungNeri",
    tiktok: "https://www.tiktok.com/@yungneri?lang=en",
    facebook: "https://www.facebook.com/profile.php?id=61573839359491",
    linkedin: "https://www.linkedin.com/in/yungneri/"
  }
};

const heroVideo = document.querySelector("#hero-video");
const playlistButtons = [...document.querySelectorAll(".playlist-item")];
const contactForm = document.querySelector("#contact-form");
const socialLinksContainer = document.querySelector("#social-links");
const headerSocialsContainer = document.querySelector("#header-socials");
const buttons = [...document.querySelectorAll(".button")];
const animatedButtons = [...document.querySelectorAll(".button.button-trace")];
const carouselTracks = [...document.querySelectorAll("[data-carousel-track]")];
const carouselButtons = [...document.querySelectorAll(".carousel-arrow")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
const carouselLoopState = new WeakMap();
let videoObserver;

const socialMeta = [
  { key: "instagram", label: "Instagram", icon: "icon-instagram" },
  { key: "youtube", label: "YouTube", icon: "icon-youtube" },
  { key: "tiktok", label: "TikTok", icon: "icon-tiktok" },
  { key: "facebook", label: "Facebook", icon: "icon-facebook" },
  { key: "linkedin", label: "LinkedIn", icon: "icon-linkedin" }
];

let traceIdCounter = 0;
let buttonResizeObserver;

function setHeroVideo(src, button) {
  if (!heroVideo || !src) return;

  const currentSource = heroVideo.querySelector("source");
  if (!currentSource) return;

  if (currentSource.getAttribute("src") === src) {
    playVideo(heroVideo);
    playlistButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    return;
  }

  currentSource.setAttribute("src", src);
  heroVideo.load();
  playVideo(heroVideo);

  playlistButtons.forEach((item) => item.classList.toggle("is-active", item === button));
}

function playVideo(video) {
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("autoplay", "");
  video.play().catch(() => {});
}

function primeAutoplay(video) {
  if (!video) return;

  playVideo(video);
  video.addEventListener("loadeddata", () => playVideo(video), { once: true });
  video.addEventListener("canplay", () => playVideo(video), { once: true });
}

function getAutoplayVideos() {
  return [...document.querySelectorAll("video[autoplay]")];
}

function getReelVideos() {
  return [...document.querySelectorAll(".reel-card video")];
}

function pauseVideo(video) {
  if (!video) return;

  try {
    video.pause();
  } catch (_) {}
}

function updateManagedVideoState(video) {
  if (!video) return;

  if (document.hidden) {
    pauseVideo(video);
    return;
  }

  if (video.id === "hero-video") {
    playVideo(video);
    return;
  }

  if (video.dataset.inView === "true") {
    playVideo(video);
    return;
  }

  pauseVideo(video);
}

function setupVideoPlayback() {
  getAutoplayVideos().forEach((video) => {
    if (!video.hasAttribute("preload")) {
      video.setAttribute("preload", video.id === "hero-video" ? "auto" : "metadata");
    }
  });

  if (videoObserver) {
    videoObserver.disconnect();
  }

  videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        video.dataset.inView = entry.isIntersecting && entry.intersectionRatio >= 0.45 ? "true" : "false";
        updateManagedVideoState(video);
      });
    },
    { threshold: [0, 0.2, 0.45, 0.7] }
  );

  getReelVideos().forEach((video) => {
    video.dataset.inView = "false";
    video.addEventListener("loadeddata", () => updateManagedVideoState(video), { once: true });
    video.addEventListener("canplay", () => updateManagedVideoState(video), { once: true });
    videoObserver.observe(video);
    updateManagedVideoState(video);
  });

  if (heroVideo) {
    heroVideo.dataset.inView = "true";
    primeAutoplay(heroVideo);
    updateManagedVideoState(heroVideo);
  }
}

function setActiveNav(targetHash) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === targetHash);
  });
}

function setupNavHighlight() {
  if (!navLinks.length) return;

  const header = document.querySelector(".site-header");
  const portfolioSection = document.querySelector("#films");
  const contactSection = document.querySelector("#contact");
  const sectionTargets = {
    "#films": portfolioSection,
    "#contact": contactSection
  };
  let lockedNavTarget = "";
  let navUnlockTimeout = 0;

  const clearNavLock = () => {
    lockedNavTarget = "";
    window.clearTimeout(navUnlockTimeout);
  };

  const lockNavTo = (targetHash) => {
    lockedNavTarget = targetHash;
    setActiveNav(targetHash);
    window.clearTimeout(navUnlockTimeout);
    navUnlockTimeout = window.setTimeout(() => {
      lockedNavTarget = "";
      queueViewportSync();
    }, 900);
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (href) {
        lockNavTo(href);
      }
    });
  });

  const applyHashHighlight = () => {
    const currentHash = window.location.hash || "#top";
    const matchedLink = navLinks.find((link) => link.getAttribute("href") === currentHash);
    setActiveNav(matchedLink ? currentHash : "#top");
  };

  const isNavTargetSettled = (targetHash, headerOffset, topBuffer) => {
    if (targetHash === "#top") {
      return window.scrollY <= topBuffer;
    }

    const targetSection = sectionTargets[targetHash];
    if (!targetSection) {
      return false;
    }

    const targetTop = targetSection.getBoundingClientRect().top;
    const settleStart = headerOffset - 48;
    const settleEnd = headerOffset + 136;

    return targetTop >= settleStart && targetTop <= settleEnd;
  };

  const syncNavFromViewport = () => {
    const headerOffset = header?.offsetHeight || 0;
    const topBuffer = Math.max(headerOffset + 28, 120);
    const portfolioTop = portfolioSection?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
    const contactTop = contactSection?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

    if (lockedNavTarget) {
      if (isNavTargetSettled(lockedNavTarget, headerOffset, topBuffer)) {
        clearNavLock();
      } else {
        setActiveNav(lockedNavTarget);
        return;
      }
    }

    if (window.scrollY <= topBuffer) {
      setActiveNav("#top");
      return;
    }

    if (contactTop <= headerOffset + 140) {
      setActiveNav("#contact");
      return;
    }

    if (portfolioTop <= headerOffset + 160) {
      setActiveNav("#films");
      return;
    }

    setActiveNav("#top");
  };

  let syncFrame = 0;
  const queueViewportSync = () => {
    window.cancelAnimationFrame(syncFrame);
    syncFrame = window.requestAnimationFrame(syncNavFromViewport);
  };

  applyHashHighlight();
  syncNavFromViewport();

  window.addEventListener("hashchange", () => {
    applyHashHighlight();
    queueViewportSync();
  });
  window.addEventListener("scroll", queueViewportSync, { passive: true });
  window.addEventListener("resize", queueViewportSync);
}

function getCarouselStep(track) {
  const firstCard = [...track.children].find(
    (card) => card.classList?.contains("carousel-card") && !card.dataset.carouselClone
  );
  const computed = window.getComputedStyle(track);
  const gap = parseFloat(computed.columnGap || computed.gap || "0");

  if (!firstCard) {
    return track.clientWidth * 0.86;
  }

  return firstCard.getBoundingClientRect().width + gap;
}

function getOriginalCarouselCards(track) {
  return [...track.children].filter(
    (card) => card.classList?.contains("carousel-card") && !card.dataset.carouselClone
  );
}

function getCarouselLoopMetrics(track) {
  const cards = getOriginalCarouselCards(track);
  const firstCard = cards[0];
  const lastCard = cards[cards.length - 1];
  const computed = window.getComputedStyle(track);
  const gap = parseFloat(computed.columnGap || computed.gap || "0");

  if (!firstCard || !lastCard) {
    return null;
  }

  const loopStart = firstCard.offsetLeft;
  const loopSpan = (lastCard.offsetLeft + lastCard.offsetWidth) - firstCard.offsetLeft + gap;

  return { loopStart, loopSpan };
}

function normalizeCarouselLoop(track) {
  const metrics = getCarouselLoopMetrics(track);
  if (!metrics) return;

  const loopState = carouselLoopState.get(track) || { isAdjusting: false };

  if (loopState.isAdjusting) return;

  const relativeOffset = track.scrollLeft - metrics.loopStart;
  const normalizedOffset =
    ((relativeOffset % metrics.loopSpan) + metrics.loopSpan) % metrics.loopSpan;

  if (relativeOffset < 0 || relativeOffset >= metrics.loopSpan) {
    loopState.isAdjusting = true;
    track.scrollLeft = metrics.loopStart + normalizedOffset;
    window.requestAnimationFrame(() => {
      loopState.isAdjusting = false;
    });
  }

  carouselLoopState.set(track, loopState);
}

function setupInfiniteCarousel(track) {
  if (track.dataset.carouselLoopReady === "true") return;

  const cards = getOriginalCarouselCards(track);
  if (cards.length < 2) return;

  const beforeFragment = document.createDocumentFragment();
  const afterFragment = document.createDocumentFragment();

  cards.forEach((card) => {
    const beforeClone = card.cloneNode(true);
    const afterClone = card.cloneNode(true);

    beforeClone.dataset.carouselClone = "true";
    afterClone.dataset.carouselClone = "true";

    beforeFragment.append(beforeClone);
    afterFragment.append(afterClone);
  });

  track.prepend(beforeFragment);
  track.append(afterFragment);
  track.dataset.carouselLoopReady = "true";

  track
    .querySelectorAll("[data-carousel-clone] video[autoplay]")
    .forEach((video) => {
      video.setAttribute("preload", "metadata");
      video.dataset.inView = "false";
    });

  carouselLoopState.set(track, { isAdjusting: false });

  window.requestAnimationFrame(() => {
    const metrics = getCarouselLoopMetrics(track);
    if (!metrics) return;
    track.scrollLeft = metrics.loopStart;
  });
}

function updateCarouselButtons(track) {
  if (!track.id) return;

  carouselButtons
    .filter((button) => button.dataset.carouselTarget === track.id)
    .forEach((button) => {
      button.classList.remove("is-disabled");
      button.setAttribute("aria-disabled", "false");
    });
}

function scrollCarousel(track, direction) {
  const distance = getCarouselStep(track) * (direction === "next" ? 1 : -1);
  track.scrollBy({ left: distance, behavior: "smooth" });
}

function setupCarousels() {
  carouselButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const track = document.getElementById(button.dataset.carouselTarget || "");
      if (!track) return;
      scrollCarousel(track, button.dataset.direction);
    });
  });

  carouselTracks.forEach((track) => {
    let scrollFrame = 0;

    setupInfiniteCarousel(track);

    const syncButtons = () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(() => {
        normalizeCarouselLoop(track);
        updateCarouselButtons(track);
      });
    };

    updateCarouselButtons(track);
    track.addEventListener("scroll", syncButtons, { passive: true });

    track.addEventListener(
      "wheel",
      (event) => {
        const horizontalIntent = Math.abs(event.deltaX);
        const verticalIntent = Math.abs(event.deltaY);

        // Let native trackpad side-scrolling handle the carousel when horizontal input is present.
        if (horizontalIntent > verticalIntent * 0.75 || horizontalIntent > 3) {
          return;
        }

        const dominantDelta = event.deltaY;
        if (Math.abs(dominantDelta) < 4) {
          return;
        }

        event.preventDefault();
        track.scrollLeft += dominantDelta;
        normalizeCarouselLoop(track);
      },
      { passive: false }
    );
  });

  window.addEventListener("resize", () => {
    carouselTracks.forEach((track) => {
      normalizeCarouselLoop(track);
      updateCarouselButtons(track);
    });
  });
}

function decorateButtons() {
  const svgNS = "http://www.w3.org/2000/svg";

  buttons.forEach((button) => {
    if (!button.querySelector(".button-content")) {
      const content = document.createElement("span");
      content.className = "button-content";

      while (button.firstChild) {
        content.append(button.firstChild);
      }

      button.append(content);
    }
  });

  animatedButtons.forEach((button) => {
    if (!button.querySelector(".button-outline")) {
      const svg = document.createElementNS(svgNS, "svg");
      const defs = document.createElementNS(svgNS, "defs");
      const gradient = document.createElementNS(svgNS, "linearGradient");
      const filter = document.createElementNS(svgNS, "filter");
      const blur = document.createElementNS(svgNS, "feGaussianBlur");
      const merge = document.createElementNS(svgNS, "feMerge");
      const mergeBlur = document.createElementNS(svgNS, "feMergeNode");
      const mergeGraphic = document.createElementNS(svgNS, "feMergeNode");
      const auraFilter = document.createElementNS(svgNS, "filter");
      const auraBlur = document.createElementNS(svgNS, "feGaussianBlur");
      const gradientId = `button-trace-gradient-${traceIdCounter}`;
      const filterId = `button-trace-filter-${traceIdCounter}`;
      const auraFilterId = `button-trace-aura-filter-${traceIdCounter}`;

      traceIdCounter += 1;

      svg.setAttribute("class", "button-outline");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("overflow", "visible");

      gradient.setAttribute("id", gradientId);
      gradient.setAttribute("gradientUnits", "userSpaceOnUse");
      gradient.setAttribute("x1", "0");
      gradient.setAttribute("y1", "0");
      gradient.setAttribute("x2", "100");
      gradient.setAttribute("y2", "0");

      [
        { offset: "0%", color: "#68f6ff", opacity: "0" },
        { offset: "18%", color: "#ffffff", opacity: "0.35" },
        { offset: "44%", color: "#68f6ff", opacity: "1" },
        { offset: "72%", color: "#ff4ccf", opacity: "1" },
        { offset: "88%", color: "#ffffff", opacity: "0.22" },
        { offset: "100%", color: "#ff4ccf", opacity: "0" }
      ].forEach(({ offset, color, opacity }) => {
        const stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", offset);
        stop.setAttribute("stop-color", color);
        stop.setAttribute("stop-opacity", opacity);
        gradient.append(stop);
      });

      filter.setAttribute("id", filterId);
      filter.setAttribute("x", "-40%");
      filter.setAttribute("y", "-40%");
      filter.setAttribute("width", "180%");
      filter.setAttribute("height", "180%");
      filter.setAttribute("color-interpolation-filters", "sRGB");

      blur.setAttribute("in", "SourceGraphic");
      blur.setAttribute("stdDeviation", button.classList.contains("button-quote") ? "2.2" : "1.8");
      blur.setAttribute("result", "blur");

      mergeBlur.setAttribute("in", "blur");
      mergeGraphic.setAttribute("in", "SourceGraphic");
      merge.append(mergeBlur, mergeGraphic);
      filter.append(blur, merge);

      auraFilter.setAttribute("id", auraFilterId);
      auraFilter.setAttribute("x", "-55%");
      auraFilter.setAttribute("y", "-55%");
      auraFilter.setAttribute("width", "210%");
      auraFilter.setAttribute("height", "210%");
      auraFilter.setAttribute("color-interpolation-filters", "sRGB");

      auraBlur.setAttribute("in", "SourceGraphic");
      auraBlur.setAttribute("stdDeviation", button.classList.contains("button-quote") ? "3.1" : "2.5");
      auraFilter.append(auraBlur);

      defs.append(gradient, auraFilter, filter);
      svg.append(defs);

      const coreStroke = button.classList.contains("button-quote") ? 1.5 : 1.2;
      const glowStroke = button.classList.contains("button-quote") ? 3.4 : 2.8;
      const auraStroke = button.classList.contains("button-quote") ? 7.2 : 6.2;

      const createTracePath = (className, strokeWidth, filterValue = "") => {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("class", className);
        path.setAttribute("stroke", `url(#${gradientId})`);
        path.setAttribute("stroke-width", strokeWidth);
        if (filterValue) path.setAttribute("filter", filterValue);
        return path;
      };

      svg.append(
        createTracePath("button-trace-aura", `${auraStroke}`, `url(#${auraFilterId})`),
        createTracePath("button-trace-glow", `${glowStroke}`, `url(#${filterId})`),
        createTracePath("button-trace-core", `${coreStroke}`)
      );

      button.append(svg);
      button.dataset.traceGradientId = gradientId;
      button.dataset.coreStroke = `${coreStroke}`;
      button.dataset.glowStroke = `${glowStroke}`;
      button.dataset.auraStroke = `${auraStroke}`;
    }
  });

  updateButtonOutlines();

  if (!buttonResizeObserver) {
    buttonResizeObserver = new ResizeObserver(() => updateButtonOutlines());
    animatedButtons.forEach((button) => buttonResizeObserver.observe(button));
  }
}

function buildRoundedRectPath(width, height, radius, inset, offsetX = 0, offsetY = 0) {
  const left = offsetX + inset;
  const top = offsetY + inset;
  const right = offsetX + width - inset;
  const bottom = offsetY + height - inset;
  const safeRadius = Math.max(0, Math.min(radius, (right - left) / 2, (bottom - top) / 2));

  return [
    `M ${left + safeRadius} ${top}`,
    `H ${right - safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${right} ${top + safeRadius}`,
    `V ${bottom - safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${right - safeRadius} ${bottom}`,
    `H ${left + safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${left} ${bottom - safeRadius}`,
    `V ${top + safeRadius}`,
    `A ${safeRadius} ${safeRadius} 0 0 1 ${left + safeRadius} ${top}`,
    "Z"
  ].join(" ");
}

function updateButtonOutlines() {
  animatedButtons.forEach((button) => {
    const svg = button.querySelector(".button-outline");
    if (!svg) return;

    const rect = button.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    const computed = window.getComputedStyle(button);
    const borderWidth = parseFloat(computed.borderTopWidth) || 1;
    const radius = Math.min(parseFloat(computed.borderTopLeftRadius) || 0, width / 2, height / 2);
    const segmentRatio = parseFloat(computed.getPropertyValue("--trace-segment-ratio")) || 0.18;
    const gradient = svg.querySelector("linearGradient");
    const auraPath = svg.querySelector(".button-trace-aura");
    const glowPath = svg.querySelector(".button-trace-glow");
    const corePath = svg.querySelector(".button-trace-core");
    const isQuote = button.classList.contains("button-quote");
    const coreStroke = parseFloat(button.dataset.coreStroke || (isQuote ? "1.5" : "1.2"));
    const glowStroke = parseFloat(button.dataset.glowStroke || (isQuote ? "3.4" : "2.8"));
    const auraStroke = parseFloat(button.dataset.auraStroke || (isQuote ? "7.2" : "6.2"));
    const svgPadding = Math.ceil((auraStroke / 2) + (isQuote ? 5.2 : 4.6));
    const lineInset = Math.max(borderWidth * 0.16, 0.16);
    const outlineWidth = width + (svgPadding * 2);
    const outlineHeight = height + (svgPadding * 2);
    const outlinePath = buildRoundedRectPath(
      width,
      height,
      radius - lineInset,
      lineInset,
      svgPadding,
      svgPadding
    );

    button.style.setProperty("--trace-svg-pad", `${svgPadding}px`);

    svg.setAttribute("viewBox", `0 0 ${outlineWidth} ${outlineHeight}`);
    svg.setAttribute("width", `${outlineWidth}`);
    svg.setAttribute("height", `${outlineHeight}`);

    if (gradient) {
      gradient.setAttribute("x1", `${svgPadding}`);
      gradient.setAttribute("x2", `${svgPadding + width}`);
    }

    if (auraPath) {
      auraPath.setAttribute("d", outlinePath);
    }

    if (corePath) {
      corePath.setAttribute("d", outlinePath);
    }

    if (glowPath) {
      glowPath.setAttribute("d", outlinePath);
    }

    [
      { path: auraPath, scale: 1.8, minLength: isQuote ? 104 : 88 },
      { path: glowPath, scale: 1.18, minLength: isQuote ? 66 : 56 },
      { path: corePath, scale: 0.54, minLength: isQuote ? 34 : 28 }
    ].forEach(({ path, scale, minLength }) => {
      if (!path) return;

      const totalLength = path.getTotalLength();
      const segmentLength = Math.max(totalLength * segmentRatio * scale, minLength);
      const gapLength = Math.max(totalLength - segmentLength, 1);

      path.style.setProperty("--path-total", `${totalLength}`);
      path.style.setProperty("--path-segment", `${segmentLength}`);
      path.style.setProperty("--path-gap", `${gapLength}`);
    });
  });
}

decorateButtons();
setupCarousels();
setupNavHighlight();
setupVideoPlayback();

playlistButtons.forEach((button) => {
  button.addEventListener("click", () => setHeroVideo(button.dataset.video, button));
});

if (heroVideo) {
  const heroRotation = [
    "assets/videos/cyber-real-local.mp4",
    "assets/videos/store-promotion-local.mp4",
    "assets/videos/flower-expo-2025-reel-local.mp4"
  ];

  let currentIndex = 0;
  window.setInterval(() => {
    currentIndex = (currentIndex + 1) % heroRotation.length;
    const nextSrc = heroRotation[currentIndex];
    const matchedButton = playlistButtons.find((button) => button.dataset.video === nextSrc);
    setHeroVideo(nextSrc, matchedButton);
  }, 10000);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    getAutoplayVideos().forEach(updateManagedVideoState);
  }
});

window.addEventListener("pageshow", () => {
  getAutoplayVideos().forEach(updateManagedVideoState);
});

window.addEventListener("resize", () => {
  getAutoplayVideos().forEach(updateManagedVideoState);
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const project = formData.get("project")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";

    const subject = encodeURIComponent(`${portfolioConfig.brandName} inquiry | ${project}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject Type: ${project}\n\nDetails:\n${message}`
    );

    window.location.href = `mailto:${portfolioConfig.email}?subject=${subject}&body=${body}`;
  });
}

function buildSocialLinks(container) {
  if (!container) return;

  socialMeta.forEach(({ key, label, icon }) => {
    const link = document.createElement("a");
    link.className = "social-link";
    link.href = portfolioConfig.socialLinks[key];
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", label);
    link.title = label;
    link.innerHTML = `<svg aria-hidden="true"><use href="#${icon}"></use></svg>`;
    link.addEventListener("pointerup", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        window.setTimeout(() => link.blur(), 0);
      }
    });
    container.append(link);
  });
}

buildSocialLinks(socialLinksContainer);
buildSocialLinks(headerSocialsContainer);
