/* OliMy : comportements légers, sans dépendance.
   1. Statut ouvert / fermé calculé en direct (heure de Zurich)
   2. Jour actuel mis en évidence dans les horaires
   3. Apparition au défilement (IntersectionObserver)
   4. Menu : onglets suivis au défilement + filtre végétarien
   5. Plan chargé au clic */

const DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

/** Heure locale de Lausanne, quel que soit le fuseau du visiteur. */
function zurichNow() {
  const parts = new Intl.DateTimeFormat("fr-CH", {
    timeZone: "Europe/Zurich",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
  const weekday = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"].findIndex((d) => get("weekday").toLowerCase().startsWith(d));
  return { day: weekday, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
};

function ruleFor(hours, day) {
  return hours.find((rule) => rule.days.includes(day));
}

/** Décrit l'état actuel : ouvert jusqu'à..., ou fermé jusqu'à la prochaine ouverture. */
function describeStatus(hours) {
  const { day, minutes } = zurichNow();
  const today = ruleFor(hours, day);
  if (today && !today.closed) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { open: true, text: `Ouvert, ferme à ${formatTime(today.close)}` };
    }
    if (minutes < open) {
      return { open: false, text: `Fermé, ouvre à ${formatTime(today.open)}` };
    }
  }
  for (let offset = 1; offset <= 7; offset += 1) {
    const next = (day + offset) % 7;
    const rule = ruleFor(hours, next);
    if (rule && !rule.closed) {
      const when = offset === 1 ? "demain" : DAY_NAMES[next];
      return { open: false, text: `Fermé, ouvre ${when} à ${formatTime(rule.open)}` };
    }
  }
  return { open: false, text: "Fermé" };
}

function initStatus() {
  const data = document.getElementById("hours-data");
  const targets = document.querySelectorAll("[data-status]");
  if (!data || !targets.length) return;
  let hours;
  try {
    hours = JSON.parse(data.textContent);
  } catch {
    return;
  }
  const render = () => {
    const state = describeStatus(hours);
    targets.forEach((el) => {
      el.textContent = state.text;
      el.classList.toggle("is-open", state.open);
      el.classList.toggle("is-closed", !state.open);
      el.hidden = false;
    });
  };
  render();
  window.setInterval(render, 60_000);
}

function initTodayRow() {
  const { day } = zurichNow();
  document.querySelectorAll("[data-days]").forEach((row) => {
    const days = row.dataset.days.split(",").map(Number);
    row.classList.toggle("is-today", days.includes(day));
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}

function initMenuTabs() {
  const tabs = [...document.querySelectorAll(".tabs a")];
  const sections = [...document.querySelectorAll(".cat")];
  if (!tabs.length || !sections.length) return;

  const strip = tabs[0].parentElement;
  const setActive = (id) => {
    tabs.forEach((tab) => {
      const active = tab.getAttribute("href") === `#${id}`;
      tab.classList.toggle("is-active", active);
      if (active) {
        // Centre l'onglet dans la barre, sans toucher au défilement vertical de la page.
        const left = tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2;
        strip.scrollTo({ left, behavior: "smooth" });
      }
    });
  };

  // La section « active » est celle qui occupe le haut de l'écran, sous la barre collante.
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5, 1] },
  );
  sections.forEach((s) => io.observe(s));
  setActive(sections[0].id);
}

function initVegFilter() {
  const toggle = document.querySelector(".veg-toggle");
  if (!toggle) return;
  const cats = [...document.querySelectorAll(".cat")];
  cats.forEach((cat) => {
    if (!cat.querySelector(".item.is-veg")) cat.classList.add("is-empty");
  });
  const apply = (on) => {
    toggle.setAttribute("aria-pressed", String(on));
    document.body.classList.toggle("veg-only", on);
  };
  toggle.addEventListener("click", () => apply(toggle.getAttribute("aria-pressed") !== "true"));
}

function initMap() {
  const map = document.querySelector(".map[data-src]");
  if (!map) return;
  const button = map.querySelector("button");
  button?.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = map.dataset.src;
    iframe.title = "Plan d'accès à OliMy, avenue de Cour 67, Lausanne";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;
    map.replaceChildren(iframe);
  });
}

initStatus();
initTodayRow();
initReveal();
initMenuTabs();
initVegFilter();
initMap();
