// Picks the default language and currency from the computer's language/region settings.
// e.g. "cs-CZ" -> Czech + Kč, "sk-SK" -> Slovak + €, "en-GB" -> English + £, "en-US" -> English + $.

const EURO_REGIONS = [
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
];

function regionCurrency(region) {
  if (!region) return null;
  if (region === "CZ") return "Kč";
  if (region === "GB") return "£";
  if (region === "US") return "$";
  if (EURO_REGIONS.includes(region)) return "€";
  return null;
}

export function detectDefaults() {
  let locales = [];
  try {
    locales = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean);
  } catch (e) {
    locales = [];
  }
  const primary = (locales[0] || "en").toLowerCase();
  const [language, regionRaw] = primary.split("-");
  const region = (regionRaw || "").toUpperCase();

  const lang = language === "cs" ? "cz" : language === "sk" ? "sk" : "en";

  // Region first (en-CZ still means Czech crowns); then fall back to the language; then the time zone.
  let currency = regionCurrency(region);
  if (!currency) {
    if (language === "cs") currency = "Kč";
    else if (language === "sk") currency = "€";
  }
  if (!currency) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz === "Europe/Prague") currency = "Kč";
      else if (tz === "Europe/London") currency = "£";
      else if (tz.startsWith("America/")) currency = "$";
    } catch (e) {
      /* ignore */
    }
  }
  return { lang, currency: currency || "€" };
}
