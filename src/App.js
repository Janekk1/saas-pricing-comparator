import React, { useState } from "react";
import MonthlySimulation from "./MonthlySimulation";
import { DEFAULT_SIM, computeSimulation, isSimCustomised, readNum } from "./simulation";
import { detectDefaults } from "./locale";

const fmt = (n) => (Number.isFinite(n) ? n : 0).toLocaleString("cs-CZ", { maximumFractionDigits: 0 });

const T = {
  cz: {
    title: "SAAS & Payments kalkulačka",
    eyebrow: "Storyous + Teya",
    language: "Jazyk",
    currency: "Měna",
    client: "Klient",
    competitor: "Konkurence",
    ours: "Storyous + Teya",
    labels: {
      tpv: "Měsíční karetní TPV",
      hwPrice: "Cena nového HW",
      takeRate: "IC++ take rate (%)",
      saas: "Měsíční SAAS poplatek",
      avgTx: "Průměrná hodnota transakce",
      feePerTx: "Poplatek za transakci",
    },
    saasFromSim: "Průměr z roční simulace (SaaS + licence)",
    results: {
      saving: "Měsíční úspora klienta",
      extra: "Měsíční navýšení pro klienta",
      equal: "Obě nabídky stojí stejně",
      compMonth: "Konkurence / měsíc",
      oursMonth: "Storyous + Teya / měsíc",
      yearSaving: "Úspora za 12 měsíců",
      payback: (m) => `HW se vrátí za ${m} měs.`,
      avgNote: (y) => `Měsíční průměr z roční simulace (${y === 1 ? "1 rok" : y + " roky"})`,
      avgTpv: "průměrné TPV",
      perMonth: "měsíčně",
      cheaper: (d, cur) => `Naše nabídka je levnější o ${fmt(d)} ${cur} měsíčně.`,
      dearer: (d, cur) => `Naše nabídka je dražší o ${fmt(d)} ${cur} měsíčně.`,
    },
  },
  sk: {
    title: "SAAS & Payments kalkulačka",
    eyebrow: "Storyous + Teya",
    language: "Jazyk",
    currency: "Mena",
    client: "Klient",
    competitor: "Konkurencia",
    ours: "Storyous + Teya",
    labels: {
      tpv: "Mesačné kartové TPV",
      hwPrice: "Cena nového HW",
      takeRate: "IC++ take rate (%)",
      saas: "Mesačný SAAS poplatok",
      avgTx: "Priemerná hodnota transakcie",
      feePerTx: "Poplatok za transakciu",
    },
    saasFromSim: "Priemer z ročnej simulácie (SaaS + licencie)",
    results: {
      saving: "Mesačná úspora klienta",
      extra: "Mesačné navýšenie pre klienta",
      equal: "Obe ponuky stoja rovnako",
      compMonth: "Konkurencia / mesiac",
      oursMonth: "Storyous + Teya / mesiac",
      yearSaving: "Úspora za 12 mesiacov",
      payback: (m) => `HW sa vráti za ${m} mes.`,
      avgNote: (y) => `Mesačný priemer z ročnej simulácie (${y === 1 ? "1 rok" : y + " roky"})`,
      avgTpv: "priemerné TPV",
      perMonth: "mesačne",
      cheaper: (d, cur) => `Naša ponuka je lacnejšia o ${fmt(d)} ${cur} mesačne.`,
      dearer: (d, cur) => `Naša ponuka je drahšia o ${fmt(d)} ${cur} mesačne.`,
    },
  },
  en: {
    title: "SaaS & Payments calculator",
    eyebrow: "Storyous + Teya",
    language: "Language",
    currency: "Currency",
    client: "Client",
    competitor: "Competitor",
    ours: "Storyous + Teya",
    labels: {
      tpv: "Monthly card TPV",
      hwPrice: "New hardware price",
      takeRate: "IC++ take rate (%)",
      saas: "Monthly SaaS fee",
      avgTx: "Average transaction value",
      feePerTx: "Fee per transaction",
    },
    saasFromSim: "Average from the yearly simulation (SaaS + licences)",
    results: {
      saving: "Client's monthly saving",
      extra: "Client's monthly extra cost",
      equal: "Both offers cost the same",
      compMonth: "Competitor / month",
      oursMonth: "Storyous + Teya / month",
      yearSaving: "Saving over 12 months",
      payback: (m) => `Hardware pays back in ${m} mo.`,
      avgNote: (y) => `Monthly average of the yearly simulation (${y === 1 ? "1 year" : y + " years"})`,
      avgTpv: "average TPV",
      perMonth: "per month",
      cheaper: (d, cur) => `Our offer is cheaper by ${fmt(d)} ${cur} per month.`,
      dearer: (d, cur) => `Our offer is more expensive by ${fmt(d)} ${cur} per month.`,
    },
  },
};

const DEFAULTS = detectDefaults();

function Field({ id, label, children, hint }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && <small className="hint">{hint}</small>}
    </div>
  );
}

