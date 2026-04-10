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

const contactForm = document.querySelector("#contact-form");
const socialLinksContainer = document.querySelector("#social-links");
const headerSocialsContainer = document.querySelector("#header-socials");
const reelsTrack = document.querySelector("#reels-track");
const buttons = [...document.querySelectorAll(".button")];
const animatedButtons = [...document.querySelectorAll(".button.button-trace")];
const carouselTracks = [...document.querySelectorAll("[data-carousel-track]")];
const carouselButtons = [...document.querySelectorAll(".carousel-arrow")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sectionJumpLinks = [...document.querySelectorAll('a[href^="#"]')];
const carouselLoopState = new WeakMap();
let lazyImageObserver;
let lazyEmbedObserver;

const socialMeta = [
  { key: "instagram", label: "Instagram", icon: "icon-instagram" },
  { key: "youtube", label: "YouTube", icon: "icon-youtube" },
  { key: "tiktok", label: "TikTok", icon: "icon-tiktok" },
  { key: "facebook", label: "Facebook", icon: "icon-facebook" },
  { key: "linkedin", label: "LinkedIn", icon: "icon-linkedin" }
];

const lazyPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Crect width='4' height='5' fill='%23070b12'/%3E%3C/svg%3E";

const youtubePortfolioUrls = [
  "https://youtu.be/ev7EIgz6dJY",
  "https://youtu.be/7w_gru17HaM",
  "https://youtu.be/z6aa1N2Swz4",
  "https://youtu.be/nHJ6-JmA2n4",
  "https://youtu.be/qfSjemQORHw",
  "https://youtu.be/lshflGPY8No",
  "https://youtu.be/KN2eVsQF1yk",
  "https://youtube.com/shorts/rOsloXLhuS8",
  "https://youtube.com/shorts/ZpB5iTG0-nw",
  "https://youtube.com/shorts/5Qsm_uifxgc",
  "https://youtube.com/shorts/cnW7qkP2VPg",
  "https://youtube.com/shorts/totjpDHeUh4",
  "https://youtube.com/shorts/n__Wbh7A9uM",
  "https://youtube.com/shorts/Ob4usvPjTBM",
  "https://youtube.com/shorts/JRuWjhBC_uo",
  "https://youtube.com/shorts/shu6ARrV2-Y",
  "https://youtube.com/shorts/8n1304fVahE",
  "https://youtube.com/shorts/31IU6OI26_w",
  "https://youtube.com/shorts/9ROyVC7Rn80",
  "https://youtube.com/shorts/B2FhvdYkiAM",
  "https://youtube.com/shorts/JiideAN1q2A",
  "https://youtube.com/shorts/52VRwf7hcFk",
  "https://youtube.com/shorts/hX7ZeoNUcWA",
  "https://youtube.com/shorts/TXHyjJ0rygI",
  "https://youtube.com/shorts/yL7eLAdg3CI",
  "https://youtube.com/shorts/pd56PvBOClU",
  "https://youtube.com/shorts/65j3FlGxeRo",
  "https://youtube.com/shorts/jyzjcfE5d7k",
  "https://youtube.com/shorts/CPhqGJOHJK0",
  "https://youtube.com/shorts/kYJ8qYedLOI",
  "https://youtu.be/j5ofvtqWQQ4",
  "https://youtube.com/shorts/2pBMOpu7fU8"
];

let traceIdCounter = 0;
let buttonResizeObserver;

const reelCopyOverrides = {
  ev7EIgz6dJY: {
    title: "Cobra Lounge Live",
    description: "Live music coverage with raw stage energy."
  },
  "7w_gru17HaM": {
    title: "Christmas Kisses",
    description: "Soft holiday mood with warm romantic tones."
  },
  z6aa1N2Swz4: {
    title: "Champagne and the Stars",
    description: "Glow, nightlife texture, and celebration energy."
  },
  "nHJ6-JmA2n4": {
    title: "Michangelo",
    description: "Character-led portrait work with strong presence."
  },
  qfSjemQORHw: {
    title: "Numb",
    description: "Dark, emotional pacing with immersive texture."
  },
  lshflGPY8No: {
    title: "Teach Me Jahreal",
    description: "Music-led visuals cut to rhythm and performance."
  },
  KN2eVsQF1yk: {
    title: "Unit Strength Powerlifting",
    description: "Strength, discipline, and explosive movement."
  },
  rOsloXLhuS8: {
    title: "Puff Puff Party",
    description: "Party energy, late-night mood, and crowd motion."
  },
  "ZpB5iTG0-nw": {
    title: "The Walk",
    description: "Confidence, motion, and clean street framing."
  },
  "5Qsm_uifxgc": {
    title: "Mr Kimchi",
    description: "Food and brand detail with punchy pacing."
  },
  cnW7qkP2VPg: {
    title: "Taekwondo Championship",
    description: "Fast sports coverage built on speed and impact."
  },
  totjpDHeUh4: {
    title: "Lovin' On Me BTS",
    description: "Behind-the-scenes motion and on-set energy."
  },
  n__Wbh7A9uM: {
    title: "Nachos",
    description: "Food texture and close detail in quick cuts."
  },
  Ob4usvPjTBM: {
    title: "Lovin' On Me",
    description: "Sharp performance pacing with attitude."
  },
  JRuWjhBC_uo: {
    title: "Lost In Thought",
    description: "Reflective mood, stillness, and calm pacing."
  },
  "shu6ARrV2-Y": {
    title: "Corvette",
    description: "Sleek car detail with bold motion."
  },
  "8n1304fVahE": {
    title: "For The Immigrants",
    description: "Emotion, identity, and purposeful framing."
  },
  "31IU6OI26_w": {
    title: "Cyber Cryptic",
    description: "Experimental digital mood with darker tones."
  },
  "9ROyVC7Rn80": {
    title: "Felipe Music Video",
    description: "Artist-focused visuals cut to rhythm."
  },
  B2FhvdYkiAM: {
    title: "Chicago Intro",
    description: "Chicago atmosphere, movement, and urban detail."
  },
  JiideAN1q2A: {
    title: "Flower Expo 2025",
    description: "Color, detail, and event atmosphere."
  },
  "52VRwf7hcFk": {
    title: "Floridas Nature",
    description: "Natural light, calm motion, and atmosphere."
  },
  hX7ZeoNUcWA: {
    title: "Chicago Rain",
    description: "Rain, reflections, and moody street texture."
  },
  TXHyjJ0rygI: {
    title: "Chicago Bands",
    description: "Live band energy and crowd reaction."
  },
  yL7eLAdg3CI: {
    title: "Butterfly Sanctuary",
    description: "Soft color, motion, and quiet nature detail."
  },
  pd56PvBOClU: {
    title: "Bar On Buena",
    description: "Venue mood, space, and nightlife energy."
  },
  "65j3FlGxeRo": {
    title: "2025 Year-End",
    description: "A fast recap full of momentum."
  },
  jyzjcfE5d7k: {
    title: "Moon Rules Appy - Hate It",
    description: "Raw, darker music visuals with attitude."
  },
  CPhqGJOHJK0: {
    title: "Khepri Cafe Grand Opening",
    description: "Opening-day crowd, brand energy, and atmosphere."
  },
  kYJ8qYedLOI: {
    title: "All American Rejects Pop-Up",
    description: "Surprise performance energy and crowd reaction."
  },
  j5ofvtqWQQ4: {
    title: "Natural Dent Testimonial",
    description: "Clean testimonial-focused storytelling with a polished feel."
  },
  "2pBMOpu7fU8": {
    title: "Med Spa",
    description: "Polished beauty and wellness visuals with a clean commercial feel."
  }
};

function extractYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1).split("/")[0];
    }

    if (host.endsWith("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/")[2] || "";
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || "";
      }

      if (parsed.searchParams.get("v")) {
        return parsed.searchParams.get("v") || "";
      }
    }
  } catch (_) {
    return "";
  }

  return "";
}

