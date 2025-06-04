import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [competitor, setCompetitor] = useState({ tpv: 100000, takeRate: 1.5, saasFee: 200 });
  const [ours, setOurs] = useState({ tpv: 100000, takeRate: 1.2, saasFee: 250 });
  const [currency, setCurrency] = useState("€");
  const [lang, setLang] = useState("cz");

  const t = {
    cz: {
      title: "SAAS & Payments Kalkulačka",
      selectCurrency: "Zvolte měnu",
      selectLanguage: "Zvolte jazyk",
      labels: {
        competitorTPV: "Měsíční TPV konkurence",
        competitorTR: "Take rate konkurence (%)",
        competitorSaaS: "SaaS poplatek konkurence",
        ourTPV: "Vaše měsíční TPV",
        ourTR: "Váš Take rate (%)",
        ourSaaS: "Váš měsíční SAAS poplatek"
      },
      results: {
        header: "Výsledky",
        competitorTotal: "Celková cena konkurence",
        ourTotal: "Vaše celková cena",
        diff: "Rozdíl",
        desc: (delta, cur) => delta > 0
          ? `Vaše nabídka je dražší o ${cur}${Math.abs(delta).toFixed(2)}. Největší rozdíl pravděpodobně způsobuje vyšší take rate nebo SAAS poplatek.`
          : delta < 0
            ? `Vaše nabídka je levnější o ${cur}${Math.abs(delta).toFixed(2)}. Výhodnější struktura nákladů nebo poplatků.`
            : `Obě nabídky jsou cenově totožné.`
      }
    },
    en: {
      title: "SAAS & Payments Comparator",
      selectCurrency: "Select Currency",
      selectLanguage: "Select Language",
      labels: {
        competitorTPV: "Competitor monthly TPV",
        competitorTR: "Competitor Take Rate (%)",
        competitorSaaS: "Competitor monthly SaaS Fee",
        ourTPV: "Your monthly TPV",
        ourTR: "Your Take Rate (%)",
        ourSaaS: "Your SaaS monthly Fee"
      },
      results: {
        header: "Results",
        competitorTotal: "Competitor Total Cost",
        ourTotal: "Your Total Cost",
        diff: "Difference",
        desc: (delta, cur) => delta > 0
          ? `Your offer is more expensive by ${cur}${Math.abs(delta).toFixed(2)}. Likely due to higher take rate or SaaS fee.`
          : delta < 0
            ? `Your offer is cheaper by ${cur}${Math.abs(delta).toFixed(2)}. More efficient fee structure.`
            : `Both offers cost the same.`
      }
    }
  };
const copy = t[lang];

  const handleImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const ext = file.name.split('.').pop();

    if (ext === 'json') {
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setCompetitor(data.competitor);
          setOurs(data.ours);
        } catch {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    } else if (ext === 'xlsx') {
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const obj = {};
          rows.forEach(([field, , value]) => {
            obj[field] = value;
          });
          setCompetitor({
            tpv: parseFloat(obj['competitor_tpv']),
            takeRate: parseFloat(obj['competitor_take_rate']),
            saasFee: parseFloat(obj['competitor_saas_fee'])
          });
          setOurs({
            tpv: parseFloat(obj['our_tpv']),
            takeRate: parseFloat(obj['our_take_rate']),
            saasFee: parseFloat(obj['our_saas_fee'])
          });
        } catch {
          alert("Invalid XLSX file");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  
  const calculate = ({ tpv, takeRate, saasFee }) => (tpv * takeRate) / 100 + saasFee;
  const compTotal = calculate(competitor);
  const oursTotal = calculate(ours);
  const delta = oursTotal - compTotal;

  return (
    <div className="calculator-box">
      <h1>{copy.title}</h1>

      <label>{copy.selectLanguage}</label>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        <option value="cz">Čeština</option>
        <option value="en">English</option>
      </select>

      <label>{copy.selectCurrency}</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="€">€</option>
        <option value="$">$</option>
        <option value="£">£</option>
        <option value="Kč">Kč</option>
      </select>

      <input type="file" accept=".json,.xlsx" onChange={handleImport} />

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

      <div className="summary">
        <h2>{copy.results.header}</h2>
        <p>{copy.results.competitorTotal}: {currency}{compTotal.toFixed(2)}</p>
        <p>{copy.results.ourTotal}: {currency}{oursTotal.toFixed(2)}</p>
        <p>{copy.results.diff}: {currency}{delta.toFixed(2)}</p>
        <p><strong>{copy.results.desc(delta, currency)}</strong></p>
      </div>
    </div>
  );
}