export default function App() {
  const [tpv, setTpv] = useState(100000);
  const [competitor, setCompetitor] = useState({ takeRate: 1.5, saasFee: 200, feePerTransaction: 0, avgTransactionValue: 0 });
  const [ours, setOurs] = useState({ takeRate: 1.2, saasFee: 250 });
  const [currency, setCurrency] = useState(DEFAULTS.currency);
  const [lang, setLang] = useState(DEFAULTS.lang);
  const [hwPrice, setHwPrice] = useState(0);
  const [sim, setSim] = useState(DEFAULT_SIM);
  const [simOpen, setSimOpen] = useState(false);

  const copy = T[lang];

  // The results are the monthly average of the yearly simulation.
  // With default simulation settings (100 % every month, flat SaaS) this equals the simple one-month calculation.
  const result = computeSimulation({ tpv, competitor, ours, hwPrice: hwPrice || 0, sim });
  const simActive = isSimCustomised(sim);
  const compTotal = result.avg.comp;
  const oursTotal = result.avg.ours;
  const saving = compTotal - oursTotal;
  const yearSaving = result.yearly[0] ? result.yearly[0].saving : saving * 12;
  const payback = saving > 0 && hwPrice > 0 ? Math.ceil(hwPrice / saving) : null;
  const deviceMode = sim.saasMode === "device";

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo" aria-hidden="true">ST</div>
          <div>
            <div className="bsub">{copy.eyebrow}</div>
            <h1>{copy.title}</h1>
          </div>
        </div>
        <div className="top-controls">
          <label className="sr" htmlFor="lang">{copy.language}</label>
          <select id="lang" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="cz">Čeština</option>
            <option value="sk">Slovenčina</option>
            <option value="en">English</option>
          </select>
          <label className="sr" htmlFor="currency">{copy.currency}</label>
          <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="Kč">Kč</option>
            <option value="€">€</option>
            <option value="£">£</option>
            <option value="$">$</option>
          </select>
        </div>
      </header>

      <main className="sheet">
        <section className="inputs">
          <div className="panel">
            <div className="eyebrow">{copy.client}</div>
            <Field id="tpv" label={`${copy.labels.tpv} (${currency})`}>
              <input id="tpv" type="number" value={tpv} onChange={(e) => setTpv(readNum(e))} />
            </Field>
            <Field id="hw" label={`${copy.labels.hwPrice} (${currency})`}>
              <input id="hw" type="number" value={hwPrice} onChange={(e) => setHwPrice(readNum(e))} />
            </Field>
          </div>

          <div className="panel">
            <div className="eyebrow"><span className="dot s2" />{copy.competitor}</div>
            <Field id="c-tr" label={copy.labels.takeRate}>
              <input id="c-tr" type="number" step="0.1" value={competitor.takeRate} onChange={(e) => setCompetitor({ ...competitor, takeRate: readNum(e) })} />
            </Field>
            <Field id="c-saas" label={`${copy.labels.saas} (${currency})`}>
              <input id="c-saas" type="number" value={competitor.saasFee} onChange={(e) => setCompetitor({ ...competitor, saasFee: readNum(e) })} />
            </Field>
            <div className="field-pair">
              <Field id="c-avg" label={`${copy.labels.avgTx} (${currency})`}>
                <input id="c-avg" type="number" value={competitor.avgTransactionValue} onChange={(e) => setCompetitor({ ...competitor, avgTransactionValue: readNum(e) })} />
              </Field>
              <Field id="c-fee" label={`${copy.labels.feePerTx} (${currency})`}>
                <input id="c-fee" type="number" step="0.01" value={competitor.feePerTransaction} onChange={(e) => setCompetitor({ ...competitor, feePerTransaction: readNum(e) })} />
              </Field>
            </div>
          </div>

          <div className="panel">
            <div className="eyebrow"><span className="dot s1" />{copy.ours}</div>
            <Field id="o-tr" label={copy.labels.takeRate}>
              <input id="o-tr" type="number" step="0.1" value={ours.takeRate} onChange={(e) => setOurs({ ...ours, takeRate: readNum(e) })} />
            </Field>
            <Field id="o-saas" label={`${copy.labels.saas} (${currency})`} hint={deviceMode ? copy.saasFromSim : null}>
              {deviceMode ? (
                <input id="o-saas" type="number" value={Math.round(result.avg.saas)} disabled />
              ) : (
                <input id="o-saas" type="number" value={ours.saasFee} onChange={(e) => setOurs({ ...ours, saasFee: readNum(e) })} />
              )}
            </Field>
          </div>
        </section>

        <section className="kpis" aria-live="polite">
          <div className="card hero">
            <div className="lbl">{saving > 0.5 ? copy.results.saving : saving < -0.5 ? copy.results.extra : copy.results.equal}</div>
            <div className="val">
              {fmt(Math.abs(saving))} <small>{currency}</small>
            </div>
            <div className="sub">
              {saving >= 0 ? copy.results.cheaper(saving, currency) : copy.results.dearer(-saving, currency)}
              {payback && <span className="chip up">{copy.results.payback(payback)}</span>}
            </div>
          </div>
          <div className="card">
            <div className="lbl"><span className="dot s2" />{copy.results.compMonth}</div>
            <div className="val">{fmt(compTotal)} <small>{currency}</small></div>
          </div>
          <div className="card">
            <div className="lbl"><span className="dot s1" />{copy.results.oursMonth}</div>
            <div className="val">{fmt(oursTotal)} <small>{currency}</small></div>
          </div>
          <div className="card">
            <div className="lbl">{copy.results.yearSaving}</div>
            <div className={"val " + (yearSaving >= 0 ? "pos" : "neg")}>{fmt(yearSaving)} <small>{currency}</small></div>
          </div>
        </section>
        {simActive && (
          <p className="avg-note">
            {copy.results.avgNote(sim.years)} · {copy.results.avgTpv}: {fmt(result.avg.tpv)} {currency}
          </p>
        )}

        <MonthlySimulation
          lang={lang}
          currency={currency}
          ours={ours}
          hwPrice={hwPrice || 0}
          sim={sim}
          setSim={setSim}
          result={result}
          open={simOpen}
          setOpen={setSimOpen}
        />
      </main>
    </div>
  );
}
