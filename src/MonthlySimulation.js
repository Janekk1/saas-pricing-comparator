import React, { useEffect, useRef, useState } from "react";
import { RESTAURANT_PRESET, DEFAULT_SIM, devicesFor, readNum } from "./simulation";

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
    modeDevice: "SaaS + licence",
    platformFee: "SaaS bez licencí",
    platformHint: "Měsíčně: SaaS bez licencí + 1. licence + další licence",
    firstLicence: "Cena 1. licence",
    otherLicence: "Cena další licence",
    defaultDevices: "Počet licencí",
    saasFormula: (p, f, o, n, cur) => formula(p, f, o, n, cur, "měsíc"),
    resetSeason: "Sezónnost na 100 %",
    restaurantPreset: "Typická gastro sezóna",
    month: "Měsíc",
    season: "Sezónnost",
    tpv: "TPV",
    devices: "Licence",
    saas: "Storyous SAAS",
    competitor: "Konkurence",
    ours: "Storyous + Teya",
    saving: "Úspora",
    chartMonthly: "Měsíční náklady a úspora klienta",
    rightAxis: "(pravá osa)",
    startNote: (m, y) => `Simulace začíná aktuálním měsícem: ${m} ${y}.`,
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
    modeDevice: "SaaS + licencie",
    platformFee: "SaaS bez licencií",
    platformHint: "Mesačne: SaaS bez licencií + 1. licencia + ďalšie licencie",
    firstLicence: "Cena 1. licencie",
    otherLicence: "Cena ďalšej licencie",
    defaultDevices: "Počet licencií",
    saasFormula: (p, f, o, n, cur) => formula(p, f, o, n, cur, "mesiac"),
    resetSeason: "Sezónnosť na 100 %",
    restaurantPreset: "Typická gastro sezóna",
    month: "Mesiac",
    season: "Sezónnosť",
    tpv: "TPV",
    devices: "Licencie",
    saas: "Storyous SAAS",
    competitor: "Konkurencia",
    ours: "Storyous + Teya",
    saving: "Úspora",
    chartMonthly: "Mesačné náklady a úspora klienta",
    rightAxis: "(pravá os)",
    startNote: (m, y) => `Simulácia začína aktuálnym mesiacom: ${m} ${y}.`,
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
    modeDevice: "SaaS + licences",
    platformFee: "SaaS excl. licences",
    platformHint: "Monthly: SaaS excl. licences + first licence + extra licences",
    firstLicence: "First licence",
    otherLicence: "Each extra licence",
    defaultDevices: "Number of licences",
    saasFormula: (p, f, o, n, cur) => formula(p, f, o, n, cur, "month"),
    resetSeason: "Seasonality to 100%",
    restaurantPreset: "Typical restaurant season",
    month: "Month",
    season: "Seasonality",
    tpv: "TPV",
    devices: "Licences",
    saas: "Storyous SaaS",
    competitor: "Competitor",
    ours: "Storyous + Teya",
    saving: "Saving",
    chartMonthly: "Client's monthly cost and saving",
    rightAxis: "(right axis)",
    startNote: (m, y) => `The simulation starts in the current month: ${m} ${y}.`,
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

