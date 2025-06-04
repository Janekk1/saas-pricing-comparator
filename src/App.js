import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [competitor, setCompetitor] = useState({ tpv: 100000, takeRate: 1.5, saasFee: 200 });
  const [ours, setOurs] = useState({ tpv: 100000, takeRate: 1.2, saasFee: 250 });

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
        } catch (err) {
          alert('Invalid JSON file.');
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
        } catch (err) {
          alert('Invalid XLSX file.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const calculate = ({ tpv, takeRate, saasFee }) => {
    const payments = (tpv * takeRate) / 100;
    return payments + saasFee;
  };

  return (
    <div>
      <h1>SaaS + Payments Comparison</h1>
      <input type="file" accept=".json,.xlsx" onChange={handleImport} /><br /><br />
      <label>Competitor TPV (€)</label>
      <input type="number" value={competitor.tpv} onChange={(e) => setCompetitor({ ...competitor, tpv: parseFloat(e.target.value) })} />
      <label>Competitor Take Rate (%)</label>
      <input type="number" value={competitor.takeRate} onChange={(e) => setCompetitor({ ...competitor, takeRate: parseFloat(e.target.value) })} />
      <label>Competitor SaaS Fee (€)</label>
      <input type="number" value={competitor.saasFee} onChange={(e) => setCompetitor({ ...competitor, saasFee: parseFloat(e.target.value) })} />
      <hr />
      <label>Our TPV (€)</label>
      <input type="number" value={ours.tpv} onChange={(e) => setOurs({ ...ours, tpv: parseFloat(e.target.value) })} />
      <label>Our Take Rate (%)</label>
      <input type="number" value={ours.takeRate} onChange={(e) => setOurs({ ...ours, takeRate: parseFloat(e.target.value) })} />
      <label>Our SaaS Fee (€)</label>
      <input type="number" value={ours.saasFee} onChange={(e) => setOurs({ ...ours, saasFee: parseFloat(e.target.value) })} />
      <hr />
      <h2>Summary</h2>
      <p>Competitor total: €{calculate(competitor).toFixed(2)}</p>
      <p>Our total: €{calculate(ours).toFixed(2)}</p>
      <p>Difference: €{(calculate(ours) - calculate(competitor)).toFixed(2)}</p>
    </div>
  );
}
