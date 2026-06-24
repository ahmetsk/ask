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
  let releaseTimer = 0;
  let x = 18;
  let y = 96;
  let velocityX = 0.11;
  let velocityY = 0.08;
  let lastFrame = 0;
  let isHeld = false;
  let reducedMotion = false;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function getBounds() {
    const size = floater.offsetWidth || 82;
    const pad = Number.parseFloat(getComputedStyle(floater).getPropertyValue("--floater-pad")) || 18;
    const header = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 68;
    const safeTop = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--safe-top")) || 0;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    return {
      minX: pad,
      minY: header + safeTop + pad,
      maxX: Math.max(pad, viewportWidth - size - pad),
      maxY: Math.max(header + safeTop + pad, viewportHeight - size - pad),
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

    if (!isHeld && !reducedMotion) {
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

  function holdFloater() {
    window.clearTimeout(releaseTimer);
    isHeld = true;
    clampPosition();
    renderFloater();
    floater.classList.remove("is-released");
    floater.classList.add("is-held");
    floater.setAttribute("aria-label", "ask loves you");
  }

  function releaseFloater() {
    if (!isHeld) {
      return;
    }

    isHeld = false;
    velocityX = Math.sign(velocityX || 1) * 0.16;
    velocityY = Math.sign(velocityY || 1) * 0.11;
    floater.classList.remove("is-held");
    floater.classList.add("is-released");
    floater.setAttribute("aria-label", "ask loves you, floating away");

    releaseTimer = window.setTimeout(() => {
      floater.classList.remove("is-released");
      floater.setAttribute("aria-label", "Press the floating ask picture");
    }, 1100);
  }

  floater.addEventListener("pointerdown", (event) => {
    holdFloater();

    if (floater.setPointerCapture) {
      floater.setPointerCapture(event.pointerId);
    }
  });

  floater.addEventListener("pointerup", releaseFloater);
  floater.addEventListener("pointercancel", releaseFloater);

  floater.addEventListener("keydown", (event) => {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (!isHeld) {
      holdFloater();
    }
  });

  floater.addEventListener("keyup", (event) => {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    releaseFloater();
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
