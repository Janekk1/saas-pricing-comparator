import React, { useState } from "react";

export default function App() {
  const [tpv, setTpv] = useState(100000);
  const [competitor, setCompetitor] = useState({ takeRate: 1.5, saasFee: 200, feePerTransaction: 0, avgTransactionValue: 0 });
  const [ours, setOurs] = useState({ takeRate: 1.2, saasFee: 250 });
  const [currency, setCurrency] = useState("€");
  const [lang, setLang] = useState("cz");
  const [hwPrice, setHwPrice] = useState(0);

  const t = {
    cz: {
      title: "SAAS & Payments Kalkulačka",
      selectCurrency: "Zvolte měnu",
      selectLanguage: "Zvolte jazyk",
      labels: {
        tpv: "Měsíční karetní TPV podniku",
        competitorTR: "IC++ Take rate konkurence (%)",
        competitorSaaS: "Měsíční SAAS poplatek konkurence",
        competitorAvgTx: "Průměrná hodnota transakce – konkurence",
        competitorFeePerTx: "Poplatek za transakci – konkurence",
        ourTR: "Teya IC++ take rate (%)",
        ourSaaS: "Storyous SAAS poplatek",
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
        tpv: "Monthly card TPV",
        competitorTR: "Competitor Take Rate (%)",
        competitorSaaS: "Competitor monthly SaaS Fee",
        competitorAvgTx: "Average transaction value",
        competitorFeePerTx: "Competitor fee per transaction",
        ourTR: "Teya IC++ Take Rate (%)",
        ourSaaS: "Storyous monthly SaaS Fee",
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

  const calculateCompetitor = ({ takeRate, saasFee, feePerTransaction, avgTransactionValue }) => {
    const numTransactions = avgTransactionValue > 0 ? tpv / avgTransactionValue : 0;
    return (tpv * takeRate) / 100 + saasFee + (feePerTransaction || 0) * numTransactions;
  };
  const calculate = ({ takeRate, saasFee }) => (tpv * takeRate) / 100 + saasFee;

  const compTotal = calculateCompetitor(competitor);
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

      <label>{copy.labels.tpv}</label>
      <input type="number" value={tpv} onChange={(e) => setTpv(parseFloat(e.target.value) || 0)} />

      <label>{copy.labels.competitorTR}</label>
      <input type="number" value={competitor.takeRate} onChange={(e) => setCompetitor({ ...competitor, takeRate: parseFloat(e.target.value) })} />
      <label>{copy.labels.competitorSaaS}</label>
      <input type="number" value={competitor.saasFee} onChange={(e) => setCompetitor({ ...competitor, saasFee: parseFloat(e.target.value) })} />
      <label>{copy.labels.competitorAvgTx}</label>
      <input type="number" value={competitor.avgTransactionValue} onChange={(e) => setCompetitor({ ...competitor, avgTransactionValue: parseFloat(e.target.value) || 0 })} />
      <label>{copy.labels.competitorFeePerTx}</label>
      <input type="number" value={competitor.feePerTransaction} onChange={(e) => setCompetitor({ ...competitor, feePerTransaction: parseFloat(e.target.value) || 0 })} />

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
