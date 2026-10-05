import React from "react";
import { RESTAURANT_PRESET, DEFAULT_SIM, devicesFor } from "./simulation";

const MONTHS = {
  cz: ["Led", "Úno", "Bře", "Dub", "Kvě", "Čvn", "Čvc", "Srp", "Zář", "Říj", "Lis", "Pro"],
  sk: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const TEXT = {
  cz: {
    title: "Roční simulace",
    intro: "Nastavte sezónnost TPV a SAAS poplatek pro každý měsíc. Procentní poplatek roste s obratem, SAAS poplatek zůstává fixní.",
    horizon: "Období simulace",
    years: (n) => (n === 1 ? "1 rok" : n < 5 ? `${n} roky` : `${n} let`),
    growth: "Roční růst TPV (%)",
    show: "Zobrazit roční simulaci",
    hide: "Skrýt roční simulaci",
    reset: "Resetovat simulaci",
    linked: "Výsledky nahoře ukazují měsíční průměr z této simulace.",
    tpvGroup: "Obrat (TPV)",
    saasGroup: "Storyous SAAS",
    saasMode: "Model účtování",
    modeFlat: "Fixní měsíční poplatek",
    modeDevice: "Licence + cena za zařízení",
    platformFee: "Licence bez zařízení / měsíc",
    platformHint: "funkce nezávislé na počtu zařízení",
    pricePerDevice: "Cena za 1 zařízení / měsíc",
    defaultDevices: "Počet zařízení",
    saasFormula: (p, d, n, cur) => `${fmt(p)} + ${fmt(n)} × ${fmt(d)} = ${fmt(p + n * d)} ${cur} / měsíc`,
    resetSeason: "Sezónnost na 100 %",
    restaurantPreset: "Typická gastro sezóna",
    month: "Měsíc",
    season: "Sezónnost",
    tpv: "TPV",
    devices: "Zařízení",
    saas: "Storyous SAAS",
    competitor: "Konkurence",
    ours: "Storyous + Teya",
    saving: "Úspora",
    chartMonthly: "Měsíční náklady klienta",
    chartCumulative: "Kumulovaná úspora",
    yearTotal: (y) => `Rok ${y}`,
    total: "Celkem",
    competitorFees: "Poplatky konkurence",
    ourFees: "Poplatky Storyous + Teya",
    takeRateShare: "z toho procentní poplatek",
    summary: (s, cur, months) =>
      s >= 0
        ? `Za ${months} měsíců klient ušetří ${fmt(s)} ${cur}.`
        : `Za ${months} měsíců je naše nabídka dražší o ${fmt(Math.abs(s))} ${cur}.`,
    payback: (m, hw, cur) => `Investice do HW (${fmt(hw)} ${cur}) se vrátí v ${m}. měsíci.`,
    noPayback: (hw, cur) => `Investice do HW (${fmt(hw)} ${cur}) se v tomto období nevrátí.`,
  },
  sk: {
    title: "Ročná simulácia",
    intro: "Nastavte sezónnosť TPV a SAAS poplatok pre každý mesiac. Percentuálny poplatok rastie s obratom, SAAS poplatok zostáva fixný.",
    horizon: "Obdobie simulácie",
    years: (n) => (n === 1 ? "1 rok" : n < 5 ? `${n} roky` : `${n} rokov`),
    growth: "Ročný rast TPV (%)",
    show: "Zobraziť ročnú simuláciu",
    hide: "Skryť ročnú simuláciu",
    reset: "Resetovať simuláciu",
    linked: "Výsledky hore zobrazujú mesačný priemer z tejto simulácie.",
    tpvGroup: "Obrat (TPV)",
    saasGroup: "Storyous SAAS",
    saasMode: "Model účtovania",
    modeFlat: "Fixný mesačný poplatok",
    modeDevice: "Licencia + cena za zariadenie",
    platformFee: "Licencia bez zariadení / mesiac",
    platformHint: "funkcie nezávislé od počtu zariadení",
    pricePerDevice: "Cena za 1 zariadenie / mesiac",
    defaultDevices: "Počet zariadení",
    saasFormula: (p, d, n, cur) => `${fmt(p)} + ${fmt(n)} × ${fmt(d)} = ${fmt(p + n * d)} ${cur} / mesiac`,
    resetSeason: "Sezónnosť na 100 %",
    restaurantPreset: "Typická gastro sezóna",
    month: "Mesiac",
    season: "Sezónnosť",
    tpv: "TPV",
    devices: "Zariadenia",
    saas: "Storyous SAAS",
    competitor: "Konkurencia",
    ours: "Storyous + Teya",
    saving: "Úspora",
    chartMonthly: "Mesačné náklady klienta",
    chartCumulative: "Kumulovaná úspora",
    yearTotal: (y) => `Rok ${y}`,
    total: "Spolu",
    competitorFees: "Poplatky konkurencie",
    ourFees: "Poplatky Storyous + Teya",
    takeRateShare: "z toho percentuálny poplatok",
    summary: (s, cur, months) =>
      s >= 0
        ? `Za ${months} mesiacov klient ušetrí ${fmt(s)} ${cur}.`
        : `Za ${months} mesiacov je naša ponuka drahšia o ${fmt(Math.abs(s))} ${cur}.`,
    payback: (m, hw, cur) => `Investícia do HW (${fmt(hw)} ${cur}) sa vráti v ${m}. mesiaci.`,
    noPayback: (hw, cur) => `Investícia do HW (${fmt(hw)} ${cur}) sa v tomto období nevráti.`,
  },
  en: {
    title: "Yearly simulation",
    intro: "Set TPV seasonality and the SaaS fee for each month. A percentage fee grows with turnover; a SaaS fee stays flat.",
    horizon: "Simulation period",
    years: (n) => (n === 1 ? "1 year" : `${n} years`),
    growth: "Yearly TPV growth (%)",
    show: "Show yearly simulation",
    hide: "Hide yearly simulation",
    reset: "Reset simulation",
    linked: "The results above show the monthly average of this simulation.",
    tpvGroup: "Turnover (TPV)",
    saasGroup: "Storyous SaaS",
    saasMode: "Billing model",
    modeFlat: "Flat monthly fee",
    modeDevice: "Licence + price per device",
    platformFee: "Licence without devices / month",
    platformHint: "features not tied to the number of devices",
    pricePerDevice: "Price per device / month",
    defaultDevices: "Number of devices",
    saasFormula: (p, d, n, cur) => `${fmt(p)} + ${fmt(n)} × ${fmt(d)} = ${fmt(p + n * d)} ${cur} / month`,
    resetSeason: "Seasonality to 100%",
    restaurantPreset: "Typical restaurant season",
    month: "Month",
    season: "Seasonality",
    tpv: "TPV",
    devices: "Devices",
    saas: "Storyous SaaS",
    competitor: "Competitor",
    ours: "Storyous + Teya",
    saving: "Saving",
    chartMonthly: "Client's monthly cost",
    chartCumulative: "Cumulative saving",
    yearTotal: (y) => `Year ${y}`,
    total: "Total",
    competitorFees: "Competitor fees",
    ourFees: "Storyous + Teya fees",
    takeRateShare: "of which percentage fee",
    summary: (s, cur, months) =>
      s >= 0
        ? `Over ${months} months the client saves ${fmt(s)} ${cur}.`
        : `Over ${months} months our offer is more expensive by ${fmt(Math.abs(s))} ${cur}.`,
    payback: (m, hw, cur) => `The hardware investment (${fmt(hw)} ${cur}) pays back in month ${m}.`,
    noPayback: (hw, cur) => `The hardware investment (${fmt(hw)} ${cur}) does not pay back in this period.`,
  },
};

function fmt(n) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("cs-CZ", { maximumFractionDigits: 0 });
}

