import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  Repository,
  metrics,
  economics,
  defaultCalc,
  transitionJob,
  validateImport,
  productScore,
  opportunity,
} from "../public/model.js";
test("capital allocation is exactly 30 million", () => {
  assert.equal(
    seed().budget.reduce((s, r) => s + r.budget, 0),
    30000000,
  );
});
test("calculator accounts for scrap, fees and non-profitable break-even", () => {
  const x = economics({
    ...defaultCalc,
    filamentPrice: 200000,
    weight: 100,
    hours: 2,
    electricity: 500,
    depreciation: 1500,
    failure: 20,
    labor: 5000,
    packaging: 3000,
    price: 100000,
    platform: 10,
    ad: 10000,
    shipping: 5000,
    fixed: 1000000,
  });
  assert.equal(x.material, 20000);
  assert.equal(x.machine, 4000);
  assert.equal(x.production, 30000);
  assert.equal(x.cogs, 38000);
  assert.equal(x.gross, 62000);
  assert.equal(x.contribution, 37000);
  assert.equal(x.breakEven, 28);
  assert.equal(economics({ ...defaultCalc, price: 0 }).breakEven, null);
});
test("only paid orders are recognized and expense updates monthly profit", () => {
  const d = seed(),
    base = metrics(d, "2026-10");
  d.expenses.push({ id: "test", amount: 100000, date: "2026-10-27" });
  assert.equal(metrics(d, "2026-10").profit, base.profit - 100000);
  d.orders.push({
    ...d.orders[0],
    id: "pending",
    status: "Đang xử lý",
    date: "2026-10-27",
    revenue: 1000000,
  });
  assert.equal(metrics(d, "2026-10").revenue, base.revenue);
  d.orders.at(-1).status = "Đã thanh toán";
  assert.equal(metrics(d, "2026-10").revenue, base.revenue + 1000000);
});
test("completion consumes filament exactly once", () => {
  const d = seed(),
    j = d.jobs.find((j) => j.status === "Printing"),
    f = d.filaments.find((f) => f.id === j.filament),
    before = f.remaining;
  j.grams = 20;
  transitionJob(d, j.id, "Completed");
  assert.equal(f.remaining, before - 20);
  assert.equal(j.deducted, true);
  assert.throws(() => transitionJob(d, j.id, "Completed"));
  assert.equal(f.remaining, before - 20);
});
test("failed prints consume actual recorded filament", () => {
  const d = seed(),
    j = d.jobs.find((j) => j.status === "Printing"),
    f = d.filaments.find((f) => f.id === j.filament),
    before = f.remaining;
  j.grams = 12;
  transitionJob(d, j.id, "Failed");
  assert.equal(f.remaining, before - 12);
});
test("insufficient filament does not partially change inventory or job", () => {
  const d = seed(),
    j = d.jobs.find((j) => j.status === "Printing");
  j.grams = 10000;
  const before = JSON.stringify(d);
  assert.throws(() => transitionJob(d, j.id, "Completed"), /Không đủ/);
  assert.equal(JSON.stringify(d), before);
});
test("one active job per printer", () => {
  const d = seed(),
    j = d.jobs.find((j) => j.status === "Queued");
  assert.throws(() => transitionJob(d, j.id, "Printing"), /đang có/);
});
test("repository CRUD survives reload and snapshot costs stay stable", () => {
  const storage = {
      v: null,
      getItem() {
        return this.v;
      },
      setItem(k, v) {
        this.v = v;
      },
    },
    r = new Repository(storage);
  r.upsert("ideas", { id: "new", name: "Test" });
  assert.equal(new Repository(storage).get("ideas", "new").name, "Test");
  r.upsert("ideas", { id: "new", name: "Updated" });
  assert.equal(r.get("ideas", "new").name, "Updated");
  r.delete("ideas", "new");
  assert.equal(r.get("ideas", "new"), undefined);
  const cost = r.data.orders[0].cogs;
  r.data.products[0].weight = 500;
  assert.equal(r.data.orders[0].cogs, cost);
});
test("backup validation rejects malformed and invalid numeric data", () => {
  assert.equal(validateImport(seed()).version, 1);
  assert.throws(() => validateImport({ version: 1 }));
  const d = seed();
  d.filaments[0].remaining = -1;
  assert.throws(() => validateImport(d));
});
test("scores remain in declared range at endpoints", () => {
  const p = {
    demand: 10,
    marginScore: 10,
    timeScore: 1,
    failureScore: 1,
    competition: 1,
    repeatability: 10,
    personalization: 10,
    scalability: 10,
  };
  assert.equal(productScore(p), 100);
  assert.equal(
    opportunity({
      demand: 10,
      margin: 10,
      competition: 1,
      printability: 10,
      uniqueness: 10,
    }),
    100,
  );
});
