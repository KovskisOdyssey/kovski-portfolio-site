/* ===== theme toggle =====
   The initial theme is applied by the inline script in <head>
   (before first paint) — this file only handles the button. */

const toggle = document.getElementById("theme-toggle");

function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
}

function syncTogglePressed() {
    toggle.setAttribute("aria-pressed", String(currentTheme() === "light"));
}

if (toggle) {
    toggle.addEventListener("click", () => {
        const next = currentTheme() === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        try {
            localStorage.setItem("theme", next);
        } catch (e) {
            /* storage unavailable (private mode) — theme still switches for this visit */
        }
        syncTogglePressed();
    });
    syncTogglePressed();
}

/* ===== typewriter ===== */

// TODO(human): pick the words and pacing that sound like you.
const WORDS = ["Designing", "Branding", "Illustrating", "Animating", "Building"];
const TYPE_MS = 90;     // delay per character while typing
const DELETE_MS = 45;   // delay per character while deleting
const HOLD_MS = 1700;   // pause on a completed word

const typewriterTarget = document.querySelector(".typewriter-text");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typewriterTarget && WORDS.length > 0) {
    if (reduceMotion) {
        typewriterTarget.textContent = WORDS[0];
    } else {
        let wordIndex = 0;
        let length = 0;
        let deleting = false;

        (function tick() {
            const word = WORDS[wordIndex];
            length += deleting ? -1 : 1;
            typewriterTarget.textContent = word.slice(0, length);

            let delay = deleting ? DELETE_MS : TYPE_MS;
            if (!deleting && length === word.length) {
                deleting = true;
                delay = HOLD_MS;
            } else if (deleting && length === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % WORDS.length;
                delay = TYPE_MS * 3;
            }
            setTimeout(tick, delay);
        })();
    }
}
