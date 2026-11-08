/* Flugzeugbesteck — Sample data and render helpers for the drafts.
   All pages draw from this stock: home page (latest/featured),
   collection (entries) and record page (cutlery drawer). */

interface Airline {
  name: string;
  land: string;
  notiz: string;
}

interface Gruppe {
  name: string;
  notiz: string;
}

interface Teil {
  name: string;
  vorhanden: boolean;
  bild?: string | null;
  alt?: string;
}

interface Datensatz {
  id: string;
  titel: string;
  airline: string;
  type: string;
  material: string;
  aera: string;
  datum: string;
  teile: Teil[];
}

type Zaehlschluessel = "airline" | "type" | "material";

interface FBApi {
  airlines: Airline[];
  types: Gruppe[];
  materials: Gruppe[];
  datensaetze: Datensatz[];
  byid(id: string): Datensatz | null;
  renderLatest(el: HTMLElement | null, anzahl?: number): void;
  renderAirlines(el: HTMLElement | null): void;
  renderListe(el: HTMLElement | null, key: "type" | "material", quelle?: Gruppe[]): void;
  renderDrawer(el: HTMLElement | null, d: Datensatz | null): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Erweiterung des globalen Window-Typs
interface Window {
  FB: FBApi;
}

(function () {
  /* Marks the active script: the drawer stays fully visible without JS. */
  document.documentElement.classList.add("js");

  const MONATE = ["Jan.", "Feb.", "Mär.", "Apr.", "Mai", "Jun.", "Jul.", "Aug.", "Sep.", "Okt.", "Nov.", "Dez."];

  function zaehle(key: Zaehlschluessel, wert: string): number {
    return FB.datensaetze.filter((d) => d[key] === wert).length;
  }

  function datum(iso: string): { tag: string; monat: string; jahr: string } {
    const t = iso.split("-");
    return { tag: t[2], monat: MONATE[parseInt(t[1], 10) - 1], jahr: t[0] };
  }

  function schubladenText(d: Datensatz): string {
    const teile = d.teile;
    const haben = teile.filter((p) => p.vorhanden).length;
    return teile.length > 1 ? "Schublade: " + haben + " von " + teile.length + " Teilen" : "Einzelteil · vollständig";
  }

  const FB: FBApi = {
    airlines: [
      { name: "Lufthansa", land: "Deutschland", notiz: "Kranich-Emblem · Bestand im Aufbau" },
      { name: "Hapag-Lloyd", land: "Deutschland", notiz: "Fusion von 1970 · Flug- und Seereisen" },
      { name: "Pan Am", land: "USA", notiz: "Der Klassiker der Jet-Ära" },
      { name: "Ohne Emblem", land: "Unbekannt", notiz: "Stücke ohne erkennbare Herkunft" }
    ],
    types: [
      { name: "Löffel", notiz: "Für Kaffee, Suppe und Nachtisch" },
      { name: "Messer", notiz: "Der Klassiker im Sitztaschenfach" },
      { name: "Gabel", notiz: "Vom Kuchenhäppchen bis zum Bordmahl" },
      { name: "Geschirr", notiz: "Schalen, Teller und Behälter" }
    ],
    materials: [
      { name: "Edelstahl", notiz: "Der Standard an Bord" },
      { name: "Porzellan", notiz: "Geschirr mit Firmenwappen" },
      { name: "Kunststoff", notiz: "Leichtgewicht der späten Ära" }
    ],
    datensaetze: [
      {
        id: "fb-lh-001",
        titel: "Bordbesteck, 3-teilig",
        airline: "Lufthansa",
        type: "Messer",
        material: "Edelstahl",
        aera: "1970er Jahre",
        datum: "2026-10-28",
        teile: [
          { name: "Bordmesser", vorhanden: true, bild: "images/knife.svg", alt: "Zeichnung: Bordmesser" },
          { name: "Bordgabel", vorhanden: true, bild: null },
          { name: "Bordlöffel", vorhanden: false, bild: null }
        ]
      },
      {
        id: "fb-lh-002",
        titel: "Teelöffel",
        airline: "Lufthansa",
        type: "Löffel",
        material: "Edelstahl",
        aera: "1960er Jahre",
        datum: "2026-10-14",
        teile: [{ name: "Teelöffel", vorhanden: true, bild: "images/spoon-helsinki.svg", alt: "Zeichnungsblatt: Teelöffel" }]
      },
      {
        id: "fb-hl-001",
        titel: "Dessertbesteck, 3-teilig",
        airline: "Hapag-Lloyd",
        type: "Gabel",
        material: "Edelstahl",
        aera: "1970er Jahre",
        datum: "2026-10-02",
        teile: [
          { name: "Dessertmesser", vorhanden: true, bild: null },
          { name: "Kuchengabel", vorhanden: true, bild: null },
          { name: "Dessertlöffel", vorhanden: true, bild: null }
        ]
      },
      {
        id: "fb-hl-002",
        titel: "Suppenlöffel",
        airline: "Hapag-Lloyd",
        type: "Löffel",
        material: "Edelstahl",
        aera: "1970er Jahre",
        datum: "2026-09-21",
        teile: [{ name: "Suppenlöffel", vorhanden: true, bild: null }]
      },
      {
        id: "fb-lh-003",
        titel: "Tiefe Schale",
        airline: "Lufthansa",
        type: "Geschirr",
        material: "Porzellan",
        aera: "1970er Jahre",
        datum: "2026-09-07",
        teile: [{ name: "Tiefe Schale", vorhanden: true, bild: null }]
      },
      {
        id: "fb-oe-001",
        titel: "Dessertteller",
        airline: "Ohne Emblem",
        type: "Geschirr",
        material: "Porzellan",
        aera: "1960er Jahre",
        datum: "2026-08-30",
        teile: [{ name: "Dessertteller", vorhanden: true, bild: null }]
      },
      {
        id: "fb-lh-004",
        titel: "Dessertmesser",
        airline: "Lufthansa",
        type: "Messer",
        material: "Edelstahl",
        aera: "1970er Jahre",
        datum: "2026-08-12",
        teile: [{ name: "Dessertmesser", vorhanden: true, bild: null }]
      },
      {
        id: "fb-pa-001",
        titel: "Kuchengabel",
        airline: "Pan Am",
        type: "Gabel",
        material: "Edelstahl",
        aera: "1960er Jahre",
        datum: "2026-07-05",
        teile: [{ name: "Kuchengabel", vorhanden: true, bild: null }]
      }
    ],

    byid(id: string): Datensatz | null {
      return FB.datensaetze.filter((d) => d.id === id)[0] || null;
    },

    /* Home page — latest entries (chronological) */
    renderLatest(el: HTMLElement | null, anzahl = 5): void {
      if (!el) return;
      const liste = FB.datensaetze
        .slice()
        .sort((a, b) => (a.datum < b.datum ? 1 : -1))
        .slice(0, anzahl);
      el.innerHTML = liste
        .map((d) => {
          const z = datum(d.datum);
          return (
            '<a class="latest__row" href="detail.html">' +
            '<span class="latest__date"><span class="latest__day">' +
            z.tag +
            "</span>" +
            '<span class="latest__month">' +
            z.monat +
            " " +
            z.jahr +
            "</span></span>" +
            '<span class="latest__main"><span class="latest__title">' +
            d.titel +
            "</span>" +
            '<span class="latest__meta">' +
            d.airline +
            " · " +
            d.type +
            " · " +
            d.material +
            "</span></span>" +
            '<span class="latest__side"><span class="chip chip--outline">' +
            d.type +
            "</span>" +
            '<span class="latest__note small">' +
            schubladenText(d) +
            "</span></span>" +
            "</a>"
          );
        })
        .join("");
    },

    /* Collection — entry by airline (timetable rows) */
    renderAirlines(el: HTMLElement | null): void {
      if (!el) return;
      el.innerHTML = FB.airlines
        .map((a) => {
          const n = zaehle("airline", a.name);
          return (
            '<a class="timetable__row" href="detail.html" title="Beispiel-Datensatz dieser Gesellschaft">' +
            '<span class="crest" role="img" aria-label="Platzhalter: Emblem folgt">Emblem folgt</span>' +
            '<span><span class="timetable__name">' +
            a.name +
            "</span><br>" +
            '<span class="timetable__sub">' +
            a.land +
            " · " +
            a.notiz +
            "</span></span>" +
            '<span class="timetable__go">' +
            n +
            (n === 1 ? " Datensatz" : " Datensätze") +
            " anzeigen</span>" +
            "</a>"
          );
        })
        .join("");
    },

    /* Collection — further entries (type, material) */
    renderListe(el: HTMLElement | null, key: "type" | "material", quelle?: Gruppe[]): void {
      if (!el) return;
      const posten = quelle || FB[key === "type" ? "types" : "materials"];
      el.innerHTML = posten
        .map((p) => {
          const n = zaehle(key === "type" ? "type" : "material", p.name);
          return (
            '<a class="indexlist__row" href="detail.html" title="Beispiel-Datensatz dieser Gruppe">' +
            '<span><span class="indexlist__name">' +
            p.name +
            "</span><br>" +
            '<span class="indexlist__sub">' +
            p.notiz +
            "</span></span>" +
            '<span class="indexlist__count chip chip--outline">' +
            n +
            (n === 1 ? " Datensatz" : " Datensätze") +
            "</span>" +
            '<span class="indexlist__arrow" aria-hidden="true">→</span>' +
            "</a>"
          );
        })
        .join("");
    },

    /* Record page — dynamic cutlery drawer */
    renderDrawer(el: HTMLElement | null, d: Datensatz | null): void {
      if (!el || !d) return;
      const teile = d.teile;
      const haben = teile.filter((p) => p.vorhanden).length;
      let lift = 0;
      const fächer = teile
        .map((p, i) => {
          const nr = '<span class="drawer__slot-no">Teil ' + (i + 1) + "</span>";
          const name = '<span class="drawer__slot-name">' + p.name + "</span>";
          if (p.vorhanden) {
            const medien = p.bild
              ? '<img src="' + p.bild + '" alt="' + (p.alt || p.name) + '">'
              : '<span class="placeholder-photo drawer__ghost">Foto folgt</span>';
            return (
              '<div class="drawer__slot drawer__slot--filled">' +
              nr +
              '<span class="drawer__slot-piece" style="--lift-i:' +
              lift++ +
              '">' +
              medien +
              "</span>" +
              name +
              '<span class="drawer__state drawer__state--ok">● Im Bestand</span></div>'
            );
          }
          return (
            '<div class="drawer__slot drawer__slot--empty">' +
            nr +
            '<span class="drawer__slot-piece"><span class="drawer__void">Fach leer</span></span>' +
            name +
            '<span class="drawer__state">○ Fehlt — folgt</span></div>'
          );
        })
        .join("");
      const notiz =
        teile.length > 1 && haben < teile.length
          ? '<p class="drawer__note small">Unvollständiger Datensatz — die leeren Fächer zeigen, was zur Ergänzung des Musters noch fehlt.</p>'
          : "";
      el.innerHTML =
        '<div class="drawer__rail">' +
        '<span class="drawer__plate">' +
        d.airline +
        "</span>" +
        '<span class="drawer__pull" aria-hidden="true"></span>' +
        '<span class="drawer__rail-note">' +
        haben +
        " von " +
        teile.length +
        " Teilen im Bestand</span>" +
        "</div>" +
        '<div class="drawer__box dots-dark"><div class="drawer__grid">' +
        fächer +
        "</div>" +
        notiz +
        "</div>";
    }
  };

  /* Cutlery drawer: slides open when it comes into view. */
  function oeffneSchubladen(): void {
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
      { threshold: 0.3 }
    );
    schubladen.forEach((el) => io.observe(el));
  }

  /* Home page — featured carousel: pages by button, counts the slides. */
  function richteKarussell(): void {
    const karussells = Array.from(document.querySelectorAll<HTMLElement>("[data-carousel]"));
    karussells.forEach((karussell) => {
      const blick = karussell.querySelector<HTMLElement>(".carousel__viewport");
      const zurueck = karussell.querySelector<HTMLButtonElement>("[data-carousel-prev]");
      const vor = karussell.querySelector<HTMLButtonElement>("[data-carousel-next]");
      const zaehler = karussell.querySelector<HTMLElement>("[data-carousel-count]");
      if (!blick || !zurueck || !vor) return;
      const folien = Array.from(blick.children);
      if (folien.length < 2) {
        zurueck.disabled = true;
        vor.disabled = true;
        return;
      }
      const zweistellig = (n: number): string => (n < 10 ? "0" : "") + n;
      const melde = (): void => {
        const index = Math.min(folien.length - 1, Math.max(0, Math.round(blick.scrollLeft / blick.clientWidth)));
        if (zaehler) zaehler.textContent = zweistellig(index + 1) + " / " + zweistellig(folien.length);
        zurueck.disabled = index === 0;
        vor.disabled = index === folien.length - 1;
      };
      const blatt = (richtung: number): void => {
        const index = Math.min(folien.length - 1, Math.max(0, Math.round(blick.scrollLeft / blick.clientWidth)) + richtung);
        blick.scrollLeft = index * blick.clientWidth;
      };
      zurueck.addEventListener("click", () => blatt(-1));
      vor.addEventListener("click", () => blatt(1));
      let wartend = false;
      blick.addEventListener(
        "scroll",
        () => {
          if (wartend) return;
          wartend = true;
          window.requestAnimationFrame(() => {
            wartend = false;
            melde();
          });
        },
        { passive: true }
      );
      window.addEventListener("resize", melde);
      melde();
    });
  }

  /* Header — burger menu: only below 640 px the navigation opens as an overlay. */
  function richteMenue(): void {
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
      const erster = panel.querySelector<HTMLElement>("a");
      if (zustand && erster) erster.focus();
    };
    toggle.addEventListener("click", () => setze(!offen));
    panel.addEventListener("click", (ereignis) => {
      if ((ereignis.target as HTMLElement).closest("a")) setze(false);
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
    FB.renderLatest(document.querySelector<HTMLElement>("[data-latest]"), 5);
    FB.renderAirlines(document.querySelector<HTMLElement>("[data-airlines]"));
    FB.renderListe(document.querySelector<HTMLElement>("[data-types]"), "type");
    FB.renderListe(document.querySelector<HTMLElement>("[data-materials]"), "material");
    const schublade1 = document.querySelector<HTMLElement>("[data-drawer='fb-lh-001']");
    if (schublade1) FB.renderDrawer(schublade1, FB.byid("fb-lh-001"));
    const schublade2 = document.querySelector<HTMLElement>("[data-drawer='fb-hl-001']");
    if (schublade2) FB.renderDrawer(schublade2, FB.byid("fb-hl-001"));
    oeffneSchubladen();
    richteKarussell();
    richteMenue();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.FB = FB;
})();
