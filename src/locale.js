// Default language and currency: Czech + Kč.
// Only a computer set to Slovak (language "sk" or region "SK") starts in Slovak + €.
// The sales agent can always switch language and currency in the header.

export function detectDefaults() {
  let locales = [];
  try {
    locales = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean);
  } catch (e) {
    locales = [];
  }
  const primary = (locales[0] || "cs-CZ").toLowerCase();
  const [language, region = ""] = primary.split("-");

  if (language === "sk" || region === "sk") return { lang: "sk", currency: "€" };
  return { lang: "cz", currency: "Kč" };
}
