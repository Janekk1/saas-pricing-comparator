import React, { useState } from "react";

export default function App() {
  const [competitor, setCompetitor] = useState({ tpv: 100000, takeRate: 1.5, saasFee: 200 });
  const [ours, setOurs] = useState({ tpv: 100000, takeRate: 1.2, saasFee: 250 });
  const [currency, setCurrency] = useState("€");
  const [lang, setLang] = useState("cz");
  const [hwPrice, setHwPrice] = useState(0);

  const t = {
    cz: {
      title: "SAAS & Payments Kalkulačka",
      selectCurrency: "Zvolte měnu",
      selectLanguage: "Zvolte jazyk",
      labels: {
        competitorTPV: "Vaše TPV",
        competitorTR: "Take rate konkurence (%)",
        competitorSaaS: "Měsíční SAAS poplatek konkurence",
        ourTPV: "Vaše měsíční TPV",
        ourTR: "Náš Take rate (%)",
        ourSaaS: "Náš měsíční SAAS poplatek",
        hwPrice: "Cena nového HW"
      },
      results: {
        header: "Výsledky",
        competitorTotal: "Celková cena konkurence",
        ourTotal: "Naše celková cena",
        diff: "Rozdíl",
        desc: (delta, payback) => delta < 0
          ? `Naše nabídka je levnější o ${Math.abs(delta).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}.` +
            (payback ? ` Investice do HW (${hwPrice.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}) se vrátí za ${payback} měsíců.` : "")
          : delta > 0
          ? `Naše nabídka je dražší o ${Math.abs(delta).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}.`
          : `Obě nabídky jsou cenově totožné.`
      }
    },
    en: {
      title: "SAAS & Payments Calculator",
      selectCurrency: "Select Currency",
      selectLanguage: "Select Language",
      labels: {
        competitorTPV: "Your monthly TPV",
        competitorTR: "Competitor Take Rate (%)",
        competitorSaaS: "Competitor monthly SAAS Fee",
        ourTPV: "Your monthly TPV",
        ourTR: "Our Take Rate (%)",
        ourSaaS: "Our monthly SaaS Fee",
        hwPrice: "Price of the new hardware"
      },
      results: {
        header: "Results",
        competitorTotal: "Competitor Total fee",
        ourTotal: "Our Total fee",
        diff: "Difference",
        desc: (delta, payback) => delta < 0
          ? `Our offer is cheaper by ${Math.abs(delta).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}.` +
            (payback ? ` The hardware investment (${hwPrice.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}) pays back in ${payback} months.` : "")
          : delta > 0
          ? `Our offer is more expensive by ${Math.abs(delta).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}.`
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
        <p><strong>{copy.results.desc(delta, payback)}</strong></p>
      </div>
    </div>
  );
}