function formula(p, f, o, n, cur, per) {
  const count = Math.max(0, n || 0);
  const parts = [fmt(p)];
  if (count >= 1) parts.push(fmt(f));
  if (count >= 2) parts.push(`${fmt(count - 1)} × ${fmt(o)}`);
  const total = (p || 0) + (count >= 1 ? f || 0 : 0) + Math.max(0, count - 1) * (o || 0);
  return `${parts.join(" + ")} = ${fmt(total)} ${cur} / ${per}`;
}

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
          <p className="muted">{tx.intro} {tx.linked} {tx.startNote(monthNames[rows[0].m], rows[0].calYear)}</p>

          <div className="sim-groups">
            <section className="panel group">
              <div className="eyebrow">{tx.tpvGroup}</div>
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
                  <input id="sim-growth" type="number" value={sim.growth} onChange={(e) => update({ growth: readNum(e) })} />
                </div>
              </div>
              <div className="btn-row">
                <button type="button" className="pill-btn small" onClick={() => update({ season: [...RESTAURANT_PRESET] })}>{tx.restaurantPreset}</button>
                <button type="button" className="pill-btn small" onClick={() => update({ season: Array(12).fill(100) })}>{tx.resetSeason}</button>
              </div>
            </section>

            <section className="panel group">
              <div className="eyebrow">{tx.saasGroup}</div>
              <label>{tx.saasMode}</label>
              <div className="seg">
                <button type="button" aria-pressed={!deviceMode} onClick={() => update({ saasMode: "flat" })}>
                  {tx.modeFlat}
                </button>
                <button type="button" aria-pressed={deviceMode} onClick={() => update({ saasMode: "device" })}>
                  {tx.modeDevice}
                </button>
              </div>
              {deviceMode && (
                <>
                  <div className="grid-4">
                    <div>
                      <label htmlFor="sim-platform">{tx.platformFee}</label>
                      <input id="sim-platform" type="number" min="0" value={sim.platformFee} onChange={(e) => update({ platformFee: readNum(e) })} />
                    </div>
                    <div>
                      <label htmlFor="sim-devices">{tx.defaultDevices}</label>
                      <input
                        id="sim-devices"
                        type="number"
                        min="0"
                        value={sim.devices}
                        onChange={(e) => update({ devices: readNum(e), deviceOverride: Array(12).fill(null) })}
                      />
                    </div>
                    <div>
                      <label htmlFor="sim-first">{tx.firstLicence}</label>
                      <input id="sim-first" type="number" min="0" value={sim.firstLicence} onChange={(e) => update({ firstLicence: readNum(e) })} />
                    </div>
                    <div>
                      <label htmlFor="sim-other">{tx.otherLicence}</label>
                      <input id="sim-other" type="number" min="0" value={sim.otherLicence} onChange={(e) => update({ otherLicence: readNum(e) })} />
                    </div>
                  </div>
                  <p className="formula">
                    <span className="muted">{tx.platformHint}</span>
                    <strong>{tx.saasFormula(sim.platformFee, sim.firstLicence, sim.otherLicence, sim.devices, currency)}</strong>
                  </p>
                </>
              )}
            </section>
          </div>

          <div className="panel flush">
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
                    <td>{monthNames[r.m]} {String(r.calYear).slice(2)}</td>
                    <td>
                      <div className="season-cell">
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
                      </div>
                    </td>
                    <td className="num">{fmt(r.monthTpv)}</td>
                    {deviceMode && (
                      <td className="num">
                        <input
                          type="number"
                          min="0"
                          className="cell-input narrow"
                          value={devicesFor(sim, r.m)}
                          onChange={(e) => updateAt("deviceOverride", r.m, readNum(e))}
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
                          onChange={(e) => updateAt("saasOverride", r.m, readNum(e))}
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
          </div>

          <div className="panel">
          <div className="panel-h"><div className="eyebrow">{tx.chartMonthly} ({currency})</div></div>
          <Legend
            items={[
              { label: tx.competitor, cls: "sw-comp" },
              { label: tx.ours, cls: "sw-ours" },
              { label: tx.chartCumulative + " " + tx.rightAxis, cls: "sw-line" },
            ]}
          />
          <div className="table-wrap">
            <ComboChart rows={rows} monthNames={monthNames} years={years} hwPrice={hwPrice} savingLabel={tx.saving} />
          </div>
          </div>

          <div className="year-cards">
            {(years > 1 ? [...yearly, { ...totals, year: "total" }] : yearly).map((y) => (
              <div className="year-card" key={y.year}>
                <div className="year-title">{y.year === "total" ? tx.total : tx.yearTotal(y.year)}<span className="period">{periodLabel(y.year === "total" ? rows : rows.filter((r) => r.year === y.year), monthNames)}</span></div>
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
            <button type="button" className="pill-btn small" onClick={() => setSim({ ...DEFAULT_SIM })}>{tx.reset}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function periodLabel(list, monthNames) {
  if (!list.length) return "";
  const a = list[0];
  const b = list[list.length - 1];
  return `${monthNames[a.m]} ${a.calYear} – ${monthNames[b.m]} ${b.calYear}`;
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

const H = 330;
const PAD = { l: 64, r: 64, t: 16, b: 64 };

function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * p;
}

function compact(n) {
  const a = Math.abs(n);
  if (a < 1000) return fmt(n);
  return (n / 1000).toLocaleString("cs-CZ", { maximumFractionDigits: a < 10000 ? 1 : 0 }) + "k";
}

// Bars: monthly cost (left axis). Line: cumulative saving (right axis). Zero lines are aligned.
// Draw at the real pixel width so chart text matches the 13–14px used in the rest of the page.
function useWidth(min) {
  const ref = useRef(null);
  const [w, setW] = useState(880);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setW(Math.max(min, Math.round(el.clientWidth)));
    update();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [min]);
  return [ref, w];
}

function ComboChart(props) {
  const [ref, width] = useWidth(560);
  return (
    <div ref={ref} className="chart-box">
      <ComboChartSvg {...props} W={width} />
    </div>
  );
}

function ComboChartSvg({ rows, monthNames, years, hwPrice, savingLabel, W }) {
  const STEPS = 4;
  const lStep = niceMax((Math.max(...rows.map((r) => Math.max(r.compCost, r.ourCost)), 1) * 1.02) / STEPS);
  const lMax = lStep * STEPS;
  const cum = rows.map((r) => r.cumulative);
  const cMax = Math.max(0, ...cum, hwPrice > 0 ? hwPrice : 0);
  const cMin = Math.min(0, ...cum);
  const rStep = niceMax((Math.max(cMax, -cMin * 0.25, 1) * 1.05) / STEPS);
  const rMax = rStep * STEPS;
  const nNeg = cMin < 0 ? Math.ceil(-cMin / rStep) : 0;
  const lMin = -nNeg * lStep;
  const rMin = -nNeg * rStep;

  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const slot = innerW / rows.length;
  const bw = Math.max(2, Math.min(22, slot * 0.3));
  const yL = (v) => PAD.t + ((lMax - v) / (lMax - lMin)) * innerH;
  const yR = (v) => PAD.t + ((rMax - v) / (rMax - rMin)) * innerH;
  const cx = (i) => PAD.l + slot * i + slot / 2;
  const ticks = Array.from({ length: STEPS + nNeg + 1 }, (_, k) => k - nNeg);
  const pts = rows.map((r) => `${cx(r.i)},${yR(r.cumulative)}`).join(" ");
  const last = rows[rows.length - 1];
  const showAllLabels = (W - PAD.l - PAD.r) / rows.length >= 44;
  const slotPx = (W - PAD.l - PAD.r) / rows.length;
  const savingFont = slotPx >= 44 ? 13 : slotPx >= 30 ? 11 : 9;
  const xLab = (r) => {
    const yy = String(r.calYear).slice(2);
    if (r.i === 0 || r.m === 0) return `${monthNames[r.m]} ${yy}`;
    return showAllLabels || r.i % 3 === 0 ? monthNames[r.m] : "";
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="chart" role="img">
      {ticks.map((k) => (
        <g key={k}>
          <line x1={PAD.l} x2={W - PAD.r} y1={yL(k * lStep)} y2={yL(k * lStep)} className={k === 0 ? "zero" : "grid"} />
          <text x={PAD.l - 8} y={yL(k * lStep) + 4} className="axis" textAnchor="end">{fmt(k * lStep)}</text>
          <text x={W - PAD.r + 8} y={yR(k * rStep) + 4} className="axis axis-r" textAnchor="start">{fmt(k * rStep)}</text>
        </g>
      ))}

      {rows.map((r) => (
        <g key={r.i}>
          <rect x={cx(r.i) - bw - 1} y={yL(r.compCost)} width={bw} height={yL(0) - yL(r.compCost)} className="bar-comp" rx="2">
            <title>{`${monthNames[r.m]} ${r.calYear}: ${fmt(r.compCost)}`}</title>
          </rect>
          <rect x={cx(r.i) + 1} y={yL(r.ourCost)} width={bw} height={yL(0) - yL(r.ourCost)} className="bar-ours" rx="2">
            <title>{`${monthNames[r.m]} ${r.calYear}: ${fmt(r.ourCost)}`}</title>
          </rect>
        </g>
      ))}

      {hwPrice > 0 && hwPrice <= rMax && (
        <g>
          <line x1={PAD.l} x2={W - PAD.r} y1={yR(hwPrice)} y2={yR(hwPrice)} className="hw-line" />
          <text x={PAD.l + 6} y={yR(hwPrice) - 5} className="axis halo">HW {fmt(hwPrice)}</text>
        </g>
      )}

      <polyline points={pts} className="line-cum" fill="none" />
      {rows.map((r) => (
        <circle key={r.i} cx={cx(r.i)} cy={yR(r.cumulative)} r={rows.length <= 12 ? 4 : 2.5} className={r.cumulative >= 0 ? "dot-pos" : "dot-neg"}>
          <title>{`${monthNames[r.m]} ${r.calYear}: ${fmt(r.cumulative)}`}</title>
        </circle>
      ))}
      <text x={cx(last.i) - 6} y={yR(last.cumulative) - 10} className={"end-label " + (last.cumulative >= 0 ? "pos" : "neg")} textAnchor="end">
        {fmt(last.cumulative)}
      </text>

      {rows.map((r) => (
        <g key={"x" + r.i}>
          <text x={cx(r.i)} y={H - PAD.b + 18} className="axis" textAnchor="middle">{xLab(r)}</text>
          <text
            x={cx(r.i)}
            y={H - PAD.b + 44}
            className={"saving-val " + (r.saving >= 0 ? "pos" : "neg")}
            style={{ fontSize: savingFont }}
            textAnchor="middle"
          >
            {compact(r.saving)}
          </text>
        </g>
      ))}
      <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b + 28} y2={H - PAD.b + 28} className="grid" />
      <text x={PAD.l - 8} y={H - PAD.b + 44} className="axis saving-head" textAnchor="end">{savingLabel}</text>
    </svg>
  );
}
