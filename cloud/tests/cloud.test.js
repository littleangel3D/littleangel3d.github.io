import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { stateService } from "../server/state-service.mjs";
import { seed, Repository } from "../public/model.js";
import { CloudSync } from "../public/cloud-sync.js";
const user = { userId: "owner-test", email: "owner@example.test" },
  email = user.email;
function database() {
  const sql = new DatabaseSync(":memory:");
  sql.exec(
    readFileSync(
      new URL("../drizzle/0000_material_cyclops.sql", import.meta.url),
      "utf8",
    ).replaceAll("--> statement-breakpoint", ""),
  );
  return {
    sql,
    prepare(query) {
      const s = sql.prepare(query);
      let args = [];
      return {
        bind(...v) {
          args = v;
          return this;
        },
        async first() {
          return s.get(...args) || null;
        },
        async run() {
          const r = s.run(...args);
          return { meta: { changes: Number(r.changes) } };
        },
      };
    },
    async batch(statements) {
      sql.exec("BEGIN");
      try {
        const values = [];
        for (const s of statements) values.push(await s.run());
        sql.exec("COMMIT");
        return values;
      } catch (e) {
        sql.exec("ROLLBACK");
        throw e;
      }
    },
  };
}
const req = (data, rev = 0, origin = "https://test.example") =>
  new Request("https://test.example/api/state", {
    method: "PUT",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ data, baseRevision: rev }),
  });
