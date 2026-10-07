// Shared calculation for the yearly simulation and the monthly-average summary.

export const DEFAULT_SIM = {
  season: Array(12).fill(100), // % of base TPV per month (80–120)
  saasMode: "flat", // "flat" | "device"
  saasOverride: Array(12).fill(null), // flat mode: per-month SaaS fee (null = use base fee)
  platformFee: 100, // licence mode: monthly SaaS excluding licences
  firstLicence: 30, // licence mode: monthly price of the first licence
  otherLicence: 20, // licence mode: monthly price of each additional licence
  devices: 2, // licence mode: default number of licences
  deviceOverride: Array(12).fill(null), // device mode: per-month device count (null = default)
  years: 1,
  growth: 0, // yearly TPV growth in %
};

export const RESTAURANT_PRESET = [85, 80, 90, 95, 105, 110, 115, 115, 105, 100, 95, 120];

const num = (v) => (Number.isFinite(v) ? v : 0);

export function isSimCustomised(sim) {
  return (
    sim.season.some((s) => s !== 100) ||
    sim.saasMode !== "flat" ||
    sim.saasOverride.some((v) => v !== null) ||
    num(sim.growth) !== 0 ||
    sim.years !== 1
  );
}

export function devicesFor(sim, m) {
  return sim.deviceOverride[m] ?? sim.devices;
}

export function licenceCost(sim, count) {
  const n = Math.max(0, num(count));
  if (n === 0) return 0;
  return num(sim.firstLicence) + (n - 1) * num(sim.otherLicence);
}

export function saasFor(sim, m, baseSaas) {
  if (sim.saasMode === "device") {
    return num(sim.platformFee) + licenceCost(sim, devicesFor(sim, m));
  }
  return sim.saasOverride[m] ?? num(baseSaas);
}

export function computeSimulation({ tpv, competitor, ours, hwPrice, sim, start = new Date() }) {
  // The simulation starts in the current calendar month and runs forward; seasonality follows calendar months.
  const startMonth = start.getMonth();
  const startYear = start.getFullYear();
  const monthlyGrowth = Math.pow(1 + num(sim.growth) / 100, 1 / 12) - 1;
  const rows = [];
  let cumulative = 0;
  let paybackMonth = null;

  for (let i = 0; i < sim.years * 12; i++) {
    const m = (startMonth + i) % 12;
    const calYear = startYear + Math.floor((startMonth + i) / 12);
    const monthTpv = num(tpv) * (sim.season[m] / 100) * Math.pow(1 + monthlyGrowth, i);
    const txCount = competitor.avgTransactionValue > 0 ? monthTpv / competitor.avgTransactionValue : 0;
    // Acquiring = interchange + card scheme fees + acquirer take rate (IC++), all as % of card TPV.
    const compCard = (monthTpv * (num(competitor.ic) + num(competitor.sf))) / 100;
    const compMarkup = (monthTpv * num(competitor.takeRate)) / 100;
    const compPerTx = num(competitor.feePerTransaction) * txCount;
    const compRate = compCard + compMarkup + compPerTx;
    const compSaas = num(competitor.saasFee);
    const compCost = compRate + compSaas;
    const ourCard = (monthTpv * (num(ours.ic) + num(ours.sf))) / 100;
    const ourMarkup = (monthTpv * num(ours.takeRate)) / 100;
    const ourRate = ourCard + ourMarkup;
    const ourSaas = saasFor(sim, m, ours.saasFee);
    const ourCost = ourRate + ourSaas;
    const saving = compCost - ourCost;
    cumulative += saving;
    if (paybackMonth === null && hwPrice > 0 && cumulative >= hwPrice) paybackMonth = i + 1;
    rows.push({ i, m, calYear, year: Math.floor(i / 12) + 1, monthTpv, compCard, compMarkup, compPerTx, compRate, compSaas, compCost, ourCard, ourMarkup, ourRate, ourSaas, ourCost, saving, cumulative });
  }

  const sum = (list, key) => list.reduce((a, r) => a + r[key], 0);
  const pack = (list) => ({
    comp: sum(list, "compCost"),
    compRate: sum(list, "compRate"),
    ours: sum(list, "ourCost"),
    ourRate: sum(list, "ourRate"),
    saving: sum(list, "saving"),
  });
  const yearly = Array.from({ length: sim.years }, (_, y) => ({ year: y + 1, ...pack(rows.filter((r) => r.year === y + 1)) }));
  const totals = pack(rows);
  const n = rows.length || 1;
  const avg = {
    tpv: sum(rows, "monthTpv") / n,
    comp: totals.comp / n,
    ours: totals.ours / n,
    saas: sum(rows, "ourSaas") / n,
    compCard: sum(rows, "compCard") / n,
    compMarkup: sum(rows, "compMarkup") / n,
    compPerTx: sum(rows, "compPerTx") / n,
    compSaas: sum(rows, "compSaas") / n,
    ourCard: sum(rows, "ourCard") / n,
    ourMarkup: sum(rows, "ourMarkup") / n,
  };

  return { rows, yearly, totals, avg, paybackMonth };
}

// Reads a number input and removes leading zeros the browser keeps on screen (e.g. "0800" -> "800").
export function readNum(e) {
  const raw = e.target.value;
  const clean = raw.replace(/^(-?)0+(?=\d)/, "$1");
  if (clean !== raw) e.target.value = clean;
  const n = parseFloat(clean);
  return Number.isFinite(n) ? n : 0;
}
