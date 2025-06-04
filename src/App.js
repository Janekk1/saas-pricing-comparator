import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [competitor, setCompetitor] = useState({ tpv: 100000, takeRate: 1.5, saasFee: 200 });
  const [ours, setOurs] = useState({ tpv: 100000, takeRate: 1.2, saasFee: 250 });
  const [currency, setCurrency] = useState("€");

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
          alert('Neplatný JSON soubor');
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
          alert('Neplatný XLSX soubor');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const calculate = ({ tpv, takeRate, saasFee }) => (tpv * takeRate) / 100 + saasFee;
  const compTotal = calculate(competitor);
  const oursTotal = calculate(ours);
  const delta = oursTotal - compTotal;

  const description = delta > 0
    ? `Vaše nabídka je dražší o ${currency}${Math.abs(delta).toFixed(2)}. Největší rozdíl pravděpodobně způsobuje vyšší take rate nebo SaaS poplatek.`
    : delta < 0
      ? `Vaše nabídka je levnější o ${currency}${Math.abs(delta).toFixed(2)}. Výhodnější struktura nákladů nebo poplatků.`
      : `Obě nabídky jsou cenově totožné.`;

  return (
    <div className="calculator-box">
      <h1>SaaS & Payments Kalkulačka</h1>
      <label>Zvolte měnu</label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        <option value="€">€</option>
        <option value="$">$</option>
        <option value="£">£</option>
        <option value="Kč">Kč</option>
      </select>

      <input type="file" accept=".json,.xlsx" onChange={handleImport} />

      <label>TPV konkurence</label>
      <input type="number" value={competitor.tpv} onChange={(e) => setCompetitor({ ...competitor, tpv: parseFloat(e.target.value) })} />
      <label>Take rate konkurence (%)</label>
      <input type="number" value={competitor.takeRate} onChange={(e) => setCompetitor({ ...competitor, takeRate: parseFloat(e.target.value) })} />
      <label>SaaS poplatek konkurence</label>
      <input type="number" value={competitor.saasFee} onChange={(e) => setCompetitor({ ...competitor, saasFee: parseFloat(e.target.value) })} />

      <label>Váš TPV</label>
      <input type="number" value={ours.tpv} onChange={(e) => setOurs({ ...ours, tpv: parseFloat(e.target.value) })} />
      <label>Váš Take rate (%)</label>
      <input type="number" value={ours.takeRate} onChange={(e) => setOurs({ ...ours, takeRate: parseFloat(e.target.value) })} />
      <label>Váš SaaS poplatek</label>
      <input type="number" value={ours.saasFee} onChange={(e) => setOurs({ ...ours, saasFee: parseFloat(e.target.value) })} />

      <div className="summary">
        <h2>Výsledky</h2>
        <p>Celková cena konkurence: {currency}{compTotal.toFixed(2)}</p>
        <p>Vaše celková cena: {currency}{oursTotal.toFixed(2)}</p>
        <p>Rozdíl: {currency}{delta.toFixed(2)}</p>
        <p><strong>{description}</strong></p>
      </div>
    </div>
  );
}
