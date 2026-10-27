import { validateImport } from "../public/model.js";
export const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export function authorized(user, ownerEmail) {
  return (
    !!user?.userId &&
    !!ownerEmail &&
    user.email?.toLowerCase() === ownerEmail.toLowerCase()
  );
}
export async function stateService(request, db, user, ownerEmail) {
  if (!user?.userId)
    return json(
      {
        error: "Cần đăng nhập để đọc hoặc lưu dữ liệu.",
        code: "sign_in_required",
      },
      401,
    );
  if (!authorized(user, ownerEmail))
    return json(
      {
        error: "Tài khoản này không có quyền quản lý dự án.",
        code: "forbidden",
      },
      403,
    );
  if (!db)
    return json(
      { error: "Database chưa sẵn sàng.", code: "database_unavailable" },
      503,
    );
  const key = "primary";
  if (request.method === "GET") {
    const row = await db
      .prepare(
        "SELECT owner_id,payload,revision,updated_at FROM business_state WHERE id = ?",
      )
      .bind(key)
      .first();
    if (!row)
      return json({ exists: false, data: null, revision: 0, updatedAt: null });
    if (row.owner_id !== user.userId)
      return json(
        { error: "Dữ liệu thuộc tài khoản khác.", code: "forbidden" },
        403,
      );
    return json({
      exists: true,
      data: JSON.parse(row.payload),
      revision: row.revision,
      updatedAt: row.updated_at,
    });
  }
  if (request.method !== "PUT")
    return json({ error: "Method not allowed" }, 405);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return json({ error: "Nguồn yêu cầu không hợp lệ." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Yêu cầu JSON." }, 415);
  const text = await request.text();
  if (text.length > 5 * 1024 * 1024)
    return json({ error: "Dữ liệu vượt giới hạn 5 MB." }, 413);
  let input;
  try {
    input = JSON.parse(text);
    if (!Number.isInteger(input.baseRevision) || input.baseRevision < 0)
      throw Error("Revision không hợp lệ");
    validateImport(input.data);
  } catch (e) {
    return json({ error: e.message || "Dữ liệu không hợp lệ." }, 400);
  }
  const payload = JSON.stringify(input.data),
    now = new Date().toISOString();
  const before = await db
    .prepare(
      "SELECT owner_id,payload,revision,updated_at FROM business_state WHERE id=?",
    )
    .bind(key)
    .first();
  if (before && before.owner_id !== user.userId)
    return json(
      { error: "Dữ liệu thuộc tài khoản khác.", code: "forbidden" },
      403,
    );
  if (before && before.payload === payload)
    return json({
      saved: true,
      revision: before.revision,
      updatedAt: before.updated_at,
    });
  if ((before?.revision || 0) !== input.baseRevision)
    return json(
      {
        error:
          "Dữ liệu đã thay đổi trên thiết bị khác. Xuất bản nháp trước khi tải lại.",
        code: "revision_conflict",
        revision: before?.revision || 0,
      },
      409,
    );
  const results = await db.batch([
    db
      .prepare(
        "INSERT OR IGNORE INTO state_versions (state_id,revision,payload,created_at) SELECT id,revision,payload,updated_at FROM business_state WHERE id=? AND revision=? AND owner_id=?",
      )
      .bind(key, input.baseRevision, user.userId),
    db
      .prepare(
        "INSERT INTO business_state (id,owner_id,payload,revision,updated_at) VALUES (?,?,?,1,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,revision=business_state.revision+1,updated_at=excluded.updated_at WHERE business_state.revision=? AND business_state.owner_id=?",
      )
      .bind(key, user.userId, payload, now, input.baseRevision, user.userId),
  ]);
  if (!results[1]?.meta?.changes) {
    const row = await db
      .prepare("SELECT revision,updated_at FROM business_state WHERE id=?")
      .bind(key)
      .first();
    return json(
      {
        error:
          "Dữ liệu đã thay đổi trên thiết bị khác. Xuất bản nháp trước khi tải lại dữ liệu máy chủ.",
        code: "revision_conflict",
        revision: row?.revision,
      },
      409,
    );
  }
  // Keep bounded server-side recovery snapshots; never delete the current state.
  await db
    .prepare(
      "DELETE FROM state_versions WHERE state_id=? AND id NOT IN (SELECT id FROM state_versions WHERE state_id=? ORDER BY revision DESC LIMIT 50)",
    )
    .bind(key, key)
    .run();
  return json({
    saved: true,
    revision: input.baseRevision + 1,
    updatedAt: now,
  });
}
