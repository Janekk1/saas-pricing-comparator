import React, { useState } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

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
          ? `Vaše nabídka je levnější o ${cur}${Math.abs(delta).toFixed(2)}. Výhodnější struktura nákladů nebo poplatků.` +
            (payback ? ` Při ceně HW ${cur}${hwPrice} se investice vrátí za ${payback} měsíců.` : "")
          : delta > 0
          ? `Vaše nabídka je dražší o ${cur}${Math.abs(delta).toFixed(2)}. Největší rozdíl pravděpodobně způsobuje vyšší take rate nebo SaaS poplatek.`
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
          ? `Your offer is cheaper by ${cur}${Math.abs(delta).toFixed(2)}. More efficient fee structure.` +
            (payback ? ` With hardware price of ${cur}${hwPrice}, the investment pays back in ${payback} months.` : "")
          : delta > 0
          ? `Your offer is more expensive by ${cur}${Math.abs(delta).toFixed(2)}. Likely due to higher take rate or SaaS fee.`
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

  const competitorMonthly = calculate(competitor);
  const ourMonthly = calculate(ours);
  const months = Array.from({ length: 24 }, (_, i) => i + 1);
  const competitorCumulative = months.map((m) => competitorMonthly * m);
  const ourCumulative = months.map((m) => ourMonthly * m + hwPrice);

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
        <p>{copy.results.competitorTotal}: {currency}{compTotal.toFixed(2)}</p>
        <p>{copy.results.ourTotal}: {currency}{oursTotal.toFixed(2)}</p>
        <p>{copy.results.diff}: {currency}{delta.toFixed(2)}</p>
        <p><strong>{copy.results.desc(delta, currency, payback)}</strong></p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>{lang === 'cz' ? 'Vizualizace nákladů' : 'Cost Visualization'}</h3>
        <Line
          data={{
            labels: months,
            datasets: [
              {
                label: lang === 'cz' ? 'Konkurence (kumulativně)' : 'Competitor (cumulative)',
                data: competitorCumulative,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.2
              },
              {
                label: lang === 'cz' ? 'Vaše řešení (kumulativně + HW)' : 'Your offer (cumulative incl. HW)',
                data: ourCumulative,
                fill: false,
                borderColor: '#f05a5a',
                tension: 0.2
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              },
              title: {
                display: true,
                text: lang === 'cz' ? 'Porovnání kumulovaných nákladů' : 'Cumulative Spend Comparison'
              }
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: currency + ' ' + (lang === 'cz' ? 'Celková cena' : 'Cumulative Cost')
                }
              },
              x: {
                title: {
                  display: true,
                  text: lang === 'cz' ? 'Měsíce' : 'Months'
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
