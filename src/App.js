import React, { useState } from "react";

export default function App() {
  const [competitor, setCompetitor] = useState({ tpv: 100000, takeRate: 1.5, saasFee: 200 });
  const [ours, setOurs] = useState({ tpv: 100000, takeRate: 1.2, saasFee: 250 });
  const [currency, setCurrency] = useState("€");
  const [lang, setLang] = useState("cz");
  const [hwPrice, setHwPrice] = useState(0);

  const t = {
    cz: {
      title: "SaaS & Payments Kalkulačka",
      selectCurrency: "Zvolte měnu",
      selectLanguage: "Zvolte jazyk",
      labels: {
        competitorTPV: "TPV konkurence",
        competitorTR: "Take rate konkurence (%)",
        competitorSaaS: "SaaS poplatek konkurence",
        ourTPV: "Váš TPV",
        ourTR: "Váš Take rate (%)",
        ourSaaS: "Váš SaaS poplatek",
        hwPrice: "Cena HW"
      },
      results: {
        header: "Výsledky",
        competitorTotal: "Celková cena konkurence",
        ourTotal: "Vaše celková cena",
        diff: "Rozdíl",
        desc: (delta, cur, payback) => delta < 0
          ? `Vaše nabídka je levnější o ${cur}${Math.abs(delta)value.toLocaleString(undefined, { maximumFractionDigits: 0 })}.` +
            (payback ? ` Investice do HW (${cur}${hwPrice}) se vrátí za ${payback} měsíců.` : "")
          : delta > 0
          ? `Vaše nabídka je dražší o ${cur}${Math.abs(delta)value.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`
          : `Obě nabídky jsou cenově totožné.`
      }
    },
    en: {
      title: "SaaS & Payments Calculator",
      selectCurrency: "Select Currency",
      selectLanguage: "Select Language",
      labels: {
        competitorTPV: "Competitor TPV",
        competitorTR: "Competitor Take Rate (%)",
        competitorSaaS: "Competitor SaaS Fee",
        ourTPV: "Your TPV",
        ourTR: "Your Take Rate (%)",
        ourSaaS: "Your SaaS Fee",
        hwPrice: "Hardware Price"
      },
      results: {
        header: "Results",
        competitorTotal: "Competitor Total Cost",
        ourTotal: "Your Total Cost",
        diff: "Difference",
        desc: (delta, cur, payback) => delta < 0
          ? `Your offer is cheaper by ${cur}${Math.abs(delta)value.toLocaleString(undefined, { maximumFractionDigits: 0 })}.` +
            (payback ? ` The hardware investment (${cur}${hwPrice}) pays back in ${payback} months.` : "")
          : delta > 0
          ? `Your offer is more expensive by ${cur}${Math.abs(delta)value.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`
          : `Both offers cost the same.`
      }
    }
  };

  const copy = t[lang];

  const calculate = ({ tpv, takeRate, saasFee }) => (tpv * takeRate) / 100 + saasFee;
  const compTotal = calculate(competitor);
  const oursTotal = calculate(ours);
  const delta = oursTotal - compTotal;
  const payback = delta < 0 && hwPrice > 0 ? Math.ceil(hwPrice / Math.abs(delta)) : null;

  return (
    <div className="calculator-box">
      <h1>{copy.title}</h1>

      <label>{copy.selectLanguage}</label>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="cz">🇨🇿 Čeština</option>
        <option value="en">🇬🇧 English</option>
      </select>

      <label>{copy.selectCurrency}</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="€">€</option>
        <option value="$">$</option>
        <option value="£">£</option>
        <option value="Kč">Kč</option>
      </select>

      <label>{copy.labels.competitorTPV}</label>
      <input type="number" value={competitor.tpv} onChange={(e) => setCompetitor({ ...competitor, tpv: parseFloat(e.target.value) })} />
      <label>{copy.labels.competitorTR}</label>
      <input type="number" value={competitor.takeRate} onChange={(e) => setCompetitor({ ...competitor, takeRate: parseFloat(e.target.value) })} />
      <label>{copy.labels.competitorSaaS}</label>
      <input type="number" value={competitor.saasFee} onChange={(e) => setCompetitor({ ...competitor, saasFee: parseFloat(e.target.value) })} />

      <label>{copy.labels.ourTPV}</label>
      <input type="number" value={ours.tpv} onChange={(e) => setOurs({ ...ours, tpv: parseFloat(e.target.value) })} />
      <label>{copy.labels.ourTR}</label>
      <input type="number" value={ours.takeRate} onChange={(e) => setOurs({ ...ours, takeRate: parseFloat(e.target.value) })} />
      <label>{copy.labels.ourSaaS}</label>
      <input type="number" value={ours.saasFee} onChange={(e) => setOurs({ ...ours, saasFee: parseFloat(e.target.value) })} />

      <label>{copy.labels.hwPrice}</label>
      <input type="number" value={hwPrice} onChange={(e) => setHwPrice(parseFloat(e.target.value))} />

      <div className="summary">
        <h2>{copy.results.header}</h2>
<p>{copy.results.competitorTotal}: {compTotal.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} {currency}</p>
<p>{copy.results.ourTotal}: {oursTotal.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} {currency}</p>
<p>{copy.results.diff}: {delta.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} {currency}</p>
<p><strong>{copy.results.desc(delta, currency, payback)}</strong></p>
      </div>
    </div>
  );
}
