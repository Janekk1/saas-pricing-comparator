// Shared calculation for the yearly simulation and the monthly-average summary.

export const DEFAULT_SIM = {
  season: Array(12).fill(100), // % of base TPV per month (80–120)
  saasMode: "flat", // "flat" | "device"
  saasOverride: Array(12).fill(null), // flat mode: per-month SaaS fee (null = use base fee)
  platformFee: 100, // device mode: monthly fee for everything not tied to devices
  pricePerDevice: 30, // device mode: monthly price per device
  devices: 2, // device mode: default number of devices
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

export function saasFor(sim, m, baseSaas) {
  if (sim.saasMode === "device") {
    return num(sim.platformFee) + num(devicesFor(sim, m)) * num(sim.pricePerDevice);
  }
  return sim.saasOverride[m] ?? num(baseSaas);
}

export function computeSimulation({ tpv, competitor, ours, hwPrice, sim }) {
  const monthlyGrowth = Math.pow(1 + num(sim.growth) / 100, 1 / 12) - 1;
  const rows = [];
  let cumulative = 0;
  let paybackMonth = null;

  for (let i = 0; i < sim.years * 12; i++) {
    const m = i % 12;
    const monthTpv = num(tpv) * (sim.season[m] / 100) * Math.pow(1 + monthlyGrowth, i);
    const txCount = competitor.avgTransactionValue > 0 ? monthTpv / competitor.avgTransactionValue : 0;
    const compRate = (monthTpv * num(competitor.takeRate)) / 100;
    const compCost = compRate + num(competitor.saasFee) + num(competitor.feePerTransaction) * txCount;
    const ourRate = (monthTpv * num(ours.takeRate)) / 100;
    const ourSaas = saasFor(sim, m, ours.saasFee);
    const ourCost = ourRate + ourSaas;
    const saving = compCost - ourCost;
    cumulative += saving;
    if (paybackMonth === null && hwPrice > 0 && cumulative >= hwPrice) paybackMonth = i + 1;
    rows.push({ i, m, year: Math.floor(i / 12) + 1, monthTpv, compRate, compCost, ourRate, ourSaas, ourCost, saving, cumulative });
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
  };

  return { rows, yearly, totals, avg, paybackMonth };
}
