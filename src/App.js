import React, { useState } from "react";
import MonthlySimulation from "./MonthlySimulation";
import { DEFAULT_SIM, computeSimulation, isSimCustomised } from "./simulation";

export default function App() {
  const [tpv, setTpv] = useState(100000);
  const [competitor, setCompetitor] = useState({ takeRate: 1.5, saasFee: 200, feePerTransaction: 0, avgTransactionValue: 0 });
  const [ours, setOurs] = useState({ takeRate: 1.2, saasFee: 250 });
  const [currency, setCurrency] = useState("€");
  const [lang, setLang] = useState("cz");
  const [hwPrice, setHwPrice] = useState(0);
  const [sim, setSim] = useState(DEFAULT_SIM);
  const [simOpen, setSimOpen] = useState(false);

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
      saasFromSim: "Průměr z roční simulace (licence + zařízení)",
      results: {
        header: "Výsledky",
        avgNote: (y) => `Měsíční průměr z roční simulace (${y === 1 ? "1 rok" : y + " roky"})`,
        avgTpv: "průměrné TPV",
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
    sk: {
      title: "SAAS & Payments Kalkulačka",
      selectCurrency: "Zvoľte menu",
      selectLanguage: "Zvoľte jazyk",
      labels: {
        tpv: "Mesačné kartové TPV prevádzky",
        competitorTR: "IC++ Take rate konkurencie (%)",
        competitorSaaS: "Mesačný SAAS poplatok konkurencie",
        competitorAvgTx: "Priemerná hodnota transakcie – konkurencia",
        competitorFeePerTx: "Poplatok za transakciu – konkurencia",
        ourTR: "Teya IC++ take rate (%)",
        ourSaaS: "Storyous SAAS poplatok",
        hwPrice: "Cena nového HW"
      },
      saasFromSim: "Priemer z ročnej simulácie (licencia + zariadenia)",
      results: {
        header: "Výsledky",
        avgNote: (y) => `Mesačný priemer z ročnej simulácie (${y === 1 ? "1 rok" : y + " roky"})`,
        avgTpv: "priemerné TPV",
        competitorTotal: "Celková cena konkurencie",
        ourTotal: "Naša celková cena",
        diff: "Rozdiel",
        desc: (delta, payback) => delta < 0
          ? `Naša ponuka je lacnejšia o ${Math.abs(delta).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}.` +
            (payback ? ` Investícia do HW (${hwPrice.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}) sa vráti za ${payback} mesiacov.` : "")
          : delta > 0
          ? `Naša ponuka je drahšia o ${Math.abs(delta).toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} ${currency}.`
          : `Obe ponuky sú cenovo rovnaké.`
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
      saasFromSim: "Average from the yearly simulation (licence + devices)",
      results: {
        header: "Results",
        avgNote: (y) => `Monthly average from the yearly simulation (${y === 1 ? "1 year" : y + " years"})`,
        avgTpv: "average TPV",
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

  // The top results are the monthly average of the yearly simulation.
  // With default simulation settings (100 % every month, flat SaaS) this equals the simple one-month calculation.
  const result = computeSimulation({ tpv, competitor, ours, hwPrice: hwPrice || 0, sim });
  const simActive = isSimCustomised(sim);
  const compTotal = result.avg.comp;
  const oursTotal = result.avg.ours;
  const delta = oursTotal - compTotal;
  const payback = delta < 0 && hwPrice > 0 ? Math.ceil(hwPrice / Math.abs(delta)) : null;
  const deviceMode = sim.saasMode === "device";

  return (
    <div className="calculator-box">
      <h1>{copy.title}</h1>

      <div className="form-grid">
        <div>
          <label>{copy.selectLanguage}</label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="cz">🇨🇿 Čeština</option>
            <option value="sk">🇸🇰 Slovenčina</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
        <div>
          <label>{copy.selectCurrency}</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="€">€</option>
            <option value="$">$</option>
            <option value="£">£</option>
            <option value="Kč">Kč</option>
          </select>
        </div>
        <div className="full">
          <label>{copy.labels.tpv}</label>
          <input type="number" value={tpv} onChange={(e) => setTpv(parseFloat(e.target.value) || 0)} />
        </div>

        <div>
          <label>{copy.labels.competitorTR}</label>
          <input type="number" value={competitor.takeRate} onChange={(e) => setCompetitor({ ...competitor, takeRate: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label>{copy.labels.ourTR}</label>
          <input type="number" value={ours.takeRate} onChange={(e) => setOurs({ ...ours, takeRate: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label>{copy.labels.competitorSaaS}</label>
          <input type="number" value={competitor.saasFee} onChange={(e) => setCompetitor({ ...competitor, saasFee: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label>{copy.labels.ourSaaS}</label>
          {deviceMode ? (
            <>
              <input type="number" value={Math.round(result.avg.saas)} disabled />
              <small className="hint">{copy.saasFromSim}</small>
            </>
          ) : (
            <input type="number" value={ours.saasFee} onChange={(e) => setOurs({ ...ours, saasFee: parseFloat(e.target.value) })} />
          )}
        </div>
        <div>
          <label>{copy.labels.competitorAvgTx}</label>
          <input type="number" value={competitor.avgTransactionValue} onChange={(e) => setCompetitor({ ...competitor, avgTransactionValue: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label>{copy.labels.competitorFeePerTx}</label>
          <input type="number" value={competitor.feePerTransaction} onChange={(e) => setCompetitor({ ...competitor, feePerTransaction: parseFloat(e.target.value) || 0 })} />
        </div>
        <div>
          <label>{copy.labels.hwPrice}</label>
          <input type="number" value={hwPrice} onChange={(e) => setHwPrice(parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div className="summary">
        <h2>{copy.results.header}</h2>
        {simActive && (
          <p className="avg-note">
            {copy.results.avgNote(sim.years)} · {copy.results.avgTpv}: {result.avg.tpv.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} {currency}
          </p>
        )}
        <p>{copy.results.competitorTotal}: {compTotal.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} {currency}</p>
        <p>{copy.results.ourTotal}: {oursTotal.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} {currency}</p>
        <p>{copy.results.diff}: {delta.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} {currency}</p>
        <p><strong>{copy.results.desc(delta, payback)}</strong></p>
      </div>

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
    </div>
  );
}