const get = () => new Request("https://test.example/api/state");
function memory(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => map.get(k) || null,
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
  };
}
function api(db) {
  return async (path, options) =>
    path === "/api/session"
      ? Response.json({
          authenticated: true,
          canEdit: true,
          configured: true,
          userId: user.userId,
        })
      : stateService(
          new Request("https://test.example" + path, options),
          db,
          user,
          email,
        );
}
test("unauthenticated reads and writes fail; wrong owner and cross-origin writes fail", async () => {
  const db = database();
  assert.equal((await stateService(get(), db, null, email)).status, 401);
  assert.equal(
    (
      await stateService(
        req(seed()),
        db,
        { userId: "other", email: "wrong@test" },
        email,
      )
    ).status,
    403,
  );
  assert.equal(
    (await stateService(req(seed(), 0, "https://evil.test"), db, user, email))
      .status,
    403,
  );
  assert.equal(
    db.sql.prepare("SELECT count(*) n FROM business_state").get().n,
    0,
  );
});
test("server commits actual SQL data and a new browser reloads the same values", async () => {
  const db = database(),
    storage1 = memory(),
    r1 = new Repository(storage1),
    client1 = new CloudSync(r1, { fetcher: api(db), storage: storage1 });
  await client1.start();
  assert.equal(client1.status, "saved");
  r1.data.businessPlan.studentCount = 318;
  r1.save();
  await client1.flush();
  assert.equal(client1.status, "saved");
  assert.equal(
    JSON.parse(
      db.sql.prepare("SELECT payload FROM business_state").get().payload,
    ).businessPlan.studentCount,
    318,
  );
  const storage2 = memory(),
    r2 = new Repository(storage2),
    client2 = new CloudSync(r2, { fetcher: api(db), storage: storage2 });
  await client2.start();
  assert.equal(r2.data.businessPlan.studentCount, 318);
  assert.equal(client2.revision, client1.revision);
  assert.ok(
    db.sql.prepare("SELECT count(*) n FROM state_versions").get().n >= 1,
  );
});
test("CAS prevents a stale device from overwriting another device", async () => {
  const db = database(),
    data = seed();
  await stateService(req(data), db, user, email);
  const changed = structuredClone(data);
  changed.settings.initial = 40000000;
  const saved = await stateService(req(changed, 1), db, user, email);
  assert.equal(saved.status, 200);
  data.settings.initial = 35000000;
  const conflict = await stateService(req(data, 1), db, user, email);
  assert.equal(conflict.status, 409);
  assert.equal(
    JSON.parse(
      db.sql.prepare("SELECT payload FROM business_state").get().payload,
    ).settings.initial,
    40000000,
  );
});
test("retries after a lost response are idempotent", async () => {
  const db = database(),
    data = seed();
  const a = await (await stateService(req(data), db, user, email)).json(),
    b = await (await stateService(req(data), db, user, email)).json();
  assert.equal(a.revision, b.revision);
  assert.equal(
    db.sql.prepare("SELECT count(*) n FROM business_state").get().n,
    1,
  );
});
test("network failure keeps a draft and never reports saved; retry really persists it", async () => {
  const db = database(),
    storage = memory(),
    repo = new Repository(storage);
  let offline = false;
  const real = api(db),
    fetcher = (...a) => {
      if (offline) throw Error("Offline");
      return real(...a);
    };
  const cloud = new CloudSync(repo, { fetcher, storage });
  await cloud.start();
  offline = true;
  repo.data.businessPlan.studentCount = 321;
  repo.save();
  await cloud.flush();
  assert.equal(cloud.status, "error");
  assert.ok(storage.getItem("cuchi-cloud-draft-v1"));
  assert.notEqual(
    JSON.parse(
      db.sql.prepare("SELECT payload FROM business_state").get().payload,
    ).businessPlan.studentCount,
    321,
  );
  offline = false;
  await cloud.retry();
  assert.equal(cloud.status, "saved");
  assert.equal(
    JSON.parse(
      db.sql.prepare("SELECT payload FROM business_state").get().payload,
    ).businessPlan.studentCount,
    321,
  );
  assert.equal(storage.getItem("cuchi-cloud-draft-v1"), null);
});
test("anonymous demo never overwrites previous owner cache or uploads records", async () => {
  const storage = memory(),
    repo = new Repository(storage);
  repo.data.businessPlan.studentCount = 555;
  repo.save();
  const before = storage.getItem("cuchi-os-v1");
  const cloud = new CloudSync(repo, {
    storage,
    fetcher: async () =>
      Response.json({ authenticated: false, canEdit: false, configured: true }),
  });
  await cloud.start();
  assert.equal(cloud.status, "signed-out");
  repo.data.businessPlan.studentCount = 777;
  repo.save();
  assert.equal(storage.getItem("cuchi-os-v1"), before);
});
test("invalid payload cannot replace existing server data", async () => {
  const db = database(),
    data = seed();
  await stateService(req(data), db, user, email);
  data.settings.initial = -1;
  assert.equal((await stateService(req(data, 1), db, user, email)).status, 400);
  assert.equal(
    db.sql.prepare("SELECT revision FROM business_state").get().revision,
    1,
  );
});
test("remote refresh does not replace a draft created while GET is in flight", async () => {
  const db = database(),
    storage = memory(),
    repo = new Repository(storage),
    real = api(db);
  let release,
    delay = false;
  const cloud = new CloudSync(repo, {
    storage,
    fetcher: async (path, options) => {
      const result = await real(path, options);
      if (delay && path === "/api/state" && !options?.method) {
        await new Promise((resolve) => {
          release = resolve;
        });
      }
      return result;
    },
  });
  await cloud.start();
  delay = true;
  const refreshing = cloud.refresh();
  while (!release) await new Promise((resolve) => setTimeout(resolve, 0));
  repo.data.businessPlan.studentCount = 456;
  repo.save();
  release();
  await refreshing;
  await cloud.flush();
  assert.equal(repo.data.businessPlan.studentCount, 456);
});
test("refresh is deferred while an edit form is open", async () => {
  const db = database(),
    storage = memory(),
    repo = new Repository(storage);
  let editing = false,
    calls = 0;
  const real = api(db);
  const cloud = new CloudSync(repo, {
    storage,
    canRefresh: () => !editing,
    fetcher: (...args) => {
      calls++;
      return real(...args);
    },
  });
  await cloud.start();
  editing = true;
  const before = calls;
  await cloud.refresh();
  assert.equal(calls, before);
});
