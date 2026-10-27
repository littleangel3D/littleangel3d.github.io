import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultPlan,
  ensurePlan,
  validatePlan,
  editPhase,
} from "../public/plan.js";
import { seed, Repository, validateImport, metrics } from "../public/model.js";
test("image plan totals match 23–29 million and contains all eight sections", () => {
  const p = validatePlan(defaultPlan());
  assert.equal(
    p.investment.reduce((s, r) => s + r.low, 0),
    23000000,
  );
  assert.equal(
    p.investment.reduce((s, r) => s + r.high, 0),
    29000000,
  );
  assert.equal(p.phases.length, 5);
  assert.equal(p.forecast.length, 4);
  for (const key of [
    "vision",
    "values",
    "segments",
    "targets",
    "investment",
    "streams",
    "phases",
    "forecast",
  ])
    assert.ok(p[key].length);
});
test("legacy local data gains plan without changing records or progress", () => {
  const old = seed();
  delete old.businessPlan;
  old.roadmap[1].title = "Lộ trình đã chỉnh";
  const original = JSON.stringify(old);
  const storage = {
    getItem() {
      return original;
    },
    setItem(k, v) {
      this.saved = v;
    },
  };
  const repo = new Repository(storage);
  assert.ok(repo.data.businessPlan);
  const migrated = structuredClone(repo.data);
  delete migrated.businessPlan;
  assert.deepEqual(migrated, old);
  assert.equal(repo.data.roadmap[1].title, "Lộ trình đã chỉnh");
});
test("old JSON backups gain plan and retain business data", () => {
  const d = seed();
  delete d.businessPlan;
  const os = JSON.stringify(d.orders);
  assert.ok(validateImport(d).businessPlan);
  assert.equal(JSON.stringify(d.orders), os);
});
test("changed forecast cannot alter actual financial results", () => {
  const d = seed(),
    before = metrics(d, "2026-10");
  d.businessPlan.forecast[0].revenueHigh = 999000000;
  d.businessPlan.investment[0].high = 25000000;
  const after = metrics(d, "2026-10");
  assert.equal(after.revenue, before.revenue);
  assert.equal(after.profit, before.profit);
  assert.equal(after.invested, before.invested);
});
test("inverted ranges and invalid machine rules are rejected", () => {
  for (const change of [
    (p) => (p.investment[0].low = 99000000),
    (p) => (p.forecast[0].profitLow = 99900000),
    (p) => (p.phases[0].start = 5),
    (p) => (p.machineMonths = 7),
    (p) => (p.kpis[0].green = 10),
  ]) {
    const p = defaultPlan();
    change(p);
    assert.throws(() => validatePlan(p));
  }
});
test("phase edits preserve checked tasks by name and reopen gate for new tasks", () => {
  const old = {
    title: "Old",
    months: "1–2",
    tasks: ["A", "B"],
    done: [true, true],
    passed: true,
    gate: "Gate",
  };
  const p = editPhase(old, {
    title: "Renamed",
    months: "2–3",
    tasks: "B\nA\nC",
    gate: "New gate",
  });
  assert.deepEqual(p.done, [true, true, false]);
  assert.equal(p.passed, false);
  assert.equal(p.title, "Renamed");
  assert.throws(() =>
    editPhase(old, { title: "", months: "2", tasks: "A", gate: "G" }),
  );
});
test("variable-length execution roadmap can roundtrip through backup", () => {
  const d = seed();
  d.roadmap.push(
    editPhase(null, {
      title: "Community",
      months: "Tháng 13–15",
      tasks: "Tổ chức maker meetup",
      gate: "Có người tham dự thật",
    }),
  );
  d.settings.phase = 6;
  assert.equal(validateImport(JSON.parse(JSON.stringify(d))).roadmap.length, 6);
});
test("editable checklist preserves backup compatibility", () => {
  const d = seed();
  d.businessPlan.storeChecklist += "\nBảo hiểm";
  d.store.checks.push(false);
  assert.equal(validateImport(d).store.checks.length, 13);
  d.store.checks.pop();
  assert.throws(() => validateImport(d));
});
