/* ---------------- LOAD MORE ---------------- */

let PAGE_SIZE = 6;
let visibleCount = PAGE_SIZE;

const grid = document.getElementById("grid");
const resultCount = document.getElementById("resultCount");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const loadStatus = document.getElementById("loadStatus");
const activeChips = document.getElementById("activeChips");

/* All product cards currently in the DOM, in document order.
     Filtering/sorting are not wired up (per the original code),
     so this is just the static list of 15 cards. */
const allCards = Array.from(grid.querySelectorAll(".card"));

/* ---- core render: show first N cards, hide the rest ---- */
function render({ append = false } = {}) {
  const total = allCards.length;

  // clamp so we never claim to show more than exist
  if (visibleCount > total) visibleCount = total;

  allCards.forEach((card, i) => {
    card.style.display = i < visibleCount ? "" : "none";
  });

  resultCount.textContent = `${total} bike${total === 1 ? "" : "s"}`;

  const doneAll = visibleCount >= total;

  loadMoreBtn.style.display = doneAll ? "none" : "";
  loadMoreBtn.disabled = false;
  loadMoreBtn.classList.remove("is-loading");

  loadStatus.textContent = doneAll ? "" : `Showing ${visibleCount} of ${total}`;
}

/* Wishlist has no saved state — clicking the heart just toggles
     its active state (color) on that card's icon, same as compare. */
function toggleWishlist(btn) {
  btn.classList.toggle("active");
}

/* Compare has no bar/notification — clicking the button just
     toggles its active state (color) on that card's icon. */
function toggleCompare(id, btn) {
  btn.classList.toggle("active");
}

/* Filter checkboxes and price slider are layout only — no
     filtering JS is wired to them. */
document.getElementById("clearFilters").addEventListener("click", () => {
  document
    .querySelectorAll(".filter-options input")
    .forEach((i) => (i.checked = false));
  document.getElementById("priceMin").value = 650;
  document.getElementById("priceMax").value = 1300;
  updateRangeFill();
});

loadMoreBtn.addEventListener("click", () => {
  loadMoreBtn.disabled = true;
  loadMoreBtn.classList.add("is-loading");
  setTimeout(() => {
    visibleCount += PAGE_SIZE;
    render({ append: true });
  }, 350);
});

/* ---- dual price range slider ---- */
const priceMin = document.getElementById("priceMin");
const priceMax = document.getElementById("priceMax");
const rangeFill = document.getElementById("rangeFill");
const priceMinLabel = document.getElementById("priceMinLabel");
const priceMaxLabel = document.getElementById("priceMaxLabel");

function updateRangeFill() {
  const min = parseInt(priceMin.min, 10),
    max = parseInt(priceMin.max, 10);
  let a = parseInt(priceMin.value, 10),
    b = parseInt(priceMax.value, 10);
  if (a > b) {
    [a, b] = [b, a];
  }
  const pctA = ((a - min) / (max - min)) * 100;
  const pctB = ((b - min) / (max - min)) * 100;
  rangeFill.style.left = pctA + "%";
  rangeFill.style.right = 100 - pctB + "%";
  priceMinLabel.textContent = "€" + a.toLocaleString("de-DE");
  priceMaxLabel.textContent = "€" + b.toLocaleString("de-DE");
}
[priceMin, priceMax].forEach((inp) => {
  inp.addEventListener("input", () => {
    if (parseInt(priceMin.value, 10) > parseInt(priceMax.value, 10) - 10) {
      if (inp === priceMin) priceMin.value = parseInt(priceMax.value, 10) - 10;
      else priceMax.value = parseInt(priceMin.value, 10) + 10;
    }
    updateRangeFill();
  });
});
updateRangeFill();

/* ---- FAQ single-open accordion (animated) ---- */
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  btn.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((o) => {
      o.classList.remove("open");
      o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---- mobile filter drawer ---- */
const filterPanel = document.getElementById("filterPanel");
const backdrop = document.getElementById("backdrop");
document.getElementById("openDrawer").addEventListener("click", () => {
  filterPanel.classList.add("open");
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
});
function closeDrawer() {
  filterPanel.classList.remove("open");
  backdrop.classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
backdrop.addEventListener("click", closeDrawer);

/* ---- sticky header: solid background past hero, hide on scroll-down, reveal on scroll-up ---- */
const siteHeader = document.getElementById("siteHeader");
const heroBanner = document.getElementById("heroBanner");
let lastY = window.scrollY;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    const heroBottom = heroBanner.offsetTop + heroBanner.offsetHeight;

    siteHeader.classList.toggle("is-solid", y > heroBottom - 90);

    if (y > lastY && y > 140) {
      siteHeader.classList.add("is-hidden");
    } else {
      siteHeader.classList.remove("is-hidden");
    }
    lastY = y;
  },
  { passive: true },
);

render();
