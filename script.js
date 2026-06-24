const optionButtons = document.querySelectorAll(".ask-panel button");
const form = document.querySelector(".waitlist-form");
const emailInput = document.querySelector("#email");
const formNote = document.querySelector("#form-note");
const floater = document.querySelector("[data-floater]");

function selectOption(button) {
  if (!button) {
    return;
  }

  optionButtons.forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");
}

optionButtons.forEach((button) => {
  button.addEventListener("click", () => selectOption(button));
});

if (form && emailInput && formNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!emailInput.checkValidity() || email.length > 254) {
      formNote.textContent = "Enter a valid email address first.";
      emailInput.focus();
      return;
    }

    const subject = encodeURIComponent("ask.pictures early access");
    const body = encodeURIComponent(
      `Please add me to the ask.pictures early interest list.\n\nEmail: ${email}`
    );

    formNote.textContent = "Opening your email app so you can send the request.";
    window.location.href = `mailto:hello@ask.pictures?subject=${subject}&body=${body}`;
  });
}

if (floater) {
  const loveVisibleMs = 2000;
  let loveTimer = 0;
  let x = 46;
  let y = 230;
  let velocityX = 0.055;
  let velocityY = 0.04;
  let lastFrame = 0;
  let isShowingLove = false;
  let reducedMotion = false;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function getBounds() {
    const size = floater.offsetWidth || 82;
    const pad = Number.parseFloat(getComputedStyle(floater).getPropertyValue("--floater-pad")) || 18;
    const header = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 68;
    const safeTop = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--safe-top")) || 0;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const bubbleClearance = Math.min(32, Math.max(18, size * 0.35));
    const headlineClearance = Math.min(170, Math.max(108, viewportHeight * 0.18));
    const minY = header + safeTop + pad + headlineClearance;

    return {
      minX: pad + bubbleClearance,
      minY,
      maxX: Math.max(pad + bubbleClearance, viewportWidth - size - pad - bubbleClearance),
      maxY: Math.max(minY, viewportHeight - size - pad),
    };
  }

  function clampPosition() {
    const bounds = getBounds();
    x = Math.min(Math.max(x, bounds.minX), bounds.maxX);
    y = Math.min(Math.max(y, bounds.minY), bounds.maxY);
  }

  function renderFloater() {
    floater.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }

  function updateMotionPreference() {
    reducedMotion = motionQuery.matches;
    clampPosition();
    renderFloater();
  }

  function moveFloater(timestamp) {
    if (!lastFrame) {
      lastFrame = timestamp;
    }

    const elapsed = Math.min(timestamp - lastFrame, 34);
    lastFrame = timestamp;

    if (!isShowingLove && !reducedMotion) {
      const bounds = getBounds();
      x += velocityX * elapsed;
      y += velocityY * elapsed;

      if (x <= bounds.minX || x >= bounds.maxX) {
        x = Math.min(Math.max(x, bounds.minX), bounds.maxX);
        velocityX *= -1;
      }

      if (y <= bounds.minY || y >= bounds.maxY) {
        y = Math.min(Math.max(y, bounds.minY), bounds.maxY);
        velocityY *= -1;
      }

      renderFloater();
    }

    window.requestAnimationFrame(moveFloater);
  }

  function hideLove() {
    if (!isShowingLove) {
      return;
    }

    isShowingLove = false;
    floater.classList.remove("is-loved");
    floater.setAttribute("aria-label", "Show the ask loves you message");
  }

  function showLove() {
    window.clearTimeout(loveTimer);
    isShowingLove = true;
    clampPosition();
    renderFloater();
    floater.classList.remove("is-loved");
    // Force a reflow so repeated taps restart the 2-second CSS animation.
    void floater.offsetWidth;
    floater.classList.add("is-loved");
    floater.setAttribute("aria-label", "ask loves you");

    loveTimer = window.setTimeout(hideLove, loveVisibleMs);
  }

  floater.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    showLove();
  });

  floater.addEventListener("keydown", (event) => {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    if (event.repeat) {
      return;
    }

    showLove();
  });

  window.addEventListener("resize", () => {
    clampPosition();
    renderFloater();
  });

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", updateMotionPreference);
  }

  updateMotionPreference();
  window.requestAnimationFrame(moveFloater);
}