function buildYouTubeEmbedSrc(id) {
  const origin = encodeURIComponent(window.location.origin);
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1&origin=${origin}`;
}

function buildYouTubeWatchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}

function buildYouTubeThumbnail(id) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function getReelCopy(id, fallbackTitle, fallbackDescription) {
  return reelCopyOverrides[id] || {
    title: fallbackTitle,
    description: fallbackDescription
  };
}

function buildReelEntries() {
  let featureCount = 0;
  let shortCount = 0;

  return youtubePortfolioUrls
    .map((url) => {
      const id = extractYouTubeId(url);
      const isShort = url.includes("/shorts/");

      if (!id) {
        return null;
      }

      if (isShort) {
        shortCount += 1;
      } else {
        featureCount += 1;
      }

      return {
        id,
        url: buildYouTubeWatchUrl(id),
        label: isShort ? "Social Short" : "Featured Video",
        ...getReelCopy(
          id,
          isShort
          ? `Short Form ${String(shortCount).padStart(2, "0")}`
          : `Featured Edit ${String(featureCount).padStart(2, "0")}`,
          isShort
          ? "Autoplaying YouTube short preview built to keep the site lighter on bandwidth."
          : "Autoplaying YouTube embed that keeps the portfolio cinematic without hosting the video on the site."
        )
      };
    })
    .filter(Boolean);
}

function createReelCard(entry) {
  const card = document.createElement("article");
  const shell = document.createElement("div");
  const poster = document.createElement("img");
  const meta = document.createElement("div");

  card.className = "carousel-card reel-card";
  card.dataset.youtubeId = entry.id;
  card.dataset.youtubeTitle = entry.title;

  shell.className = "reel-media-shell";

  poster.className = "reel-embed-poster lazy-media";
  poster.src = lazyPlaceholder;
  poster.dataset.lazySrc = buildYouTubeThumbnail(entry.id);
  poster.alt = `${entry.title} video thumbnail`;
  poster.loading = "lazy";
  poster.decoding = "async";

  meta.className = "carousel-meta";
  meta.innerHTML = `
    <span>${entry.title}</span>
  `;

  shell.append(poster);
  card.append(shell, meta);

  return card;
}

function renderReels() {
  if (!reelsTrack) return;
  if (reelsTrack.children.length) return;

  const fragment = document.createDocumentFragment();

  buildReelEntries().forEach((entry) => {
    fragment.append(createReelCard(entry));
  });

  reelsTrack.replaceChildren(fragment);
}

function syncStaticReelCopy() {
  const entriesById = new Map(buildReelEntries().map((entry) => [entry.id, entry]));
  const reelCards = [...document.querySelectorAll(".reel-card[data-youtube-id]")];

  reelCards.forEach((card) => {
    const entry = entriesById.get(card.dataset.youtubeId);
    if (!entry) return;

    card.dataset.youtubeTitle = entry.title;

    const labelNode = card.querySelector(".carousel-meta span");
    const titleNode = card.querySelector(".carousel-meta h3");
    const descriptionNode = card.querySelector(".carousel-meta p");
    const creditNode = card.querySelector(".carousel-meta strong");
    const poster = card.querySelector(".reel-embed-poster");

    if (labelNode) {
      labelNode.textContent = entry.title;
    }

    if (titleNode) {
      titleNode.remove();
    }

    if (descriptionNode) {
      descriptionNode.remove();
    }

    if (creditNode) {
      creditNode.remove();
    }

    if (poster) {
      poster.alt = `${entry.title} video thumbnail`;
      poster.dataset.lazySrc = buildYouTubeThumbnail(entry.id);
    }
  });
}

function loadLazyImage(image) {
  if (!image || image.dataset.lazyLoaded === "true" || image.dataset.lazyRequested === "true") return;

  const nextSrc = image.dataset.lazySrc;
  if (!nextSrc) return;

  image.dataset.lazyRequested = "true";

  image.addEventListener(
    "load",
    () => {
      image.classList.add("is-loaded");
      image.dataset.lazyLoaded = "true";
      delete image.dataset.lazyRequested;
    },
    { once: true }
  );

  image.addEventListener(
    "error",
    () => {
      delete image.dataset.lazyRequested;
    },
    { once: true }
  );

  image.src = nextSrc;
}

function setupLazyImages() {
  const lazyImages = [...document.querySelectorAll("img[data-lazy-src]")];

  lazyImages.forEach((image) => {
    loadLazyImage(image);
  });
}

function mountReelEmbed(card, loading = "lazy") {
  if (!card || card.dataset.activeMedia === "true") return;

  const shell = card.querySelector(".reel-media-shell");
  const videoId = card.dataset.youtubeId;
  const videoTitle = card.dataset.youtubeTitle || `${portfolioConfig.brandName} portfolio video`;
  const poster = card.querySelector("img[data-lazy-src]");

  if (!shell || !videoId) return;

  loadLazyImage(poster);

  const iframe = document.createElement("iframe");
  iframe.className = "reel-embed-iframe";
  iframe.src = buildYouTubeEmbedSrc(videoId);
  iframe.title = videoTitle;
  iframe.loading = loading;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture; web-share";
  iframe.allowFullscreen = true;

  shell.append(iframe);
  card.dataset.activeMedia = "true";
}

function unmountReelEmbed(card) {
  if (!card) return;

  const iframe = card.querySelector(".reel-embed-iframe");
  if (iframe) {
    iframe.remove();
  }

  card.dataset.activeMedia = "false";
}

function setupReelEmbeds() {
  const reelCards = [...document.querySelectorAll(".reel-card[data-youtube-id]")];
  if (!reelCards.length) return;

  reelCards.forEach((card) => {
    const poster = card.querySelector("img[data-lazy-src]");
    if (poster) {
      loadLazyImage(poster);
    }
  });

  const queueSync = () => {
    window.requestAnimationFrame(syncVisibleReels);
  };

  reelsTrack?.addEventListener("scroll", queueSync, { passive: true });
  window.addEventListener("scroll", queueSync, { passive: true });
  window.addEventListener("resize", queueSync);
  window.addEventListener("pageshow", queueSync);
  window.addEventListener("load", queueSync, { once: true });

  queueSync();
  window.setTimeout(queueSync, 160);
  window.setTimeout(queueSync, 420);
}

function getCardVisibilityRatio(card) {
  if (!card) return 0;

  const rect = card.getBoundingClientRect();
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
  const totalArea = Math.max(rect.width * rect.height, 1);
  const visibleArea = visibleWidth * visibleHeight;

  return visibleArea / totalArea;
}

function syncVisibleReels() {
  const reelCards = [...document.querySelectorAll(".reel-card[data-youtube-id]")];

  reelCards.forEach((card) => {
    const poster = card.querySelector("img[data-lazy-src]");
    const visibilityRatio = getCardVisibilityRatio(card);

    if (visibilityRatio > 0.01) {
      loadLazyImage(poster);
    }

    if (visibilityRatio >= 0.04) {
      mountReelEmbed(card, "eager");
      return;
    }

    unmountReelEmbed(card);
  });
}

function setupLazyEmbeds() {
  const reelCards = [...document.querySelectorAll(".reel-card[data-youtube-id]")];

  reelCards.forEach((card) => {
    const poster = card.querySelector("img[data-lazy-src]");
    if (!poster) return;

    if (poster.dataset.lazySrc?.includes("https://i.ytimg.com/vi/")) {
      poster.dataset.lazySrc = poster.dataset.lazySrc.replace(
        "https://i.ytimg.com/vi/",
        "https://img.youtube.com/vi/"
      );
    }
  });

  if (lazyEmbedObserver) {
    lazyEmbedObserver.disconnect();
  }

  lazyEmbedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        const poster = card.querySelector("img[data-lazy-src]");
        const shouldActivate = entry.isIntersecting && entry.intersectionRatio >= 0.04;

        if (entry.isIntersecting) {
          loadLazyImage(poster);
        }

        if (shouldActivate) {
          mountReelEmbed(card);
          return;
        }

        unmountReelEmbed(card);
      });
    },
    { rootMargin: "320px", threshold: [0, 0.02, 0.04, 0.1, 0.25, 0.5] }
  );

  reelCards.forEach((card) => {
    card.dataset.activeMedia = "false";
    lazyEmbedObserver.observe(card);
  });

  if (reelsTrack) {
    let syncFrame = 0;
    const queueSync = () => {
      window.cancelAnimationFrame(syncFrame);
      syncFrame = window.requestAnimationFrame(syncVisibleReels);
    };

    reelsTrack.addEventListener("scroll", queueSync, { passive: true });
    window.addEventListener("scroll", queueSync, { passive: true });
    window.addEventListener("resize", queueSync);
    window.addEventListener("pageshow", queueSync);
    window.addEventListener("load", queueSync, { once: true });
    queueSync();
    window.setTimeout(queueSync, 180);
    window.setTimeout(queueSync, 500);
  } else {
    window.requestAnimationFrame(syncVisibleReels);
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
  const topSection = document.querySelector("#top");
  const portfolioSection = document.querySelector("#films");
  const contactSection = document.querySelector("#contact");
  const sectionTargets = {
    "#top": topSection,
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

  const getCleanUrl = () => `${window.location.pathname}${window.location.search}`;

  const clearAddressBarHash = () => {
    if (!window.location.hash) return;
    window.history.replaceState(null, "", getCleanUrl());
  };

  const scrollToSectionHash = (targetHash, behavior = "smooth") => {
    if (targetHash === "#top") {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const targetSection = sectionTargets[targetHash];
    if (!targetSection) return;

    const headerOffset = header?.offsetHeight || 0;
    const targetTop = window.scrollY + targetSection.getBoundingClientRect().top - headerOffset - 16;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior
    });
  };

  sectionJumpLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !sectionTargets[href]) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      lockNavTo(href);
      clearAddressBarHash();
      scrollToSectionHash(href);
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

  if (window.location.hash && sectionTargets[window.location.hash]) {
    const initialHash = window.location.hash;
    window.requestAnimationFrame(() => {
      scrollToSectionHash(initialHash, "auto");
      clearAddressBarHash();
    });
  } else if (window.location.hash) {
    clearAddressBarHash();
  }

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
  if (track.dataset.skipLoop === "true") return;

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
  if (track.dataset.skipLoop === "true") {
    track.dataset.carouselLoopReady = "true";
    return;
  }

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

renderReels();
syncStaticReelCopy();
decorateButtons();
setupCarousels();
setupNavHighlight();
setupLazyImages();
setupReelEmbeds();

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