function clampSeason(v) {
  if (!Number.isFinite(v)) return 100;
  return Math.min(120, Math.max(80, v));
}

export default function MonthlySimulation({ lang, currency, ours, hwPrice, sim, setSim, result, open, setOpen }) {
  const tx = TEXT[lang];
  const monthNames = MONTHS[lang];
  const { rows, yearly, totals, paybackMonth } = result;
  const years = sim.years;

  const update = (patch) => setSim((s) => ({ ...s, ...patch }));
  const updateAt = (key, i, value) =>
    setSim((s) => {
      const next = [...s[key]];
      next[i] = value;
      return { ...s, [key]: next };
    });
  const pf = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const firstYear = rows.slice(0, 12);
  const deviceMode = sim.saasMode === "device";

  return (
    <div className="sim">
      <button type="button" className="sim-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span>{open ? tx.hide : tx.show}</span>
        <span className={"chev" + (open ? " up" : "")} aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="sim-body">
          <p className="muted">{tx.intro} {tx.linked}</p>

          <div className="sim-groups">
            <fieldset className="group">
              <legend>{tx.tpvGroup}</legend>
              <div className="grid-2">
                <div>
                  <label htmlFor="sim-years">{tx.horizon}</label>
                  <select id="sim-years" value={years} onChange={(e) => update({ years: parseInt(e.target.value, 10) })}>
                    {[1, 2, 3].map((n) => (
                      <option key={n} value={n}>{tx.years(n)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="sim-growth">{tx.growth}</label>
                  <input id="sim-growth" type="number" value={sim.growth} onChange={(e) => update({ growth: pf(e.target.value) })} />
                </div>
              </div>
              <div className="btn-row">
                <button type="button" onClick={() => update({ season: [...RESTAURANT_PRESET] })}>{tx.restaurantPreset}</button>
                <button type="button" onClick={() => update({ season: Array(12).fill(100) })}>{tx.resetSeason}</button>
              </div>
            </fieldset>

            <fieldset className="group">
              <legend>{tx.saasGroup}</legend>
              <label>{tx.saasMode}</label>
              <div className="segmented" role="radiogroup">
                <button type="button" role="radio" aria-checked={!deviceMode} className={!deviceMode ? "on" : ""} onClick={() => update({ saasMode: "flat" })}>
                  {tx.modeFlat}
                </button>
                <button type="button" role="radio" aria-checked={deviceMode} className={deviceMode ? "on" : ""} onClick={() => update({ saasMode: "device" })}>
                  {tx.modeDevice}
                </button>
              </div>
              {deviceMode && (
                <>
                  <div className="grid-3">
                    <div>
                      <label htmlFor="sim-platform">{tx.platformFee}</label>
                      <input id="sim-platform" type="number" value={sim.platformFee} onChange={(e) => update({ platformFee: pf(e.target.value) })} />
                    </div>
                    <div>
                      <label htmlFor="sim-ppd">{tx.pricePerDevice}</label>
                      <input id="sim-ppd" type="number" value={sim.pricePerDevice} onChange={(e) => update({ pricePerDevice: pf(e.target.value) })} />
                    </div>
                    <div>
                      <label htmlFor="sim-devices">{tx.defaultDevices}</label>
                      <input
                        id="sim-devices"
                        type="number"
                        min="0"
                        value={sim.devices}
                        onChange={(e) => update({ devices: pf(e.target.value), deviceOverride: Array(12).fill(null) })}
                      />
                    </div>
                  </div>
                  <p className="formula">
                    <span className="muted">{tx.platformHint}</span>
                    <strong>{tx.saasFormula(sim.platformFee, sim.pricePerDevice, sim.devices, currency)}</strong>
                  </p>
                </>
              )}
            </fieldset>
          </div>

          <div className="table-wrap">
            <table className="month-table">
              <thead>
                <tr>
                  <th>{tx.month}</th>
                  <th>{tx.season}</th>
                  <th className="num">{tx.tpv}</th>
                  {deviceMode && <th className="num">{tx.devices}</th>}
                  <th className="num">{tx.saas}</th>
                  <th className="num">{tx.competitor}</th>
                  <th className="num">{tx.ours}</th>
                  <th className="num">{tx.saving}</th>
                </tr>
              </thead>
              <tbody>
                {firstYear.map((r) => (
                  <tr key={r.m}>
                    <td>{monthNames[r.m]}</td>
                    <td className="season-cell">
                      <input
                        type="range"
                        min="80"
                        max="120"
                        step="5"
                        aria-label={`${tx.season} ${monthNames[r.m]}`}
                        value={sim.season[r.m]}
                        onChange={(e) => updateAt("season", r.m, clampSeason(parseFloat(e.target.value)))}
                      />
                      <span className="season-val">{sim.season[r.m]} %</span>
                    </td>
                    <td className="num">{fmt(r.monthTpv)}</td>
                    {deviceMode && (
                      <td className="num">
                        <input
                          type="number"
                          min="0"
                          className="cell-input narrow"
                          value={devicesFor(sim, r.m)}
                          onChange={(e) => updateAt("deviceOverride", r.m, pf(e.target.value))}
                        />
                      </td>
                    )}
                    <td className="num">
                      {deviceMode ? (
                        fmt(r.ourSaas)
                      ) : (
                        <input
                          type="number"
                          className="cell-input"
                          value={sim.saasOverride[r.m] ?? ours.saasFee}
                          onChange={(e) => updateAt("saasOverride", r.m, pf(e.target.value))}
                        />
                      )}
                    </td>
                    <td className="num">{fmt(r.compCost)}</td>
                    <td className="num">{fmt(r.ourCost)}</td>
                    <td className={"num " + (r.saving >= 0 ? "pos" : "neg")}>{fmt(r.saving)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>{tx.chartMonthly} ({currency})</h3>
          <Legend items={[{ label: tx.competitor, cls: "sw-comp" }, { label: tx.ours, cls: "sw-ours" }]} />
          <BarChart rows={rows} monthNames={monthNames} years={years} />

          <h3>{tx.chartCumulative} ({currency})</h3>
          <CumulativeChart rows={rows} monthNames={monthNames} years={years} hwPrice={hwPrice} />

          <div className="year-cards">
            {(years > 1 ? [...yearly, { ...totals, year: "total" }] : yearly).map((y) => (
              <div className="year-card" key={y.year}>
                <div className="year-title">{y.year === "total" ? tx.total : tx.yearTotal(y.year)}</div>
                <div className="kv"><span>{tx.competitorFees}</span><strong>{fmt(y.comp)} {currency}</strong></div>
                <div className="kv sub"><span>{tx.takeRateShare}</span><span>{fmt(y.compRate)} {currency}</span></div>
                <div className="kv"><span>{tx.ourFees}</span><strong>{fmt(y.ours)} {currency}</strong></div>
                <div className="kv sub"><span>{tx.takeRateShare}</span><span>{fmt(y.ourRate)} {currency}</span></div>
                <div className={"kv big " + (y.saving >= 0 ? "pos" : "neg")}><span>{tx.saving}</span><strong>{fmt(y.saving)} {currency}</strong></div>
              </div>
            ))}
          </div>

          <p className="sim-summary">
            <strong>{tx.summary(totals.saving, currency, years * 12)}</strong>
            {hwPrice > 0 && (
              <>
                {" "}
                {paybackMonth ? tx.payback(paybackMonth, hwPrice, currency) : tx.noPayback(hwPrice, currency)}
              </>
            )}
          </p>

          <div className="btn-row">
            <button type="button" onClick={() => setSim({ ...DEFAULT_SIM })}>{tx.reset}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Legend({ items }) {
  return (
    <div className="legend">
      {items.map((it) => (
        <span key={it.label}><i className={"swatch " + it.cls} />{it.label}</span>
      ))}
    </div>
  );
}

const W = 860;
const H = 260;
const PAD = { l: 64, r: 12, t: 12, b: 36 };

function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * p;
}

function xLabel(r, monthNames, years) {
  if (years === 1) return monthNames[r.m];
  return r.m === 0 ? `${monthNames[0]} ${r.year}` : r.m % 3 === 0 ? monthNames[r.m] : "";
}

function BarChart({ rows, monthNames, years }) {
  const max = niceMax(Math.max(...rows.map((r) => Math.max(r.compCost, r.ourCost)), 1));
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const slot = innerW / rows.length;
  const bw = Math.max(2, Math.min(18, slot * 0.36));
  const y = (v) => PAD.t + innerH - (Math.max(0, v) / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={PAD.l - 8} y={y(t) + 4} className="axis" textAnchor="end">{fmt(t)}</text>
        </g>
      ))}
      {rows.map((r) => {
        const cx = PAD.l + slot * r.i + slot / 2;
        return (
          <g key={r.i}>
            <rect x={cx - bw - 1} y={y(r.compCost)} width={bw} height={y(0) - y(r.compCost)} className="bar-comp" rx="2">
              <title>{`${monthNames[r.m]}: ${fmt(r.compCost)}`}</title>
            </rect>
            <rect x={cx + 1} y={y(r.ourCost)} width={bw} height={y(0) - y(r.ourCost)} className="bar-ours" rx="2">
              <title>{`${monthNames[r.m]}: ${fmt(r.ourCost)}`}</title>
            </rect>
            <text x={cx} y={H - 12} className="axis" textAnchor="middle">{xLabel(r, monthNames, years)}</text>
          </g>
        );
      })}
    </svg>
  );
}

function CumulativeChart({ rows, monthNames, years, hwPrice }) {
  const vals = rows.map((r) => r.cumulative);
  const hi = Math.max(0, ...vals, hwPrice > 0 ? hwPrice : 0);
  const lo = Math.min(0, ...vals);
  const top = hi > 0 ? niceMax(hi * 1.05) : 0;
  const bottom = lo < 0 ? -niceMax(-lo * 1.05) : 0;
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const slot = innerW / rows.length;
  const x = (i) => PAD.l + slot * i + slot / 2;
  const y = (v) => PAD.t + ((top - v) / (top - bottom || 1)) * innerH;
  const pts = rows.map((r) => `${x(r.i)},${y(r.cumulative)}`).join(" ");
  const area = `${x(0)},${y(0)} ${pts} ${x(rows.length - 1)},${y(0)}`;
  const last = rows[rows.length - 1];
  const positive = last.cumulative >= 0;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => bottom + f * (top - bottom));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img">
      {ticks.map((t, k) => (
        <g key={k}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="grid" />
          <text x={PAD.l - 8} y={y(t) + 4} className="axis" textAnchor="end">{fmt(t)}</text>
        </g>
      ))}
      <line x1={PAD.l} x2={W - PAD.r} y1={y(0)} y2={y(0)} className="zero" />
      {hwPrice > 0 && (
        <g>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(hwPrice)} y2={y(hwPrice)} className="hw-line" />
          <text x={W - PAD.r} y={y(hwPrice) - 5} className="axis" textAnchor="end">HW {fmt(hwPrice)}</text>
        </g>
      )}
      <polygon points={area} className={positive ? "area-pos" : "area-neg"} />
      <polyline points={pts} className={positive ? "line-pos" : "line-neg"} fill="none" />
      {rows.map((r) => (
        <g key={r.i}>
          <circle cx={x(r.i)} cy={y(r.cumulative)} r={years === 1 ? 3.5 : 2} className={r.cumulative >= 0 ? "dot-pos" : "dot-neg"}>
            <title>{`${monthNames[r.m]}: ${fmt(r.cumulative)}`}</title>
          </circle>
          <text x={x(r.i)} y={H - 12} className="axis" textAnchor="middle">{xLabel(r, monthNames, years)}</text>
        </g>
      ))}
      <text x={x(last.i)} y={y(last.cumulative) - 10} className={"end-label " + (positive ? "pos" : "neg")} textAnchor="end">
        {fmt(last.cumulative)}
      </text>
    </svg>
  );
}
